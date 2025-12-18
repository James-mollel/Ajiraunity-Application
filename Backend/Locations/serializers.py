from .models import Region, Ward, District
from rest_framework import serializers

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ("id","name")
        read_only_fields = ("id",)

class DistrictSerializer(serializers.ModelSerializer):
    region = serializers.PrimaryKeyRelatedField(read_only = True)# this take only id of the region (and can be used to update and retrieve)
    class Meta: 
        model = District
        fields = ("id","name","region")
        read_only_fields = ("id","region")

class WardSerializer(serializers.ModelSerializer):
    district = serializers.PrimaryKeyRelatedField(read_only = True)# district the name of model field?
    class Meta:
        model = Ward
        fields = ("id","name","district")
        read_only_fields = ("id","district")