from django.db import models

from drivers.models import Driver
from trucks.models import Truck

LICENSE_ORDER = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}


class Assignment(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="assignments")
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE, related_name="assignments")
    date = models.DateField()

    class Meta:
        indexes = [
            models.Index(fields=["driver", "date"]),
            models.Index(fields=["truck", "date"]),
        ]

    def __str__(self):
        return f"{self.date} - {self.driver.name} -> {self.truck.plate}"
