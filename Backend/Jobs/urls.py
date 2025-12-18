from django.urls import path
from .views import (ProfessionalJobsCategoryView, CasualJobsCategoryView, ListCreateCompanyView,
                    ViewUpdateDestroyCompanyView,CreateIndividualJobView,CreateCompanyJobView,
                    ListJobsView, ViewUpdateDestroyJobsView, ListJobsPublicView, JobsSuggestionsSearchView,
                    RetrieveJobPublicView,CloseJobView)

urlpatterns = [
    # ===============JOBS CATEGORY =============
    path("category/category-professional/", ProfessionalJobsCategoryView.as_view(), name="all_professional_category"),
    path("category/categories-informal/", CasualJobsCategoryView.as_view(), name="casual_job_category"),

    #==========COMPANY ROUTES======
    path("company/user-list-creates/",ListCreateCompanyView.as_view(), name="employer_create_list_company" ),
    path("company/user-retrieve/<uuid:pk>/comp/", ViewUpdateDestroyCompanyView.as_view(), name="employer_create_destroy_update"),
 
    #===============JOBS ROUTES=========
    path("jobs/individual/create/", CreateIndividualJobView.as_view(), name="create_individual_jobs"),
    path("jobs/company-based/create/", CreateCompanyJobView.as_view(), name="create_company_jobs"),
    path("jobs/all-jobs-list/", ListJobsView.as_view(), name="view_all_jobs"),
    path("jobs/user-retrieve-update/<uuid:pk>/job/", ViewUpdateDestroyJobsView.as_view(), name="view_update_delete_job"),

    #================= CLOSE JOB-------------
    path("jobs/close-job-employer/<uuid:job_id>/close/", CloseJobView.as_view(), name="close_a_job"),


    #-----------LIST --------------JOBS ----------------PUBLIC-----------########
    path("public/jobs/lists/", ListJobsPublicView.as_view(), name="list_all_jobs_public"),
    path("public/jobs/search/suggestions/", JobsSuggestionsSearchView.as_view(), name="search_public_jobs"),

    path("retrieve/job/<slug:slug>/", RetrieveJobPublicView.as_view(), name="retrieve_job_public"),

 

    
]