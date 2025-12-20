from rest_framework import serializers
from django.db import transaction
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db import IntegrityError
from rest_framework.exceptions import PermissionDenied
from .models import UsersProfile, CustomUserModel, Feedback
from Locations.models import Region, Ward, District
from Locations.serializers import RegionSerializer, WardSerializer, DistrictSerializer
from django.core.exceptions import ValidationError as DjangoValidationError
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
# User = get_user_model()

MAX_AVATAR_SIZE = 5 * 1024 * 1024 

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, write_only = True)
    password2 = serializers.CharField(required=True, write_only = True)

    class Meta:
        model = CustomUserModel
        fields = ("email","password","password2")
        extra_kwargs = {
            "email":{"validators":[]}
        }
    
    def validate(self, attrs):
        email = attrs.get("email").lower()
        password = attrs.get("password")
        password2 = attrs.get("password2")

        if len(email) > 260:
            raise serializers.ValidationError("Too Many chars in email")
        if CustomUserModel.objects.filter(email = email).exists():
            raise serializers.ValidationError("This email already in use!")
        
        if len(password) > 100:
            raise serializers.ValidationError("Too Many chars in password")
        if len(password) < 6:
            raise serializers.ValidationError("Password is too short")
        if password != password2:
            raise serializers.ValidationError("Passwords miss match!")
        return attrs
    

    
    def create(self, validated_data):
        validated_data.pop("password2")

        role = self.context.get("role")
        email = validated_data["email"].lower()
        password = validated_data["password"]

        if role not in ["EMPLOYER","WORKER"]:
            raise serializers.ValidationError("You not allowed!")
        
        with transaction.atomic():
            try:
                user = CustomUserModel.objects.create(
                    email = email,
                    role = role,
                    is_active = False
                )
                user.set_password(password)
                user.save()
            except IntegrityError:
               raise serializers.ValidationError("This email already in use!")
            except Exception as e:
                logger.error(f"User creation failed: {e}")
                raise serializers.ValidationError("An unexpected error occured, Please try again later.")



            try:
                self.send_verification_email(user)
            except Exception as e:
                logger.error(f"Sending email during registration fail: {e} ")
                raise serializers.ValidationError("Failed to send verification email, Ensure Your email is correct!")
            
        return user
    
    def send_verification_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        verify_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"
 

        subject = "Verify your email address"
        from_email=settings.DEFAULT_FROM_EMAIL
        to_email =[user.email]


        text_content = f"""
 Hi {user.email},


 Thanks for registering with <strong>Ajira <span style="color: #007bff;">unity</span></strong>!!
 Please verify your email address by clicking the link below:

 {verify_url}


 If you didn't register, just ignore this email.

    - The <strong>Ajira <span style="color: #007bff;">unity</span></strong>! Team
               """
        
        html_content = f"""
        
<html>
<body style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px;" >
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;
    padding: 30px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);" >

    <h2 style="color: #333;">Verify your email address<h2>
        <p style="font-size: 15px; color: #555;">
            Hi {user.email}, <br><br>
            Thank you for registering with <strong>Ajira <span style="color: #007bff;">unity</span></strong>!
            Please confirm your email address by clicking the button below

        </p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="{verify_url}" style="background-color: #007bff; color: white; text-decoration: none;
            padding: 12px 24px; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </p>

        <p style="font-size: 14px; color: #777;" >
            If you didn't create an account, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee;">
           <p style="font-size: 12px; color: #a0aec0; text-align: center;">
            &copy; {datetime.now().year} AjiraUnity. All rights reserved.<br>
            Arusha, Tanzania.
        </p>


    </div>
    
</body>
</html>
"""
        
        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        
        


        # send_mail(
        #     subject="Verify Your Email",
        #     message=f"Click this link {verify_url}",
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        #     fail_silently=False
        # )






class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError({"detail":"Email is required"})
        if len(value) > 256:
            raise serializers.ValidationError({"detail":"Too many chars!"})
        
        return value
    
    def save(self):
        email = self.validated_data["email"].lower()
        try:
            user = CustomUserModel.objects.get(email=email)
            if not user.is_active:
                return
        except CustomUserModel.DoesNotExist:
               return
    

        try:
            self.send_password_reset_email(user)
        except Exception:
            raise serializers.ValidationError("System busy, please try again later.!")

    

    def send_password_reset_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        subject = "Reset your AjiraUnity password"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [user.email]

    # Plain text version for email clients that don't support HTML
        text_content = f"""
Hi {user.email},

We received a request to reset your password for your AjiraUnity account.
Click the link below to choose a new password:

{reset_url}

If you didn't request this, you can safely ignore this email. Your password will not change until you access the link above and create a new one.

- The AjiraUnity Team
    """

    # Modern HTML version
        html_content = f"""
<html>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f8fa; padding: 20px; margin: 0;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 24px; color: #1a202c; margin: 0;">Reset Your Password</h1>
        </div>

        <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">
            Hi <strong>{user.email}</strong>,<br><br>
            We received a request to reset your password for your <strong>Ajira<span style="color: #007bff;">unity</span></strong> account. No changes have been made yet.
        </p>

        <div style="text-align: center; margin: 35px 0;">
            <a href="{reset_url}" style="background-color: #007bff; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Set New Password</a>
        </div>

        <p style="font-size: 14px; color: #718096; line-height: 1.5;">
            <strong>Security Note:</strong> This link will expire shortly. If you did not request this password reset, please ignore this email or contact support if you have concerns.
        </p>

        <hr style="border: none; border-top: 1px solid #edf2f7; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">
            &copy; {datetime.now().year} AjiraUnity. All rights reserved.<br>
            Arusha, Tanzania.
        </p>
    </div>
</body>
</html>
"""

        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)


class PasswordConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only = True)
    password2 = serializers.CharField(write_only = True)
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        if len(attrs.get("password")) < 6:
            raise serializers.ValidationError({"detail":"Password is too short!"})
        if len(attrs.get("password")) > 100:
            raise serializers.ValidationError({"detail":"Too many chars"}) 
        if (attrs.get("password") != attrs.get("password2")):
            raise serializers.ValidationError({"detail":"password miss match"})
        
        try:
            uid = urlsafe_base64_decode(attrs.get("uidb64")).decode()
            user = CustomUserModel.objects.get(id = uid)
        except (CustomUserModel.DoesNotExist, TypeError, ValueError, OverflowError):
            raise serializers.ValidationError({"detail":"The link is invalid or has expired, Please try again later!"})
        
        if not default_token_generator.check_token(user, attrs.get("token")):
            raise serializers.ValidationError({"detail":"The link is invalid or has expired, Please try again later!"})
        
        attrs["user"] = user
        
        return attrs
    
    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["password"])
        user.save()



# users and profiles 

# THIS IS FOR THE WORKER 
class WorkerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only = True) # return email (value returned here) __str__

    region = RegionSerializer(read_only = True) # only to show
    district = DistrictSerializer(read_only = True)
    ward = WardSerializer(read_only = True)

    #dummy id user for receive and update? like uuidb64 and token #USED TO COMPARE AND INSERT NEW VALUE USING THAT ID 
    region_id = serializers.IntegerField(write_only = True, required = False, allow_null = True)
    district_id = serializers.IntegerField(write_only = True, required = False, allow_null = True)
    ward_id = serializers.IntegerField(write_only = True, required = False, allow_null = True)



    class Meta:
        model = UsersProfile
        fields = ("id","user","avatar","first_name","last_name","gender",
                  "age","phone_number","phone_verified","region",
                  "district","ward", "region_id","district_id",
                  "ward_id")
        
        read_only_fields = ("id","user","phone_verified")

    def validate_avatar(self, value):
        if value is None:
            return value
        allowed = [".jpg",".jpeg",".png"]
        name = getattr(value, 'name', "").lower()

        if name and not any(name.endswith(ext) for ext in allowed):
            raise serializers.ValidationError("Invaid image type!. Only .jpg, .jpeg, .png files are allowed.")
        
        size = getattr(value, "size", None)
        if size and size > MAX_AVATAR_SIZE:
            raise serializers.ValidationError("Profile image may not be larger than 5MB.")
        
        return value
    
    def validate(self, attrs):
        reg_id = attrs.get("region_id")
        dist_id = attrs.get("district_id")
        war_id = attrs.get("ward_id")

        phone =  attrs.get("phone_number")
        gender = attrs.get("gender")

        if phone is not None:
            if len(phone) > 13:
                raise serializers.ValidationError("Enter a valid phone number")
        
        if gender is not None:
            if gender not in ["Male","Female"]:
                raise serializers.ValidationError("Select valid gender")


        if dist_id is not None and reg_id is not None:
            if not District.objects.filter(id = dist_id, region__id = reg_id).exists():
                raise serializers.ValidationError("selected district does not belong to selected region") 
        
        if war_id is not None and dist_id is not None:
            if not Ward.objects.filter(id = war_id, district__id = dist_id).exists():
                raise serializers.ValidationError("Selected ward does not belong to selected district")
        
        return super().validate(attrs) # run as djago build it validation logic 
    

    
    def update(self, instance, validated_data):
        current_user = self.context.get("request").user
    
        if instance.user != current_user:
            raise PermissionDenied("You are not allowed to perform this action.")


        region_id = validated_data.pop("region_id", None)
        district_id = validated_data.pop("district_id",None)
        ward_id = validated_data.pop("ward_id", None)

        if region_id is not None:
            try:
                region_selected = Region.objects.get(id = region_id)
            except Region.DoesNotExist:
                raise serializers.ValidationError("Selected region is invalid") 
            instance.region = region_selected
        
        if district_id is not None:
            try:
                district_selected = District.objects.get(id = district_id)
            except District.DoesNotExist:
                raise serializers.ValidationError("Selected district is invalid") 
            instance.district = district_selected
        
        if ward_id is not None:
            try:
                ward_selected = Ward.objects.get(id = ward_id)
            except Ward.DoesNotExist:
                raise serializers.ValidationError("Selected ward is invalid")
            instance.ward = ward_selected
        
        avatar = validated_data.pop("avatar", None)
        if avatar:
            if instance.avatar:
                instance.avatar.delete(save = False)
            instance.avatar = avatar

        instance.save()

        return super().update(instance, validated_data)





#==============SHORT EMPLOYER PROFILE =============
class EmployerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only = True)

    class Meta:
        model = UsersProfile
        fields = ("id","user","avatar","first_name","last_name","gender",
                  "phone_number","phone_verified")
        
        read_only_fields = ("id","user","phone_verified")

    def validate_avatar(self, value):
        if value is None:
            return value
        allowed = [".jpg",".jpeg",".png"]

        name = getattr(value, "name","").lower()

        if name and not any(name.endswith(ext) for ext in allowed):
            raise serializers.ValidationError("Invaid image type!. Only .jpg, .jpeg, .png files are allowed.")
        
        size = getattr(value, "size", None)
        if size and size > MAX_AVATAR_SIZE:
            raise serializers.ValidationError("Profile image may not be larger than 5MB.")
        
        return value
    
    def validate(self, attrs):

        phone =  attrs.get("phone_number")
        gender = attrs.get("gender")

        if phone is not None:
            if len(phone) > 13:
                raise serializers.ValidationError("Enter a valid phone number")
        
        if gender is not None:
            if gender not in ["Male","Female"]:
                raise serializers.ValidationError("Select valid gender")
  
        return super().validate(attrs) # run as djago build it validation logic 
    


      
    def update(self, instance, validated_data):
        current_user = self.context.get("request").user

        if current_user.role != CustomUserModel.Roles.EMPLOYER:
            raise PermissionDenied("You are not allowed Here!")
    
        if instance.user != current_user:
            raise PermissionDenied("You are not allowed to perform this action.")

        
        avatar = validated_data.get("avatar")
        if avatar:
            instance.avatar = avatar

        # instance.save()

        return super().update(instance, validated_data)



    
    
# --------------------------------------------------------------------------------------------







# class UserSerializer(serializers.ModelSerializer):
#     user_profile = ProfileSerializer(read_only = True)

#     class Meta:
#         model = CustomUserModel
#         fields = ("id","email","role","user_profile")
#         read_only_fields = ("id","email","role")
        

class ReturnUserShortInfo(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ("id","role","email")
        read_only_fields = ("id","role","email")




# =================----------FEED BACK--------------------------

class FeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ("rating","message","email")

    def validate(self, attrs):
        rating = attrs.get("rating")
        if rating is not None and (rating < 0 or rating > 5 ):
            raise serializers.ValidationError("Rating must be between 0 and 5.")
        
        if rating is None or attrs.get("message") is None:
            raise serializers.ValidationError("Please provide a rating and feedback")
        
        return super().validate(attrs)
    
    
    def create(self, validated_data):
        return super().create(validated_data)
