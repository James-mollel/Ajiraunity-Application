from django.contrib import admin
from JobDetails.models import JobApplication, ReportedJob, SavedJobs
# Register your models here.

@admin.register(JobApplication)
class AdminJobApplication(admin.ModelAdmin):
    list_display = ["job","user","application_method","status","applied_at"]
    list_filter=["status","application_method"]
    search_fields = ["job","user"]

 

@admin.register(SavedJobs)
class AdminSavedJob(admin.ModelAdmin):
    list_display = ["user","job","saved_at"]
    list_filter = ['saved_at']


@admin.register(ReportedJob)
class ReportedJobAdmin(admin.ModelAdmin):
    list_display = ["job","job_reporter","reason","is_resolved","resolved_at","created_at"]
    list_filter=["reason","created_at"]

