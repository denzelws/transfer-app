from django.test import TestCase
from rest_framework.test import APIClient

from trucks.models import Truck


class TruckAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_valid_truck(self):
        payload = {
            "plate": "ABC1D23",
            "model": "Volvo FH",
            "year": 2020,
            "minimum_license_type": "C",
        }
        r = self.client.post("/api/trucks/", payload, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertIn("id", r.json())

    def test_reject_invalid_plate(self):
        payload = {
            "plate": "INVALID",
            "model": "Volvo FH",
            "year": 2020,
            "minimum_license_type": "C",
        }
        r = self.client.post("/api/trucks/", payload, format="json")
        self.assertEqual(r.status_code, 400)

    def test_reject_invalid_min_license(self):
        payload = {
            "plate": "XYZ9A45",
            "model": "Scania R",
            "year": 2021,
            "minimum_license_type": "Z",
        }
        r = self.client.post("/api/trucks/", payload, format="json")
        self.assertEqual(r.status_code, 400)

    def test_unique_plate(self):
        Truck.objects.create(plate="JKL2E34", model="Iveco", year=2019, minimum_license_type="B")
        payload = {"plate": "JKL2E34", "model": "Iveco", "year": 2020, "minimum_license_type": "B"}
        r = self.client.post("/api/trucks/", payload, format="json")
        self.assertEqual(r.status_code, 400)

    def test_list_and_detail(self):
        t = Truck.objects.create(
            plate="MNO3B67", model="Mercedes Actros", year=2022, minimum_license_type="D"
        )
        r1 = self.client.get("/api/trucks/")
        self.assertEqual(r1.status_code, 200)
        r2 = self.client.get(f"/api/trucks/{t.id}/")
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()["id"], t.id)
