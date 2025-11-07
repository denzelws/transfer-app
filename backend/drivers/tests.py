from django.test import TestCase
from rest_framework.test import APIClient

from drivers.models import Driver


class DriverAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_valid_driver(self):
        r = self.client.post("/api/drivers/", {"name": "Alice", "license_type": "D"}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertIn("id", r.json())

    def test_reject_invalid_license_type(self):
        r = self.client.post("/api/drivers/", {"name": "Bob", "license_type": "Z"}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_name_required(self):
        r = self.client.post("/api/drivers/", {"name": "", "license_type": "B"}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_list_and_detail(self):
        d = Driver.objects.create(name="Carol", license_type="C")
        r1 = self.client.get("/api/drivers/")
        self.assertEqual(r1.status_code, 200)
        r2 = self.client.get(f"/api/drivers/{d.id}/")
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()["id"], d.id)
