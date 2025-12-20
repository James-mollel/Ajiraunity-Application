from django.db import models
from uuid6 import uuid7
from django.contrib.auth.models import PermissionsMixin, AbstractBaseUser, BaseUserManager
from Locations.models import Region, Ward, District
from cloudinary.models import CloudinaryField
  
# Create your models here.
 
class CustomBaseUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email required!")
        if not password:
            raise ValueError("password required")
        
        email = self.normalize_email(email)
        user = self.model(email = email, **extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser",True)
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_active",True)
        extra_fields.setdefault("role",CustomUserModel.Roles.ADMIN)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("superuser must have a is super True")
        if extra_fields.get("is_staff") is not True:
            raise ValueError("superuser must have a is staff True")
        
        return self.create_user(email=email, password=password, **extra_fields)
    



class CustomUserModel(PermissionsMixin, AbstractBaseUser):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN","Admin"
        EMPLOYER = "EMPLOYER","Employer"
        WORKER = "WORKER", "Worker"

    id = models.UUIDField(primary_key=True, editable=False, default=uuid7)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=10, default=Roles.WORKER, choices=Roles.choices)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    objects = CustomBaseUserManager()
    
    def __str__(self):
        return self.email
    


     
class UsersProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid7, editable=False)
    user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name='user_profile')

    avatar = CloudinaryField('image', blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)

    gender = models.CharField(max_length=10, blank=True, null=True)
    age = models.CharField(max_length=8, blank=True, null=True)

    phone_number = models.CharField(max_length=20, blank=True, null=True)
    phone_verified = models.BooleanField(default=False)

    region = models.ForeignKey(Region, on_delete=models.SET_NULL, blank=True, null=True)  
    district = models.ForeignKey(District, on_delete=models.SET_NULL, blank=True, null=True)  
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, blank=True, null=True) 

  

    
    def save(self,*args, **kwargs):
         super().save(*args, **kwargs)

         
    def __str__(self):
        return f"{self.user}"
    
    

#---------------------------FEEDBACK------------------------

class Feedback(models.Model):
    rating = models.PositiveSmallIntegerField(blank=True, null=True)
    message = models.TextField(blank=True,null=True)
    email = models.EmailField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        email_p = self.email.split("@")[0] if self.email else "@Anonymous"
        rating_p = self.rating if self.rating is not None else "No rating"

        return f"{email_p} ({rating_p})"


    
 