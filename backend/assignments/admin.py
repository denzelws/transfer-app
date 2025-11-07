from django.contrib import admin

from .models import Assignment


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("id", "date", "driver", "truck")
    list_filter = ("date",)
    search_fields = ("driver__name", "truck__plate")
    ordering = ("-date", "id")
