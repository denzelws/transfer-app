from django.db import IntegrityError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.exceptions import ValidationError

from .models import Assignment
from .serializers import AssignmentSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all().order_by("-date", "id")
    serializer_class = AssignmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["driver", "truck", "date"]
    ordering_fields = ["date", "id"]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError as e:
            raise ValidationError(self._friendly_unique_message(e))

    def perform_update(self, serializer):
        try:
            serializer.save()
        except IntegrityError as e:
            raise ValidationError(self._friendly_unique_message(e))

    def _friendly_unique_message(self, e: Exception) -> str:
        msg = str(e).lower()
        if "unique_driver_per_day" in msg or "driver, date" in msg:
            return "This driver is already assigned on this date."
        if "unique_truck_per_day" in msg or "truck, date" in msg:
            return "This truck is already assigned on this date."
        return "Unique constraint violated."
