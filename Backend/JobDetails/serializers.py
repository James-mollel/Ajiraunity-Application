from JobDetails.models import JobApplication, ReportedJob, SavedJobs
from rest_framework import serializers
from Users.models import UsersProfile,CustomUserModel
from Jobs.models import Job
from django.db import transaction
from django.conf import settings
from Workers.models import ( ProfessionalDetail, NormalWorkerDetail, ProfessionalSkills,
                             ProfessionalLanguages, ProfessionalEducations, ProfessionalExperience)


class ReturnJobApplicationResponseSerializer(serializers.ModelSerializer):
     application_url = serializers.SerializerMethodField(read_only = True)
     class Meta:
         model = JobApplication
         fields = ("application_url",)
  

     def get_application_url(self,obj):
        request = self.context.get("request")
        if not request:
            return None
        
        return f"{settings.FRONTEND_URL}/dashboard-user-employer/view-application-details-employer/{obj.id}"



class ListAppliedJobsSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only = True)

    job_post_type = serializers.CharField(source="job.post_type", read_only = True)
    job_type = serializers.CharField(source="job.get_job_type_display", read_only = True, allow_null = True)
    job_code = serializers.CharField(source="job.code", read_only = True)

    job_company_name = serializers.CharField(source="job.company.name", read_only = True)
    job_company_address = serializers.CharField(source="job.company.address", read_only = True, allow_null = True)

    
    job_region = serializers.CharField(source="job.region.name", read_only = True)
    job_district = serializers.CharField(source="job.district.name", read_only = True)
    job_ward = serializers.CharField(source="job.ward.name", read_only = True, allow_null = True)


    job_salary_max = serializers.IntegerField(source="job.salary_max", read_only = True, allow_null = True)
    job_salary_min = serializers.IntegerField(source="job.salary_min", read_only = True, allow_null = True)
    job_currency = serializers.CharField(source="job.currency", read_only = True)
    job_payment_period = serializers.CharField(source="job.get_payment_period_display", read_only = True, allow_null = True)


    cv = serializers.SerializerMethodField(read_only = True)
    application_method_display = serializers.CharField(source="get_application_method_display", read_only = True, allow_null = True)
   
    class Meta:
        model = JobApplication
        fields = ("id","cv","cover_letter","status","applied_at",
                 "job_title","job_post_type","job_type", "job_code",
                  
                  "job_company_name","job_company_address",

                    "job_region","job_district","job_ward",
                    
                    "job_salary_max","job_salary_min","job_currency","job_payment_period",

                   "application_method_display" )
        
        read_only_fields = ("id",)



    def get_cv(self, obj):
     
        if obj.cv:
            return obj.cv.url.replace("http://","https://")
            
        return None



###################  JOBS APPLICATION ---------=====
class JobApplicationSerializer(serializers.ModelSerializer):
    cv = serializers.FileField(write_only = True, required= False)

    job_slug = serializers.CharField(write_only = True)

   
    
    class Meta:
        model = JobApplication
        fields = ("id","job","job_slug","user",
                  "application_method","cv","cover_letter",
                  "status","applied_at")
        
        
        read_only_fields = ("id","applied_at","user","status")
        extra_kwargs = {
            "job": {"write_only": True, "required":False}
        }
   

       


    def validate(self, attrs):
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request")
        
        if request.user.role != CustomUserModel.Roles.WORKER:
            raise serializers.ValidationError("Only job seeker can apply to jobs!")

        
        user_profile = getattr(request.user, "user_profile", None)
        if user_profile is None:
            raise serializers.ValidationError("User profile not found!")
        


        
        cv = attrs.get("cv")
        if cv is not None:
            max_size = 2* 1024 * 1024
            try:
                cv_size =  getattr(cv, "size", None)
            except Exception:
                raise serializers.ValidationError("Error occur while getting file size!")
            if cv_size > max_size:
                raise serializers.ValidationError("CV file is too large. Maximum size is 2MB")

                
            valid_extensions = ["pdf","doc","docx"]
            name = getattr(cv, "name","")
            extension = name.split('.')[-1].lower()

            if extension not in valid_extensions:
               raise serializers.ValidationError("Invalid file type. Only PDF, DOC, DOCX are allowed.")


        


        
        job_slug = attrs.pop("job_slug", None)
        if not job_slug:
            raise serializers.ValidationError("Job slug is  required!")

        try:
            applied_job= Job.objects.get(slug = job_slug)
        except Job.DoesNotExist:
            raise serializers.ValidationError("Selected Job not found")
        
        if applied_job.status != Job.JobStatus.ACTIVE:
            raise serializers.ValidationError("This job does not allow applications")
        
        
        if JobApplication.objects.filter(user = user_profile, job = applied_job).exists():
            raise serializers.ValidationError("You already applied for this job")
        
        attrs["job"] = applied_job

        
        #IF APPLICATION IS COMPANY
        if applied_job.post_type == Job.PostType.COMPANY:
            professional_profile = getattr(user_profile, "professional_detail", None)

            if professional_profile is None:
                raise serializers.ValidationError(
                "You must create a professional profile to apply for this kind of job"
                )
            
            existing_cv = professional_profile.cv
            new_cv = attrs.get("cv")

            if not existing_cv and not new_cv:
                raise serializers.ValidationError("A CV is required to apply for this job. ")
        
            
        return super().validate(attrs)
    



    
    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request")
        
        user_profile = request.user.user_profile

        job = validated_data.get("job")
        new_cv = validated_data.get("cv") 

        application_method = validated_data.get("application_method")

        with transaction.atomic():
            cv_to_save = None
            if job.post_type == Job.PostType.COMPANY:  
                professional = getattr(user_profile, "professional_detail", None)
                if professional is None:
                    raise serializers.ValidationError("Professional profile is required when apply this kind of job!")
                
                if new_cv:
                    professional.cv = new_cv
                    professional.save()

                    cv_to_save = professional.cv
                else:

                    cv_to_save = professional.cv
            
            application = JobApplication.objects.create(
                job = job,
                user = user_profile,
                cv = cv_to_save,
                status = JobApplication.JobStatus.PENDING ,
                cover_letter = validated_data.get("cover_letter"),
                application_method = application_method,
            )

        return application
    





#REPORT FOR A JOB 

class ReportJobSerializer(serializers.ModelSerializer):
    job_slug = serializers.CharField(write_only = True)
    class Meta:
        model = ReportedJob 
        fields = ("job_slug","job_reporter","reason", "description","job",
                  "is_resolved", "resolved_at")
        read_only_fields = ("job_reporter", "is_resolved", "resolved_at","job")

       

    
    def validate(self, attrs): 

        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request")

        description = attrs.get("description")
        if description is  None or len(description.strip()) < 20:
            raise serializers.ValidationError("Description must be at least 20 characters.")
        
        reason = attrs.get("reason")
        if not reason:
            raise serializers.ValidationError("Reason required!")
        
        
        job_slug = attrs.pop("job_slug", None)
        if not job_slug:
            raise serializers.ValidationError("Job slug is required")
        
        try:
            reported_job = Job.objects.get(slug = job_slug)
        except Job.DoesNotExist:
            raise serializers.ValidationError("Job was not found")
        
        if reported_job.status != Job.JobStatus.ACTIVE:
            raise serializers.ValidationError("Only active jobs can be reported")
        
        if ReportedJob.objects.filter(job = reported_job, job_reporter = request.user, reason = reason ).exists():
            raise serializers.ValidationError("You already report this Job")
        
        attrs["job"] = reported_job
        
        return super().validate(attrs)
    
    
    def create(self, validated_data):
        request = self.context.get("request")
        job_reporter = request.user
        validated_data["job_reporter"] = job_reporter
        
        return super().create(validated_data)
    


#============RETURN SHORT INFO PROFILES ==========


# professional detais serializer
class ReturnShortProfileSerializer(serializers.ModelSerializer):
    current_cv = serializers.SerializerMethodField(read_only = True)
    full_name = serializers.SerializerMethodField(read_only = True)
    job_title = serializers.SerializerMethodField(read_only = True)
    email = serializers.EmailField(source = "user.email", read_only = True)
    
    class Meta: 
        model = UsersProfile
        fields = ("full_name",
                  "email",
                  "job_title",
                  "phone_number",
                 "current_cv",
                )
        

    def get_full_name(self, obj):
        f_name = getattr(obj, "first_name", "")
        l_name = getattr(obj, "last_name", "")

        full_name = f"{f_name} {l_name}".strip()

        return full_name if full_name else None
    
    
    def get_job_title(self, obj):
        try:
            normal = obj.normal_workers
        except NormalWorkerDetail.DoesNotExist:
            normal = None
        
        if normal is not None:
            return normal.title
        
        try:
            professional = obj.professional_detail
        except ProfessionalDetail.DoesNotExist:
            professional = None
        
        if professional is not None:
            return professional.job_title
        
        return None
        


    def get_current_cv(self, obj):
        try:
            professional = obj.professional_detail
        except ProfessionalDetail.DoesNotExist:
            professional = None 
        
        if professional is not None and professional.cv:
             return professional.cv.url.replace("http://","https://")
        
        return None
    

class ListSavedJobsSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only = True)
    job_post_type = serializers.CharField(source="job.post_type", read_only = True)

    job_region = serializers.CharField(source="job.region.name", read_only = True)
    job_district = serializers.CharField(source="job.district.name", read_only = True)
    job_ward = serializers.CharField(source="job.ward.name", read_only = True)

    job_salary_max = serializers.CharField(source="job.salary_max", read_only = True)
    job_salary_min = serializers.CharField(source="job.salary_min", read_only = True)
    job_currency = serializers.CharField(source="job.currency", read_only = True)
    job_payment_period = serializers.CharField(source="job.get_payment_period_display", read_only = True)

    job_slug = serializers.CharField(source="job.slug", read_only = True)

    job_deadline = serializers.CharField(source="job.deadline", read_only = True)
    
    class Meta:
        model = SavedJobs
        fields = ("id","job_title","job_post_type","job_slug",
                  
                  "job_region","job_district","job_ward",
                  
                  "job_salary_max","job_salary_min","job_currency","job_payment_period",
                  "job_deadline","saved_at")
        





# ==============-------------JOB APPLICATIONS ---------------===================
class ProfessionalApplicantSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSkills
        fields = (
            "skill",
        )

class ProfessionalApplicantLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalLanguages
        fields = (
            "language","level",
        )  



class ProfessionalApplicantEducationSerializer(serializers.ModelSerializer):
    education_level_dispaly = serializers.CharField(source = "get_education_level_display")
    class Meta:
        model = ProfessionalEducations
        fields = (
            "school","degree","field_of_study",
            "start_year","end_year","education_level_dispaly",
        )




class ProfessionalApplicantExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalExperience
        fields = (
            "company","location","role",
            "start_date","end_date","current_working",
            'responsibilities',
        )




class ProfessionalApplicantSerializer(serializers.ModelSerializer):
    personal_info = serializers.SerializerMethodField()

    skills = ProfessionalApplicantSkillsSerializer(many = True, source="skills_professional",read_only = True)
    languages = ProfessionalApplicantLanguageSerializer(many = True, source="languages_professional",read_only = True)

    educations = ProfessionalApplicantEducationSerializer(many = True, source="education_professional",read_only = True)
    experiences = ProfessionalApplicantExperienceSerializer(many = True, source="professional_experience",read_only = True)

    payment_period_dispaly = serializers.CharField(source = "get_prof_payment_period_display")
    employment_status_dispaly = serializers.CharField(source = "get_employment_status_display")
    experience_yrs_dispaly = serializers.CharField(source = "get_experience_yrs_display")
    education_level_dispaly = serializers.CharField(source = "get_education_level_display")


    class Meta:
        model = ProfessionalDetail

        fields = (
            "personal_info",

            "job_title",
            "prof_salary",
            "prof_currency",
            "payment_period_dispaly",

            "linkedIn",
            "portfolio",
            "gitHub",

            "employment_status_dispaly",
            "experience_yrs_dispaly",
            "education_level_dispaly",
            "prof_description",

            "skills",
            "languages",
            "educations",
            "experiences",

        )

    def get_personal_info(self, obj):
        profile = obj.prof_profile

        request = self.context.get("request")


        avatar_url = profile.avatar.url.replace("http://","https://") if profile.avatar else None

        return {
            "email": profile.user.email,
            "first_name": profile.first_name if profile.first_name else None,
            "last_name":profile.last_name if profile.last_name else None,
            "gender":profile.gender if profile.gender else None,
            "phone_number":profile.phone_number if profile.phone_number else None,

            "region":profile.region.name if profile.region else None,
            "district":profile.district.name if profile.district else None,
            "ward":profile.ward.name if profile.ward else None,

            "avatar":avatar_url,

        }




#--------------------NORMAL WORKER ------------### ## ### # ### ##__________________

class NormalApplicantsSerializer(serializers.ModelSerializer):
    personal_info = serializers.SerializerMethodField()
    availability_display = serializers.CharField(source = "get_availability_display")
    payment_period_dispaly = serializers.CharField(source = "get_payment_period_display")

    class Meta:
        model = NormalWorkerDetail
        fields = (
            "personal_info",

            "title",
            "salary",
            "currency",
            "payment_period_dispaly",

            "availability_display",
            "experience_level",
            "description",

        )

    def get_personal_info(self, obj):
        profile = obj.worker

        request = self.context.get("request")


        avatar_url = profile.avatar.url.replace("http://","https://") if profile.avatar else None

        return {
            "email": profile.user.email,
            "first_name": profile.first_name if profile.first_name else None,
            "last_name":profile.last_name if profile.last_name else None,
            "gender":profile.gender if profile.gender else None,
            "phone_number":profile.phone_number if profile.phone_number else None,

            "region":profile.region.name if profile.region else None,
            "district":profile.district.name if profile.district else None,
            "ward":profile.ward.name if profile.ward else None,

            "avatar":avatar_url,

        }




#|||||||||||||||||||||=====********JOB APPLICATIONS "MAIN"*************====||||||||||||||||||||

class JobApplicationDetailSerializer(serializers.ModelSerializer):
    job_id = serializers.UUIDField(source ="job.id" , read_only= True)
    job_title = serializers.CharField(source = "job.title", read_only = True)
    job_code = serializers.CharField(source = "job.code", read_only = True)
    job_post_type = serializers.CharField(source = "job.post_type", read_only = True)

    application_method_display = serializers.CharField(source = "get_application_method_display")

    applicant_info = serializers.SerializerMethodField()


    cv = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = JobApplication
        fields = (
            "applicant_info",

            "id","application_method_display","cv",
            "cover_letter","status",
            "applied_at",

            "job_id","job_title",
            "job_code","job_post_type",

        )
        read_only_fields = ("id","applied_at")

    def get_cv(self, obj):
        if obj.cv:
            return obj.cv.url.replace("http://","https://")
        
        return None
    
    def get_applicant_info(self, obj):
        user = obj.user
        context = self.context
        job_type = obj.job.post_type
        
        if job_type == "COMPANY":
         
            if hasattr(user, "professional_detail"):
                    return ProfessionalApplicantSerializer(user.professional_detail, context=context).data
            elif hasattr(user, "normal_workers"):
                return NormalApplicantsSerializer(user.normal_workers, context=context).data
        
        else:
            if hasattr(user, "normal_workers"):
                return NormalApplicantsSerializer(user.normal_workers, context=context).data
            
            elif hasattr(user, "professional_detail"):
                    return ProfessionalApplicantSerializer(user.professional_detail, context=context).data
                
        return None
    






# ==========UPDATE STATUS EMPLOYER ==========
class UpdateApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ("status",)

        
  

        



       


    
 