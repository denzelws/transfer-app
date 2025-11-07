from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from assignments.views import AssignmentViewSet
from drivers.views import DriverViewSet
from trucks.views import TruckViewSet

router = DefaultRouter()
router.register(r"drivers", DriverViewSet, basename="driver")
router.register(r"trucks", TruckViewSet, basename="truck")
router.register(r"assignments", AssignmentViewSet, basename="assignment")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
