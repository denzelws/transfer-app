from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from drivers.views import DriverViewSet
from trucks.views import TruckViewSet

router = DefaultRouter()
router.register(r"drivers", DriverViewSet, basename="driver")
router.register(r"trucks", TruckViewSet, basename="truck")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
