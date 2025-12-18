from django.contrib import admin
from .models import Region, Ward,District
# Register your models here.

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ["name","created_at"]
    search_fields = ["name"]


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ["region","name","created_at"]
    search_fields = ["name"]
    list_filter = ["region"]


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ["district","name","created_at"]
    search_fields = ["name"]
    list_filter = ["district"]
