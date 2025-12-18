from rest_framework import serializers 
from Workers.models import (NormalWorkerDetail, ProfessionalDetail,ProfessionalEducations,ProfessionalExperience,
                            ProfessionalLanguages,ProfessionalSkills)
from Jobs.serializers import JobCategorySerializer
from Jobs.models import JobCategory
from rest_framework.exceptions import PermissionDenied
import datetime
 
class ProfessionalSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSkills
        fields = ("id","owner","skill", "created_at")
        read_only_fields = ("id","owner","created_at")

    def get_professional_worker(self):
        request = self.context.get("request")

        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request!")
        
        try:
            user_profile = request.user.user_profile
        except Exception:
            raise serializers.ValidationError("No profile found!")
        
        #### get professionalt worker #####
        try:
            professional_worker = user_profile.professional_detail
        except ProfessionalDetail.DoesNotExist:
            raise serializers.ValidationError("No professional profile found!")
        
        return professional_worker

    def create(self, validated_data):
        validated_data["owner"] = self.get_professional_worker()
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if instance.owner != self.get_professional_worker():
            raise PermissionDenied("Your are not allowed!")
        return super().update(instance, validated_data)
    
class ProfessionalLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalLanguages
        fields = ("id","owner","language","level", "created_at")
        read_only_fields = ("id","owner","created_at")


    def validate(self, attrs):
        return super().validate(attrs)
    
    def get_professional_worker(self):
        request = self.context.get("request")

        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request!")
        
        try:
            user_profile = request.user.user_profile
        except Exception:
            raise serializers.ValidationError("No profile found!")
        
        #### get professionalt worker #####
        try:
            professional_worker = user_profile.professional_detail
        except ProfessionalDetail.DoesNotExist:
            raise serializers.ValidationError("No professional profile found!")
        
        return professional_worker
    
    def create(self, validated_data):
        validated_data["owner"] = self.get_professional_worker()
        return super().create(validated_data)
    

    def update(self, instance, validated_data):
        if instance.owner != self.get_professional_worker():
            raise PermissionDenied("Your not allowed!")
        return super().update(instance, validated_data)



class ProfessionalEducationSerializer(serializers.ModelSerializer):
    education_level_display = serializers.CharField(source = "get_education_level_display", read_only = True)


    class Meta:
        model = ProfessionalEducations
        fields = ("id","owner","school","degree","field_of_study",
                  "start_year","end_year","education_level", "education_level_display", "created_at")
        
        read_only_fields = ("id","owner","created_at")
 
    def validate(self, attrs):
        start_year = attrs.get("start_year")
        end_year = attrs.get("end_year")

        if start_year and end_year:
            try:
                if int(start_year)  > int(end_year):
                    raise serializers.ValidationError("Invalid starting Year")
            except ValueError:
                raise serializers.ValidationError("Start year and end year must be integer!")


        if start_year:
            try:
                if int(start_year) >  datetime.datetime.now().year:
                    raise serializers.ValidationError("invalid starting Year, Staring year cannot be in a future!")
            except ValueError:
                raise serializers.ValidationError("Start year must be interger")
        
        return super().validate(attrs)
    

    
    def get_professional_worker(self):
        request = self.context.get("request")

        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request!")
        
        try:
            user_profile = request.user.user_profile
        except Exception:
            raise serializers.ValidationError("No profile found!")
        
        #### get professionalt worker #####
        try:
            professional_worker = user_profile.professional_detail
        except ProfessionalDetail.DoesNotExist:
            raise serializers.ValidationError("No professional profile found!")
        
        return professional_worker
    
    

    
    def create(self, validated_data):
        validated_data["owner"] = self.get_professional_worker()
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if instance.owner != self.get_professional_worker():
            raise PermissionDenied("Your not allowed!")
        return super().update(instance, validated_data)
    
    
    


class ProfessionalExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalExperience
        fields = ("id","owner","company","location","role",
                  "start_date","end_date","current_working","responsibilities","created_at")
        
        read_only_fields = ("id","owner","created_at")

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError("Invalid starting date")

        if start_date and start_date >  datetime.date.today():
                raise serializers.ValidationError("starting Year, cannot be in a future!")
        
        return super().validate(attrs)
    
    
    def get_professional_worker(self):
        request = self.context.get("request")

        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Invalid request!")
        
        try:
            user_profile = request.user.user_profile
        except Exception:
            raise serializers.ValidationError("No profile found!")
        
        #### get professionalt worker #####
        try:
            professional_worker = user_profile.professional_detail
        except ProfessionalDetail.DoesNotExist:
            raise serializers.ValidationError("No professional profile found!")
        
        return professional_worker
    
    
    def create(self, validated_data):
        validated_data["owner"] = self.get_professional_worker()
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if instance.owner != self.get_professional_worker():
            raise PermissionDenied("Your not allowed!")
        return super().update(instance, validated_data)



# professional detais serializer
class ProfessionalDetailSerializer(serializers.ModelSerializer):
    category = JobCategorySerializer(read_only = True)
    category_id = serializers.IntegerField(write_only = True, required = False)

    current_cv = serializers.SerializerMethodField(read_only = True)
    
    payment_period_display = serializers.CharField(source = "get_prof_payment_period_display", read_only = True)
    employment_status_display = serializers.CharField(source = "get_employment_status_display", read_only = True)
    experience_yrs_display = serializers.CharField(source = "get_experience_yrs_display", read_only = True)
    education_level_display = serializers.CharField(source = "get_education_level_display", read_only = True)
 
    class Meta: 
        model = ProfessionalDetail
        fields = ("id","prof_profile","job_title", "category","category_id",
                  "prof_salary","prof_currency","prof_payment_period","payment_period_display","linkedIn","portfolio","gitHub",
                 "cv","current_cv", "employment_status","employment_status_display","experience_yrs","experience_yrs_display",
                 "education_level","education_level_display",
                  "prof_description", "public_visible")
        
        read_only_fields = ("id","prof_profile")


    def get_current_cv(self, obj):
        if  obj.cv:
            return obj.cv.url
        else:
            return None


    def validate(self, attrs):
        
        cv = attrs.get("cv")
        if cv is not None:
            max_size = 2* 1024 * 1024
            if cv.size > max_size:
                raise serializers.ValidationError("CV file is too large. Maximum size is 2MB")
            
            valid_extensions = ["pdf","doc","docx"]
            extension = cv.name.split('.')[-1].lower()

            if extension not in valid_extensions:
                raise serializers.ValidationError("Invalid file type. Only PDF, DOC, DOCX are allowed.")



        category_id = attrs.get("category_id") 
        
        if category_id is not None:
            if not JobCategory.objects.filter(id = category_id).exists():
                raise serializers.ValidationError("Invalid category")
            
        return super().validate(attrs)
    
    
    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request is None or not hasattr(request, "user"):
            raise PermissionDenied("Invalid request!")
        
        if instance.prof_profile != request.user.user_profile:
            raise serializers.ValidationError("You are not allowed!")
        
        
        category_id = validated_data.pop("category_id", None )
        if category_id:
            validated_data["category"] = JobCategory.objects.filter(id = category_id).first()
        
        cv = validated_data.pop("cv",None)
        
        if cv:
            if instance.cv:
                instance.cv.delete(save = False)
            instance.cv = cv

        return super().update(instance, validated_data)
    

# professional detais serializer

 

class NormalWorkerSerializer(serializers.ModelSerializer):
    category = JobCategorySerializer(read_only = True)
    category_id = serializers.IntegerField(write_only = True, required=False)

    payment_period_display = serializers.CharField(source = "get_payment_period_display", read_only = True)
    availability_display = serializers.CharField(source = "get_availability_display", read_only = True)
    experience_level_display = serializers.CharField(source = "get_experience_level_display", read_only = True)


    class Meta:
        model = NormalWorkerDetail
        fields = ("id","worker","title","category","category_id","salary","currency","payment_period","payment_period_display",
                  "public_visible", "availability","availability_display",
                  "experience_level","experience_level_display","description") 
        
        read_only_fields = ("id","worker")

    def validate(self, attrs):    
        description = attrs.get("description")
        if len(description.strip()) < 20:
            raise serializers.ValidationError("Description must be at least 20 characters.")

        categry_id = attrs.get("category_id")
        if (categry_id):
            if not JobCategory.objects.filter(id = categry_id).exists():
                raise serializers.ValidationError("Invalid category!")
        
        return super().validate(attrs)
    
    
    
    def update(self, instance, validated_data):
        request= self.context.get("request")

        if request is None or not hasattr(request, "user"):
            raise PermissionDenied("Invalid request!")
 
        if instance.worker != request.user.user_profile:
            raise serializers.ValidationError("You're not allowed!")
        

        category_id = validated_data.pop("category_id",None)
        if category_id is not None:
                validated_data["category"] = JobCategory.objects.filter(id = category_id).first()
            
        return super().update(instance, validated_data)
    



