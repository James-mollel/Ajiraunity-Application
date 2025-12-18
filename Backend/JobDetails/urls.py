from django.urls import path
from .views import (
    CreateJobApplicationView, ListJobApplicationView,ReportJobView, SaveJobUnsaveJobView,
    ShortProfileView, ViewAppliedJobView, ListSavedJobsView, ListJobApplicantToEmoloyerView,
    RetrieveApplicationView,UpdateApplicationStatusView
)

urlpatterns = [
    path("user/applications-apply/jobs/", CreateJobApplicationView.as_view(), name="user_apply_job"),
    path("user/list-jobs/applications/", ListJobApplicationView.as_view(), name="list_all_applications"),
    path("user/view-applied-job/<uuid:pk>/", ViewAppliedJobView.as_view(), name="view-applied-job-job_seeker"),

    # =============SHORT PROFILE PATH==========
    path("user/jobseeker/user-data/", ShortProfileView.as_view(), name="return_short_profile_info"),

    #REPORT JOB
    path("user/report-invalid/jobs/", ReportJobView.as_view(), name="user_report_job"),
    #SAVE UNSAVE JOBS
    path("user/save-unsave/job/", SaveJobUnsaveJobView.as_view(), name="user_save_unsave_jobs"),
    path("user/list/jobs-saved/", ListSavedJobsView.as_view(), name="list_all_saved_jobs"),


    #----------------APPLICANTS------------------
    path("employer/list/jobs-applicants/", ListJobApplicantToEmoloyerView.as_view(), name="list_job_applicants"),
    path("employer/view/<uuid:pk>/", RetrieveApplicationView.as_view(), name="retrieve_application"),

    path("application/status/<uuid:pk>/update/", UpdateApplicationStatusView.as_view(), name="update_application_status")

]