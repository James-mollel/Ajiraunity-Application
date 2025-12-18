from django.db import models

# Create your models here.


class Region(models.Model):
    name = models.CharField(max_length=150, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Region"
        verbose_name_plural = "Regions"

    def __str__(self):
        return self.name

class District(models.Model):
    name = models.CharField(max_length=150, blank=True, null=True)
    region = models.ForeignKey(Region, on_delete= models.CASCADE, blank=True, null=True, related_name='districts')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('name',"region")
        ordering = ["name"]
        verbose_name = "District"
        verbose_name_plural = "Districts"
        indexes = [models.Index(fields=["name"])]

    def __str__(self):
        return f"{self.name} | {self.region.name}"
    

class Ward(models.Model): 
    name = models.CharField(max_length=150, blank=True, null=True)
    district =  models.ForeignKey(District, on_delete=models.CASCADE, blank=True, null=True, related_name='wards')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("name","district")
        ordering = ["name"]
        verbose_name = "Ward"
        verbose_name_plural = "Wards"
        indexes = [models.Index(fields=["name"])]
    
    def __str__(self):
        return f"{self.name} | {self.district.name}"
    