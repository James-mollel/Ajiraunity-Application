from . views import RegionListView, WardsListView, DistrictListView
from django.urls import path

urlpatterns = [
    path("all/regions/", RegionListView.as_view(), name="list_all_region"),
    path("all/districts/", DistrictListView.as_view(), name="list_districts"),
    path("all/wards/list/",WardsListView.as_view(), name="list_all_wards"),
]