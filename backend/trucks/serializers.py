from datetime import datetime

from rest_framework import serializers

from .models import Truck


class TruckSerializer(serializers.ModelSerializer):
    minimum_license_type_label = serializers.CharField(
        source="get_minimum_license_type_display", read_only=True
    )

    class Meta:
        model = Truck
        fields = [
            "id",
            "plate",
            "model",
            "year",
            "minimum_license_type",
            "minimum_license_type_label",
        ]

    def validate_year(self, value):
        current_year = datetime.now().year
        if value < 1900 or value > current_year + 1:
            raise serializers.ValidationError("Year must be between 1900 and next year.")
        return value
