from django.urls import path
from . views import (RetrieveProfessionalView, ListCreateLanguageView, UpdateLanguagesView, DeleteLanguagesView,
                     ListCreateEducationView, UpdateEducationView,DeleteEducationView,
                     ListCreateExperienceView,UpdateExperienceView,DeleteExperienceView,
                     ListCreateSkillsView,UpdateSkillsView,DeleteSkillsView,
                     RetrieveNormalWorkerView)


urlpatterns = [
    path("professional/worker/user/", RetrieveProfessionalView.as_view(), name="retrieve_update_prof"),

    #Languages routes 
    path("professional/languages/",ListCreateLanguageView.as_view(), name="list_create_languages"),
    path("professional/languages/<uuid:pk>/", UpdateLanguagesView.as_view(), name="update_languages"),
    path("professional/languages/<uuid:pk>/destroy/",DeleteLanguagesView.as_view(), name="delete_language"),

    # education routes 
    path("professional/education/", ListCreateEducationView.as_view(), name="list_create_education"),
    path("professional/education/<uuid:pk>/", UpdateEducationView.as_view(), name="update_education"),
    path("professional/education/<uuid:pk>/destroy/", DeleteEducationView.as_view(), name="delete_educations"),

    #experience routes
    path("professional/experience/", ListCreateExperienceView.as_view(), name="list_create_expe"),
    path("professional/experience/<uuid:pk>/", UpdateExperienceView.as_view(), name="update_experience"),
    path("professional/experience/<uuid:pk>/destroy/",DeleteExperienceView.as_view(), name="delete_experience"),

    # skills routes 
    path("professional/skills/", ListCreateSkillsView.as_view(), name="list_create_skills"),
    path("professional/skills/<uuid:pk>/", UpdateSkillsView.as_view(), name="update_skills"),
    path("professional/skills/<uuid:pk>/destroy/", DeleteSkillsView.as_view(), name="delete_skills"),

    #NORMAL WORKER ROUTE 
    path("user/normal/worker/", RetrieveNormalWorkerView.as_view(), name="normal_worker"),
]