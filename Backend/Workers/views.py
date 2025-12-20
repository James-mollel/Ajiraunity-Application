from django.shortcuts import render
from .models import (NormalWorkerDetail,ProfessionalDetail,ProfessionalEducations,ProfessionalExperience,
                     ProfessionalLanguages,ProfessionalSkills, UsersProfile )

from .serializers import (NormalWorkerSerializer, ProfessionalDetailSerializer,ProfessionalLanguageSerializer,
                          ProfessionalEducationSerializer,ProfessionalExperienceSerializer,ProfessionalSkillsSerializer )

from rest_framework.permissions import IsAuthenticated
from Users.authentication import CustomJWTCookieAuthentication
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.


class RetrieveProfessionalView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = ProfessionalDetailSerializer
    parser_classes = (FormParser, MultiPartParser)

    def get_object(self):
        try:
            profile = self.request.user.user_profile
        except Exception:
            raise NotFound("User profile data not found")
        
        professionl_detail, created = ProfessionalDetail.objects.get_or_create(
                                                prof_profile = profile
                                                    )
        
        return professionl_detail
    
    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)
        
        
#LANGUAGES
class ListCreateLanguageView(generics.ListCreateAPIView):
    serializer_class = ProfessionalLanguageSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response({"message":"Language created successfully"},status=status.HTTP_201_CREATED)

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional language data found")
        
        return ProfessionalLanguages.objects.filter(owner = professional)

    

class UpdateLanguagesView(generics.UpdateAPIView):
    serializer_class = ProfessionalLanguageSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional languages to update")
        
        return ProfessionalLanguages.objects.filter(owner = professional)


class DeleteLanguagesView(generics.DestroyAPIView):
    serializer_class = ProfessionalLanguageSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional languages to update")
        
        return ProfessionalLanguages.objects.filter(owner = professional)


#EDUCATIONS

class ListCreateEducationView(generics.ListCreateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalEducationSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional Education data found!")
        
        return ProfessionalEducations.objects.filter(owner = professional)

class UpdateEducationView(generics.UpdateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalEducationSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional education to update")
        
        return ProfessionalEducations.objects.filter(owner = professional)
    
class DeleteEducationView(generics.DestroyAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalEducationSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional education to delete")
        
        return ProfessionalEducations.objects.filter(owner = professional)


#EXPERIENCE 
class ListCreateExperienceView(generics.ListCreateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalExperienceSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional experience found!")
        
        return ProfessionalExperience.objects.filter(owner = professional)

class UpdateExperienceView(generics.UpdateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalExperienceSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional experience to update")
        
        return ProfessionalExperience.objects.filter(owner = professional)
    

class DeleteExperienceView(generics.DestroyAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalExperienceSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional experience to delete")
        
        return ProfessionalExperience.objects.filter(owner = professional)

#SKILLS 
class ListCreateSkillsView(generics.ListCreateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalSkillsSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional skills found!")
        
        return ProfessionalSkills.objects.filter(owner = professional)

class UpdateSkillsView(generics.UpdateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalSkillsSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional skills to update")
        
        return ProfessionalSkills.objects.filter(owner = professional)
    
class DeleteSkillsView(generics.DestroyAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ProfessionalSkillsSerializer

    def get_queryset(self):
        professional = getattr(self.request.user.user_profile, "professional_detail", None)
        if professional is None:
            raise NotFound("No professional skills to delete")
        
        return ProfessionalSkills.objects.filter(owner = professional)
    

# NORMAL WORKER 
class RetrieveNormalWorkerView(generics.RetrieveUpdateAPIView):
    serializer_class = NormalWorkerSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]

    def get_object(self):
        try:
            profile = self.request.user.user_profile
        except Exception:
            raise NotFound("User profile Not found")
        
        normal_worker, created = NormalWorkerDetail.objects.get_or_create(worker = profile)
 
        return normal_worker
    
    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)
        
    

        
