import re

from django.core.exceptions import ValidationError
from django.db import models

from shared.enums import LicenseType

PLATE_REGEX = re.compile(r"^[A-Z]{3}\d[A-Z0-9]\d{2}$")


def validate_plate(value: str):
    value = value.upper()
    if not PLATE_REGEX.match(value):
        raise ValidationError("Invalid plate format (expected Mercosul pattern, e.g., ABC1D23).")vb 


class Truck(models.Model):
    plate = models.CharField(max_length=7, unique=True, validators=[validate_plate])
    model = models.CharField(max_length=255)
    year = models.PositiveIntegerField()
    minimum_license_type = models.CharField(
        max_length=1,
        choices=LicenseType.choices,
        default=LicenseType.C,
    )

    def save(self, *args, **kwargs):
        self.plate = self.plate.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.plate} - {self.model}"
