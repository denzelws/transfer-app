import datetime

from django.test import TestCase
from rest_framework.test import APIClient

from drivers.models import Driver
from trucks.models import Truck

DATE1 = datetime.date(2025, 11, 10)
DATE2 = datetime.date(2025, 11, 11)
DATE3 = datetime.date(2025, 11, 12)


class AssignmentAPITests(TestCase):
    def setUp(self):
        # Drivers: A < B < C < D < E
        self.alice = Driver.objects.create(name="Alice", license_type="D")
        self.bob = Driver.objects.create(name="Bob", license_type="B")
        self.carol = Driver.objects.create(name="Carol", license_type="C")
        self.dan = Driver.objects.create(name="Dan", license_type="E")

        # Trucks with minimum license requirements
        self.scania = Truck.objects.create(
            plate="ABC1D23", model="Scania R500", year=2021, minimum_license_type="D"
        )
        self.volvo = Truck.objects.create(
            plate="XYZ9A45", model="Volvo FH", year=2020, minimum_license_type="C"
        )
        self.iveco = Truck.objects.create(
            plate="JKL2E34", model="Iveco Hi-Way", year=2019, minimum_license_type="B"
        )

        self.client = APIClient()

    # -------------- Helpers --------------
    def _post_assignment(self, driver, truck, date, expect=201):
        payload = {"driver": driver.id, "truck": truck.id, "date": str(date)}
        r = self.client.post("/api/assignments/", payload, format="json")
        assert r.status_code == expect, r.content
        return r

    def _items(self, response_json):
        return (
            response_json["results"]
            if isinstance(response_json, dict) and "results" in response_json
            else response_json
        )

    def test_create_valid_equal_license(self):
        r = self._post_assignment(self.carol, self.volvo, DATE1, expect=201)
        self.assertIn("id", r.json())

    def test_create_valid_higher_license(self):
        r = self._post_assignment(self.alice, self.volvo, DATE1, expect=201)
        self.assertIn("id", r.json())

    def test_create_insufficient_license(self):
        r = self._post_assignment(self.bob, self.volvo, DATE1, expect=400)
        self.assertIn("insufficient", str(r.json()).lower())

    def test_create_duplicate_driver_same_day(self):
        self._post_assignment(self.alice, self.volvo, DATE1, expect=201)
        r = self._post_assignment(self.alice, self.scania, DATE1, expect=400)
        self.assertIn("driver is already assigned", str(r.json()).lower())

    def test_create_duplicate_truck_same_day(self):
        self._post_assignment(self.alice, self.volvo, DATE1, expect=201)
        r = self._post_assignment(self.carol, self.volvo, DATE1, expect=400)
        self.assertIn("truck is already assigned", str(r.json()).lower())

    # -------------- PATCH (partial updates) --------------
    def test_patch_conflict_truck_same_day(self):
        a1 = self._post_assignment(self.alice, self.volvo, DATE1).json()
        a2 = self._post_assignment(self.carol, self.volvo, DATE2).json()

        # Move a2 to DATE1 where volvo is already taken
        r = self.client.patch(f"/api/assignments/{a2['id']}/", {"date": str(DATE1)}, format="json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("truck is already assigned", str(r.json()).lower())

    def test_patch_conflict_driver_same_day(self):
        a1 = self._post_assignment(self.alice, self.volvo, DATE1).json()
        a2 = self._post_assignment(self.carol, self.iveco, DATE1).json()

        r = self.client.patch(
            f"/api/assignments/{a2['id']}/", {"driver": self.alice.id}, format="json"
        )
        self.assertEqual(r.status_code, 400)
        self.assertIn("driver is already assigned", str(r.json()).lower())

    def test_patch_insufficient_license(self):
        a = self._post_assignment(self.bob, self.iveco, DATE2).json()
        r = self.client.patch(
            f"/api/assignments/{a['id']}/", {"truck": self.volvo.id}, format="json"
        )
        self.assertEqual(r.status_code, 400)
        self.assertIn("insufficient", str(r.json()).lower())

    def test_patch_valid_change_date(self):
        a = self._post_assignment(self.alice, self.volvo, DATE1).json()
        r = self.client.patch(f"/api/assignments/{a['id']}/", {"date": str(DATE3)}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["date"], str(DATE3))

    def test_list_filters_and_ordering_and_pagination(self):
        self._post_assignment(self.alice, self.volvo, DATE1)
        self._post_assignment(self.carol, self.volvo, DATE2)
        self._post_assignment(self.dan, self.scania, DATE3)

        r = self.client.get(f"/api/assignments/?driver={self.alice.id}")
        self.assertEqual(r.status_code, 200)
        items = self._items(r.json())
        self.assertTrue(items)
        self.assertTrue(all(item["driver"] == self.alice.id for item in items))

        r1 = self.client.get("/api/assignments/?ordering=date")
        r2 = self.client.get("/api/assignments/?ordering=-date")
        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r2.status_code, 200)

        items1 = self._items(r1.json())
        items2 = self._items(r2.json())
        dates1 = [i["date"] for i in items1]
        dates2 = [i["date"] for i in items2]
        self.assertEqual(dates1, sorted(dates1))
        self.assertEqual(dates2, sorted(dates2, reverse=True))
