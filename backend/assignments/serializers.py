# backend/assignments/serializers.py
from rest_framework import serializers

from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ["id", "driver", "truck", "date"]

    def validate(self, attrs):
        driver = attrs.get("driver") or getattr(self.instance, "driver", None)
        truck = attrs.get("truck") or getattr(self.instance, "truck", None)
        date = attrs.get("date") or getattr(self.instance, "date", None)

        if not (driver and truck and date):
            return attrs

        if driver.license_type < truck.minimum_license_type:
            raise serializers.ValidationError(
                f"Driver license '{driver.license_type}' is insufficient for truck requiring '{truck.minimum_license_type}'."  # noqa: E501
            )

        qs = Assignment.objects.filter(driver=driver, date=date)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This driver is already assigned on this date.")

        qs = Assignment.objects.filter(truck=truck, date=date)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This truck is already assigned on this date.")

        return attrs
