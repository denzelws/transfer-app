from django.db import models

from shared.enums import LicenseType


class Driver(models.Model):
    name = models.CharField(max_length=255)
    license_type = models.CharField(max_length=1, choices=LicenseType.choices)

    def __str__(self):
        return f"{self.name} ({self.license_type})"
