from django.contrib import admin
from .models import JobCategory, Job,Company

# Register your models here.

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ["name","sw_name","category_type","created_at"]
    search_fields = ["name","sw_name"]
    list_filter = ["category_type"]




@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ["poster","post_type","title","code","applied","status","salary_visible","created_at","updated_at"]
    search_fields = ["code","title"]
    list_filter = ["created_at","updated_at","status"]

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["owner","name","email","is_verified","created_at","updated_at"]
    list_filter =["created_at","updated_at"]
    
