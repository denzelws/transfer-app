from django.db import models


class LicenseType(models.TextChoices):
    A = "A", "Category A"
    B = "B", "Category B"
    C = "C", "Category C"
    D = "D", "Category D"
    E = "E", "Category E"
