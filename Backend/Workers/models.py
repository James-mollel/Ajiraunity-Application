from django.db import models
from Users.models import UsersProfile
from Jobs.models import JobCategory
from uuid6 import uuid7
from cloudinary.models import CloudinaryField
# Create your models here.

     
#PROFESSIONAL Worker Details 
class ProfessionalDetail(models.Model):  
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    prof_profile = models.OneToOneField(UsersProfile, on_delete=models.CASCADE, related_name='professional_detail')

    job_title = models.CharField(max_length=200)
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, blank=True, 
                                 null=True, related_name='professional_category')
    
    prof_salary = models.DecimalField(blank=True, null=True, max_digits=12, decimal_places=2)
    prof_currency = models.CharField(max_length=10, 
                                choices=[
                                     ("TZS","TZS"),
                                     ("USD","USD"),
                                 ],
                                   default="TZS")
    
    prof_payment_period = models.CharField(max_length=20,
                                      choices=[("hour", "Per Hour"),
                                                ("day", "Per Day"),
                                                ("week", "Per Week"),
                                                ("month", "Per Month"),
                                                ("project", "Per Project")
                                                ]) 

    linkedIn = models.URLField(blank=True, null=True)
    portfolio = models.URLField(blank=True, null=True)
    gitHub = models.URLField(blank=True, null=True)
    cv = CloudinaryField('file', blank=True, null=True)

    employment_status = models.CharField(max_length=50, choices=[
                                        ("employed", "Employed"),
                                        ("unemployed", "Unemployed"),
                                        ("freelancer", "Freelancer"),
                                        ("self_employed", "Self-employed"),
                                        ("student", "Student"),
                                        ("intern", "Intern"),
                                        ("contract", "Contract"),
                                        ("looking", "Open to opportunities"),
                                           ])  
    
    experience_yrs = models.CharField(max_length=20, choices=[
                                            ("0_1", "0–1 years"),
                                            ("1_2", "1–2 years"),
                                            ("2_3", "2–3 years"),
                                            ("3_5", "3–5 years"),
                                            ("5_7", "5–7 years"),
                                            ("7_10", "7–10 years"),
                                            ("10_plus", "10+ years"),
                                        ])
    
    education_level = models.CharField(max_length=50, choices=[
                                                ("none", "No formal education"),
                                                ("primary", "Primary School"),
                                                ("secondary", "Secondary School / High School"),
                                                ("certificate", "Certificate"),
                                                ("diploma", "Diploma"),
                                                ("bachelor", "Bachelor's Degree"),
                                                ("master", "Master's Degree"),
                                                ("phd", "PhD / Doctorate"),
                                             ]) 

    prof_description = models.TextField(blank=True, null=True)
    public_visible = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at","-updated_at"]

    def __str__(self):
        return str(self.prof_profile.user)
    

class ProfessionalSkills(models.Model):
    id = models.UUIDField(editable=False, default=uuid7, primary_key=True)
    owner = models.ForeignKey(ProfessionalDetail, on_delete=models.CASCADE, related_name="skills_professional")
    skill = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.owner}-{self.skill[:8]}..."


class ProfessionalLanguages(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    owner = models.ForeignKey(ProfessionalDetail, on_delete=models.CASCADE, related_name='languages_professional')
    language = models.CharField(max_length=200, blank=True, null=True)
    level = models.CharField(max_length=20, choices=[
                              ("basic","Basic"),
                              ("conversational","Conversational"),
                              ("fluent","Fluent"),
                              ("native","Native"),
                       ])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: 
        ordering = ["-created_at"]
    def __str__(self):
        return f"{self.owner}-{self.language}"



class ProfessionalEducations(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    owner = models.ForeignKey(ProfessionalDetail, on_delete=models.CASCADE, related_name='education_professional')
    school = models.CharField(max_length=200)
    degree = models.CharField(max_length=200, blank=True, null=True)
    field_of_study = models.CharField(max_length=200, blank=True, null=True)

    start_year = models.CharField(max_length=150)
    end_year = models.CharField(max_length=150, blank=True, null=True)

    education_level = models.CharField(max_length=50, choices=[
                                    ("primary", "Primary School"),
                                    ("secondary", "High School / Secondary"),
                                    ("certificate", "Certificate"),
                                    ("diploma", "Diploma"),
                                    ("bachelor", "Bachelor's Degree"),
                                    ("master", "Master's Degree"),
                                    ("phd", "PhD / Doctorate"),
                            ])
    # description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at","-updated_at"]

    def __str__(self):
        return f"{self.owner}-{self.school}"

  
class ProfessionalExperience(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    owner = models.ForeignKey(ProfessionalDetail, on_delete=models.CASCADE, related_name="professional_experience")

    company = models.CharField(max_length=200)
    location = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=200) #choices 
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    current_working = models.BooleanField(default=False)
    responsibilities = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at","-updated_at"]


    def __str__(self):
        return f"{self.owner.prof_profile.user}-{self.role}"
    



#Normal Worker details 
class NormalWorkerDetail(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    worker = models.OneToOneField(UsersProfile, on_delete=models.CASCADE, related_name='normal_workers')
    title = models.CharField(max_length=250)
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL,null=True, blank=True,related_name='nworker_jobcategory')
 
    salary = models.DecimalField(blank=True, null=True, max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, 
                                choices=[
                                    ("TZS","TZS"),
                                    ("USD","USD"),
                                 ],
                                   default="TZS")
    
    payment_period = models.CharField(max_length=10, choices=[
        ("PerHour", "Per hour"),
        ("PerDay","Per day"),
        ("PerWeek","Per week"),
        ("PerMonth","Per month"),
        ("Negotiable","Negotiable"),
        ("PerProject","Per project"),  

    ]) 

    availability = models.CharField(max_length=100, choices=[
        ("WeekdaysOnly","Weekdays only"),
        ("WeekendsOnly","Weekends only"),
        ("Daily","Daily"),
        ("Immediate","Immediate"),
    ]) 
    
    experience_level = models.CharField(max_length=100, choices=[
        ("Beginner","Beginner"),
        ("Intermediate","Intermediate"),
        ("Expert","Expert")
    ]) 
    description = models.TextField(blank=True)

    public_visible = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at","-updated_at"]
 
    def __str__(self):
        return f"{self.worker.user}-{self.title[:6]}..."
    