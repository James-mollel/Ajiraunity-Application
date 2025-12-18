from django.contrib import admin
from .models import CustomUserModel, UsersProfile, Feedback
# Register your models here.

@admin.register(CustomUserModel)
class CustomUserModelAdmin(admin.ModelAdmin):
    list_display = ['email','role','date_joined','is_active','is_staff','is_superuser']
    search_fields = ["email"]
    list_filter = ["role","is_superuser","is_staff","is_active","date_joined"]

@admin.register(UsersProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user','first_name','phone_number']
    search_fields = ['first_name','user']
    list_filter = ['phone_verified']


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ["rating","email","created_at"]
    list_filter = ["created_at","rating"]
 