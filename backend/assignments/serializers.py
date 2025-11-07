from rest_framework import serializers

from .models import LICENSE_ORDER, Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ["id", "driver", "truck", "date"]

    def validate(self, attrs):
        driver = attrs["driver"]
        truck = attrs["truck"]
        date = attrs["date"]

        qs = Assignment.objects.filter(date=date)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.filter(driver=driver).exists():
            raise serializers.ValidationError("This driver is already assigned on this date.")
        if qs.filter(truck=truck).exists():
            raise serializers.ValidationError("This truck is already assigned on this date.")

        if LICENSE_ORDER[driver.license_type] < LICENSE_ORDER[truck.minimum_license_type]:
            raise serializers.ValidationError(
                f"Driver license '{driver.license_type}' is insufficient for truck requiring "
                f"'{truck.minimum_license_type}'."
            )
        return attrs
