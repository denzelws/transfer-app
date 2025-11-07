from django.contrib import admin

from .models import Truck


@admin.register(Truck)
class TruckAdmin(admin.ModelAdmin):
    list_display = ("id", "plate", "model", "year", "minimum_license_type")
    search_fields = ("plate", "model")
    list_filter = ("year", "minimum_license_type")
    ordering = ("id",)
