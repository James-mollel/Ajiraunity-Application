from rest_framework import serializers
from Jobs.models import JobCategory, Job, Company
from Locations.models import District,Region,Ward
from Locations.serializers import RegionSerializer,DistrictSerializer,WardSerializer
from rest_framework.exceptions import PermissionDenied
import datetime


class JobCategorySerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    class Meta:
        model = JobCategory
        fields = ("id","name","sw_name","display_name","category_type","slug")
        read_only_fields = ("id","slug","sw_name") 

    def get_display_name(self, obj):
        return obj.display_name()
    

 
#SERIALIZER COMPANY
class CompanySerializer(serializers.ModelSerializer):
    employees_size_display = serializers.CharField(source = "get_employees_size_display", read_only = True)


    logo_url = serializers.SerializerMethodField(read_only = True)
    class Meta:
        model = Company
        fields = ("id","owner","name","slug","industry","employees_size","employees_size_display",
                 "year_founded","address","website","email","description","logo",
                   "logo_url","is_verified","created_at")
        
        read_only_fields = ("id","owner","slug","is_verified","created_at")

    def validate_name(self, value):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("Authentication required")
        
        try:
            owner = request.user.user_profile
        except AttributeError:
            raise serializers.ValidationError("User profile missing")
        
        instance = getattr(self, "instance", None)
        queryset = Company.objects.filter(
            name__iexact = value, owner = owner 
        )

        if instance:
            queryset = queryset.exclude(id = self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError(f"You already create this company! '{value}'")
        return value

    def validate(self, attrs):
        year_found = attrs.get("year_founded")
        address = attrs.get("address")
        email = attrs.get("email")
        
        if address is None:
            raise serializers.ValidationError("Address is required")
        if email is None:
            raise serializers.ValidationError("Company email address is required")
        

        if year_found is not None:
            if year_found < 1700 or year_found > datetime.date.today().year:
                raise serializers.ValidationError("Enter a valid year!")
        
        return super().validate(attrs)
    

    def get_logo_url(self, obj):

        if obj.logo:
            return obj.logo.url
        else:
            return None
        
    def create(self, validated_data):
        request = self.context.get("request")
        if request is None or not hasattr(request, "user"):
            raise PermissionDenied("Invalid method request!")
        
        try:
            current_employer = request.user.user_profile
        except Exception:
            raise PermissionDenied("No data found!")
        
        validated_data["owner"] = current_employer
        return super().create(validated_data)
    


    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request is None or not hasattr(request, "user"):
            raise PermissionDenied("Invalid method request!")

        
        if instance.owner != request.user.user_profile:
            raise PermissionDenied("Your not allowed to update these information.")
        
        logo = validated_data.pop("logo", None)
        if logo:
            if instance.logo:
                instance.logo.delete(save = False)
            instance.logo = logo

        return super().update(instance, validated_data)
        







#SERIALIZER JOBS
class JobsSerializer(serializers.ModelSerializer):
    category = JobCategorySerializer(read_only = True)
    category_id = serializers.IntegerField(write_only = True, required = False, allow_null= True)

    company = CompanySerializer(read_only = True)
    company_id = serializers.UUIDField(write_only = True, required = False, allow_null = True)

    region = RegionSerializer(read_only = True)
    district = DistrictSerializer(read_only = True)
    ward = WardSerializer(read_only = True)

    region_id = serializers.IntegerField(write_only = True, required= False, allow_null = True)
    district_id = serializers.IntegerField(write_only = True, required= False, allow_null = True)
    ward_id = serializers.IntegerField(write_only = True, required= False, allow_null = True)

    post_type = serializers.CharField(read_only = True)

    #Displays 
    job_type_display = serializers.CharField(source = "get_job_type_display", read_only = True)
    education_leveldisplay = serializers.CharField(source = "get_education_level_display", read_only = True)
    experience_level_display = serializers.CharField(source = "get_experience_level_display", read_only = True)
    gender_display = serializers.CharField(source = "get_gender_display", read_only = True)
    payment_period_display = serializers.CharField(source = "get_payment_period_display", read_only = True)


    #Displays 
    


    class Meta: 
        model = Job
        fields = ("id","poster","post_type","title","slug","code",
                 "company", "company_id","job_type","job_type_display","education_level",
                      "education_leveldisplay", "region",
                  "district","ward","region_id","district_id","ward_id",
                  "experience_level","experience_level_display","category","category_id",
                   "gender","gender_display","salary_max","salary_min","salary_visible","currency",
                    "payment_period","payment_period_display","positions_needed","deadline",
                          "job_summary",
                     "duties","skills_required",
                      "apply_email","apply_website","apply_in_app",
                      "apply_whatsapp",
                       "views","applied","status","created_at" 
                       )
        
        read_only_fields = ("id","poster","slug","code","views","applied","status","created_at")

    
    
    def validate(self, attrs):
        region_ids = attrs.get("region_id")
        district_ids = attrs.get("district_id")
        ward_ids = attrs.get("ward_id")


        if district_ids is not None and region_ids is not None:
            if not District.objects.filter(id = district_ids, region__id = region_ids).exists():
                raise serializers.ValidationError("This District does not belong to the select Region")
            
        if ward_ids is not None and district_ids is not None:
            if not Ward.objects.filter(id = ward_ids, district__id = district_ids).exists():
                raise serializers.ValidationError("This Ward does not belong to the selected District")




        category_id = attrs.get("category_id")
        if category_id is not None:
            if not JobCategory.objects.filter(id = category_id).exists():
                raise serializers.ValidationError("Category selected is invalid")

        
        deadline = attrs.get("deadline")
        if deadline and deadline < datetime.date.today():
            raise serializers.ValidationError("Enter a valid deadline date!")
        
        max_salary = attrs.get("salary_max")
        min_salary = attrs.get("salary_min")
        post_type = self.context.get("post_type")

        if post_type == "INDIVIDUAL":
            attrs["salary_visible"] = True

            if max_salary is None and min_salary is None:
                raise serializers.ValidationError("At least one of minimum salary or maximum salary is required.")

            if max_salary is not None and max_salary < 0:
                raise serializers.ValidationError("Invalid maximum salary")
            
            if min_salary is not None and min_salary < 0:
                raise serializers.ValidationError("Invalid minimum salary")

            if max_salary is not None and min_salary is not None: 
                if  max_salary <  min_salary:
                        raise serializers.ValidationError("Maximum salary must always greater than minimum salary")

                

        if post_type == "COMPANY":
            if max_salary is not None and min_salary is not None:
                if max_salary < 0 or min_salary < 0:
                    raise serializers.ValidationError("Enter a valid salary")
                
                if min_salary > max_salary:
                    raise serializers.ValidationError("Maximum salary must always greater than minimum salary")

    
        
        # applications methods 
        email = attrs.get("apply_email")
        website = attrs.get("apply_website")
        in_app = attrs.get("apply_in_app")
        whatsapp = attrs.get("apply_whatsapp") 

        if not (email or website or in_app or whatsapp):
            raise serializers.ValidationError("At least one apply method is required (email, website, in-app or whatsapp)")
         
        return super().validate(attrs)
    

    
    def create(self, validated_data):

        # assign current employer!
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise PermissionDenied("Invalid method!")
        
        try:
            current_emp = request.user.user_profile
        except Exception:
            raise PermissionDenied("No data found!")
        
        validated_data["poster"] = current_emp
      # ===assing emp end ======


        post_type = self.context.get("post_type")
        if post_type not in ["COMPANY","INDIVIDUAL"]:
            raise serializers.ValidationError("Invalid job post type")
        
        validated_data["post_type"] = post_type

        
       
        company_id = validated_data.pop("company_id", None)
        if post_type == "COMPANY":
            if company_id is None:
                raise PermissionDenied("You must select a Company while you post company related jobs")
            
            try:
                user_company = Company.objects.get(id = company_id, owner = current_emp)
            except Company.DoesNotExist:
                raise PermissionDenied("No company Found")
            
            validated_data["company"] = user_company
        
      #   assing category 
        category_id = validated_data.pop("category_id", None)
        if category_id is not None:
            try:
                category_selected = JobCategory.objects.get(id = category_id)
            except JobCategory.DoesNotExist:
                raise serializers.ValidationError("Selected category does not exist")
            validated_data["category"] = category_selected




        # assign locations 
        region_id = validated_data.pop("region_id", None)
        district_id = validated_data.pop("district_id", None)
        ward_id = validated_data.pop("ward_id", None)

        if region_id is not None:
            try:
                region_selected = Region.objects.get(id = region_id)
            except Region.DoesNotExist:
                raise serializers.ValidationError("Selected region does not exist")
            validated_data["region"] = region_selected

        if district_id is not None:
            try:
                district_selected = District.objects.get(id = district_id)
            except District.DoesNotExist:
                raise serializers.ValidationError("Selected district does not exist")
            validated_data["district"] = district_selected

        if ward_id is not None:
            try:
                ward_selected = Ward.objects.get(id = ward_id)
            except Ward.DoesNotExist:
                raise serializers.ValidationError("Selected district does not exist")
            validated_data["ward"] = ward_selected

        return super().create(validated_data) 
       

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise PermissionDenied("Invalid request")
        
        try:
            current_emp = request.user.user_profile
        except Exception:
            raise PermissionDenied("No data found!")
        
        if instance.poster != current_emp:
            raise PermissionDenied("You are not allowed to perform this action!")
        
        
    

        
        
        if instance.post_type == "COMPANY":
            company_id = validated_data.pop("company_id", None)
            if company_id is None:
                raise serializers.ValidationError("You must select a company while post company related jobs")
            
            try:
                company = Company.objects.get(id = company_id, owner = current_emp)
            except Company.DoesNotExist:
                raise PermissionDenied("No company Found")
            
            validated_data["company"] = company
    
        # job category
        category_id = validated_data.pop("category_id", None)
        if category_id is not None:
            try:
                category_selected = JobCategory.objects.get(id = category_id)
            except JobCategory.DoesNotExist:
                raise serializers.ValidationError("Selected category does not exist")
            validated_data["category"] = category_selected

        # JOB LOCATION 
        region_id = validated_data.pop("region_id", None)
        district_id = validated_data.pop("district_id", None)
        ward_id = validated_data.pop("ward_id", None)

        if region_id is not None:
            try:
                region_selected = Region.objects.get(id = region_id)
            except Region.DoesNotExist:
                raise serializers.ValidationError("Selected region does not exist")
            validated_data["region"] = region_selected
        
        if district_id is not None:
            try:
                district_selected = District.objects.get(id = district_id)
            except District.DoesNotExist:
                raise serializers.ValidationError("Selected district does not exist")
            validated_data["district"] = district_selected
        
        if ward_id is not None:
            try:
                ward_selected = Ward.objects.get(id = ward_id)
            except Ward.DoesNotExist:
                raise serializers.ValidationError("Selected ward does not exist")
            validated_data["ward"] = ward_selected


        
        return super().update(instance, validated_data) 





# =============LIST JOBS PUBLIC ===============
class ListJobsPublicSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField() #category

    is_job_saved = serializers.SerializerMethodField()

    #=================COMPANY============
    company_name = serializers.CharField(source="company.name", read_only = True, allow_null = True)
    company_website = serializers.CharField(source="company.website", read_only = True, allow_null = True)
    company_logo = serializers.SerializerMethodField(allow_null = True)
    company_employees_size = serializers.CharField(source="company.employees_size", read_only = True, allow_null = True)
    company_address = serializers.CharField(source="company.address", read_only = True, allow_null = True)
    company_description = serializers.CharField(source="company.description", read_only = True, allow_null = True)

    #--------------LOCATIONS-------------------
    region_name = serializers.CharField(source="region.name", read_only = True)
    district_name = serializers.CharField(source="district.name", read_only = True)
    ward_name = serializers.CharField(source="ward.name", read_only = True)


    # -----------READABLE------DATA------------
    job_type_display = serializers.CharField(source = "get_job_type_display", read_only = True, allow_null = True)
    education_level_display = serializers.CharField(source = "get_education_level_display", read_only = True, allow_null = True)
    experience_level_display = serializers.CharField(source = "get_experience_level_display", read_only = True, allow_null = True)
    gender_display = serializers.CharField(source = "get_gender_display", read_only = True, allow_null = True)
    payment_period_display = serializers.CharField(source = "get_payment_period_display", read_only = True, allow_null = True)

    
    class Meta: 
        model = Job
        fields = ("slug","post_type","title","is_job_saved",
                  
                  "company_name","company_logo","company_employees_size",
                  "company_address", "company_description","company_website",
                  
                 "job_type_display","education_level_display", 
                 "region_name","district_name","ward_name",

                  "experience_level_display","display_name",
                   "gender_display","salary_max","salary_min","currency",

                    "payment_period_display","positions_needed","deadline",
                     "job_summary","duties","skills_required",

                      "apply_email","apply_website","apply_in_app","apply_whatsapp",

                       "views","created_at" 
                       )
        
    
    def get_is_job_saved(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            user = request.user

            return obj.saved_job.filter(user = user).exists()
        return False
        

    def get_display_name(self, obj):
        if obj.category:
          return obj.category.display_name()
        return None
        

    def get_company_logo(self, obj):
        if obj.company  and obj.company.logo:
            return obj.company.logo.url
        return None
    

    
 