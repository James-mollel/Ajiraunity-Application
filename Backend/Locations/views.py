from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import RegionSerializer,WardSerializer,DistrictSerializer
from .models import Ward,Region,District
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings

# Create your views here.
 
CACHE_TTL = getattr(settings, "SHORT_CACHE_TTL", 60 * 5)


@method_decorator(cache_page(CACHE_TTL), name='dispatch')
class RegionListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Region.objects.only("id","name").order_by("name")
    serializer_class = RegionSerializer


@method_decorator(cache_page(CACHE_TTL), name="dispatch")
class DistrictListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DistrictSerializer

    def get_queryset(self):
        region_id = self.request.query_params.get("region_id")
        districts = District.objects.select_related("region").only("id","name","region_id").order_by("name")

        if region_id:
            districts = districts.filter(region__id=region_id)
        return districts
    
@method_decorator(cache_page(CACHE_TTL), name="dispatch")
class WardsListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = WardSerializer

    def get_queryset(self):
        district_id = self.request.query_params.get("district_id")
        wards = Ward.objects.select_related("district").only(
            "id","name","district_id"
        ).order_by("name") # the district_id the FK field automatically created
        
        if (district_id):
            wards =wards.filter(district__id = district_id)
        return wards



