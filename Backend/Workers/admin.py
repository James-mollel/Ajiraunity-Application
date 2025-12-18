from django.contrib import admin
from Workers.models import ( ProfessionalDetail, ProfessionalSkills,
                            ProfessionalEducations,ProfessionalLanguages,
                            ProfessionalExperience,NormalWorkerDetail  )

# Register your models here.

@admin.register(ProfessionalDetail)
class ProfessionalAdmin(admin.ModelAdmin):
    list_display = ["prof_profile","job_title","created_at","updated_at"]
    list_filter = ["created_at","updated_at"]


@admin.register(ProfessionalSkills)
class SkillsAdmin(admin.ModelAdmin):
    list_display = ["owner","skill","created_at"]
    list_filter = ["created_at"]



@admin.register(ProfessionalLanguages)
class LanguagesAdmin(admin.ModelAdmin):
    list_display = ["owner","language","created_at"]
    list_filter = ["created_at"]


@admin.register(ProfessionalEducations)
class EducationAdmin(admin.ModelAdmin):
    list_display = ["owner","school","created_at","updated_at"]
    list_filter = ["created_at","updated_at" ]


@admin.register(ProfessionalExperience)
class EducationAdmin(admin.ModelAdmin):
    list_display = ["owner","company","current_working","created_at","updated_at"]
    list_filter = ["created_at","updated_at" ]


@admin.register(NormalWorkerDetail)
class NormalWorkerAdmin(admin.ModelAdmin):
    list_display = ["worker","title","created_at","updated_at"]
    list_filter = ["updated_at","created_at"]
