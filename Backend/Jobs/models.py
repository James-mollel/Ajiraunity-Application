from django.db import models
import uuid
from uuid6 import uuid7
from django.utils.text import slugify
from Users.models import CustomUserModel, UsersProfile
from Locations.models import Region,District,Ward


 
# Create your models here.
# GLOBAL CATEGORIES
class JobCategory(models.Model):
    name = models.CharField(max_length=200, unique=True)
    sw_name = models.CharField(max_length=200, blank=True, null=True)

    category_type = models.CharField(max_length=22, 
           choices=[
                ("professional","Professional Jobs"), 
                ("informal","Casual / Daily Jobs")])
    
    slug = models.SlugField(max_length=250, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
         if not self.slug:
             base = str(uuid.uuid4())[:8]
             self.slug = f"{slugify(self.name)}-{base}"
         super().save(*args, **kwargs)

    def display_name(self):
        if self.category_type == "informal" and self.sw_name:
            return f"{self.name} ({self.sw_name})"
        return self.name
    

    def __str__(self):
        return self.display_name()
# GLOBAL CATEGORIES



#  Jobs Model 
class Company(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    owner = models.ForeignKey(UsersProfile, on_delete=models.CASCADE, related_name='owner_company') # userProfile

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250, blank=True)

    industry = models.CharField(max_length=200)
    employees_size = models.CharField(max_length=100,
                    choices=[
                            ("self_employed", "Self Employed"),
                            ("1-10", "1–10 employees"),
                            ("11-50", "11–50 employees"),
                            ("51-200", "51–200 employees"),
                            ("201-500", "201–500 employees"),
                            ("501-1000", "501–1,000 employees"),
                            ("1001-5000", "1,001–5,000 employees"),
                            ("5001-10000", "5,001–10,000 employees"),
                            ("10000+", "10,000+ employees")
                            ]) 
    
    year_founded = models.PositiveSmallIntegerField(blank=True, null=True)
    address = models.CharField(max_length=250)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField()
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to="company_logos/", blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner','name'], name='unique_owner_company')
        ]

        ordering = ["-created_at","-updated_at"]

            
    def save(self,*args, **kwargs):
         
         if not self.slug:
             self.slug = f"{slugify(self.name)}-{str(uuid.uuid4())[:8]}"
         super().save(*args, **kwargs)



    def __str__(self):
        return f"{self.name}-{self.owner}"
    


class Job(models.Model):
    class PostType(models.TextChoices):
        COMPANY = "COMPANY", "Company"
        INDIVIDUAL = "INDIVIDUAL", "Individual"
 
    class JobStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        CLOSED = "CLOSED", "Closed"
        PENDING = "PENDING", "Pending Verification"


    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    poster = models.ForeignKey(UsersProfile, on_delete=models.CASCADE,related_name='poster_jobs') # userProfile
    post_type = models.CharField(choices=PostType.choices, max_length=20) # 2 url and user get_context to pass extra data

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=260, blank=True, unique=True)
    code = models.CharField(max_length=60, unique=True, editable=False)

    #Company FIELDS
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True, related_name='jobs_company')
    job_type = models.CharField(max_length=100, blank=True, null=True,
                                 choices=[
                                            ("full_time", "Full Time"),
                                            ("part_time", "Part Time"),
                                            ("contract", "Contract"),
                                            ("temporary", "Temporary"),
                                            ("internship", "Internship"),
                                            ("freelance", "Freelance"),
                                            ("remote", "Remote"),

                                  ])
    
    education_level = models.CharField(max_length=100, blank=True, null=True, 
                            choices=[
                                ("none", "No Education Required"),
                                ("primary", "Primary Education"),
                                ("secondary", "Secondary Education / High School"),
                                ('certificate','Certificate'),
                                ("diploma", "Diploma"),
                                ("bachelor", "Bachelor’s Degree"),
                                ("master", "Master’s Degree"),
                                ("phd", "Doctorate (PhD)"),

                             ]) # choices


    region = models.ForeignKey(Region, on_delete=models.SET_NULL, blank=True, null=True)  
    district = models.ForeignKey(District, on_delete=models.SET_NULL, blank=True, null=True)  
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, blank=True, null=True) 

    # common fields 
    experience_level = models.CharField(max_length=50, blank=True, null=True, 
                choices=[
                    ("no_experience", "No Experience Required"),
                    ("entry", "Entry Level (0-2 years)"),
                    ("mid", "Mid Level (3-5 years)"),
                    ("senior", "Senior Level (5+ years)"),
                    ("executive", "Executive / Director"),
                ])
    
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, blank=True, null=True, related_name='category_job')
    gender = models.CharField(max_length=20, blank=True, null=True, 
                              choices=[
                                       ("any","Any (Not Preference)"),
                                       ("male","Male"),
                                       ("female","Female"),
                                       ]) 
    
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    salary_visible = models.BooleanField(default=True)

    currency = models.CharField(max_length=10, 
                                choices=[
                                    ("TZS","TZS"),
                                    ("USD","USD"),
                                 ],
                                   default="TZS")
    
    payment_period = models.CharField(max_length=20, blank=True, null=True, 
                                      choices=[
                                            ("hourly", "Per Hour"),
                                            ("daily", "Per Day"),
                                            ("weekly", "Per Week"),
                                            ("monthly", "Per Month"),
                                            ("annually", "Per Year"),
                                            ("piecework", "Per Task"),
                                      ])
    
    positions_needed = models.PositiveSmallIntegerField()
    deadline = models.DateField(null=True, blank=True)
    job_summary = models.TextField(blank=True, null=True)


    duties = models.TextField(blank=True,null=True)
    skills_required = models.TextField(blank=True, null=True)


    # APPLICATIONS METHODS
    apply_email = models.EmailField(blank=True, null=True)
    apply_website = models.URLField(blank=True, null=True)
    apply_in_app = models.BooleanField(default=True)
    apply_whatsapp = models.CharField(max_length=25, blank=True, null=True)

    views = models.PositiveIntegerField(default=0)
    applied = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=JobStatus.choices,
        default=JobStatus.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta: 
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['region','district']),
        ]

        ordering = ["-created_at","-updated_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{slugify(self.title)}-{str(uuid.uuid4())[:8]}"
            
        if not self.code:
            prefix = "COMP" if self.post_type == self.PostType.COMPANY else "INDV"
            self.code = f"{prefix}-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title}-[{self.code}]"


# JOB MODELS 


 
 