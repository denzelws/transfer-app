from rest_framework import viewsets

from .models import Truck
from .serializers import TruckSerializer


class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all().order_by("id")
    serializer_class = TruckSerializer
