from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from Users.authentication import CustomJWTCookieAuthentication
from Users.models import CustomUserModel
from Jobs.models import Job
from JobDetails.models import JobApplication
from rest_framework import status, generics
from .serializers import (JobApplicationSerializer, ReportJobSerializer, ReturnShortProfileSerializer, 
                          ReturnJobApplicationResponseSerializer, ListAppliedJobsSerializer, ListSavedJobsSerializer,
                           JobApplicationDetailSerializer,UpdateApplicationStatusSerializer )
from rest_framework.response import Response
from JobDetails.models import SavedJobs
from django.db import IntegrityError
from rest_framework.exceptions import PermissionDenied

from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q,Count
from rest_framework.parsers import FormParser, MultiPartParser



# Create your views here.

class IsJobSeeker(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return  bool( user and getattr(user, "role", None) == CustomUserModel.Roles.WORKER )

class IsEmployer(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return  bool( user and getattr(user, "role", None) == CustomUserModel.Roles.EMPLOYER )
       
        

#JOB APPLICATION  
class CreateJobApplicationView(generics.CreateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsJobSeeker]
    serializer_class = JobApplicationSerializer
    parser_classes = (FormParser, MultiPartParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        application = serializer.save()

        response_data = ReturnJobApplicationResponseSerializer(application, context = {"request":request}).data
        return Response({"message":"Job application created successfully!", "application_url":response_data["application_url"]}, status= status.HTTP_201_CREATED)
    
    

    # def get_queryset(self):
    #     return JobApplication.objects.filter(user = self.request.user.user_profile)


    


class ListJobApplicationView(generics.ListAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsJobSeeker]
    serializer_class = ListAppliedJobsSerializer
    

    def get_queryset(self):
        return JobApplication.objects.filter(user = self.request.user.user_profile).select_related(
            "job",
            "job__region",
            "job__district",
            "job__ward",
            "job__company",

        ).order_by("-applied_at")

        
    
class ViewAppliedJobView(generics.RetrieveAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsJobSeeker]
    serializer_class = ListAppliedJobsSerializer

    def get_queryset(self):
        user = self.request.user.user_profile
        
        return JobApplication.objects.filter(user = user)



#REPORT JOB
class ReportJobView(generics.CreateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ReportJobSerializer




#SAVE JOBS
class SaveJobUnsaveJobView(APIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsJobSeeker]

    def post(self, request, *args, **kwargs):
        job_saver = request.user
        job_slug = request.data.get("job_slug")


        try:
            job = Job.objects.get(slug = job_slug)
        except Job.DoesNotExist:
            return Response({"detail":"Job not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            saved_job, created = SavedJobs.objects.get_or_create(
                user = job_saver,
                job = job
            )
        except IntegrityError:
            saved_job = SavedJobs.objects.filter(user = job_saver, job = job).first()
            created = False


        if not created:
            saved_job.delete()
            return Response({"message":"Removed from saved list!", "saved":False}, status=status.HTTP_200_OK)
        
        else:
            return Response({"message":"Job saved successfully!", "saved":True}, status=status.HTTP_201_CREATED)




class ShortProfileView(generics.RetrieveAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsJobSeeker]
    serializer_class = ReturnShortProfileSerializer


    def get_object(self):
        return self.request.user.user_profile
    



class ListSavedJobsView(generics.ListAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsJobSeeker]
    serializer_class = ListSavedJobsSerializer

    def get_queryset(self):
        return SavedJobs.objects.filter(user = self.request.user).select_related(
            "job",
            "job__region",
            "job__district",
            "job__ward",
        ).order_by("-saved_at")
    



# -=============--***********JOB APPLICATIONS ***********-----------==========
class ApplicationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50



class ListJobApplicantToEmoloyerView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = JobApplicationDetailSerializer

    pagination_class = ApplicationPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status","job"] 
    

    
    def get_queryset(self):
        employer = getattr(self.request.user, "user_profile", None)
        if employer is None:
            raise PermissionDenied("You are not allowed here!")
        
        return  JobApplication.objects.filter(

                                  job__poster = employer

                                         ).select_related(
                                             
                                             "job","user"

                                                ).prefetch_related(
                                                    
                                                    "user__professional_detail__skills_professional",
                                                    "user__professional_detail__languages_professional",
                                                    "user__professional_detail__education_professional",
                                                    "user__professional_detail__professional_experience",

                                                    "user__normal_workers",

                                                ).order_by("-applied_at")
    

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        employer = getattr(self.request.user, "user_profile", None)
        if employer is None:
            raise PermissionDenied("You are not allowed here!")
        
        status_count = JobApplication.objects.filter(
            job__poster = employer
        ).values("status").annotate(total = Count('id'))

        counts_dict = {item['status']: item["total"] for item in status_count}

        counts_dict['ALL'] = sum(counts_dict.values())

        response.data['status_counts'] = counts_dict

        return response
    
 

class RetrieveApplicationView(generics.RetrieveAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsEmployer]
    serializer_class = JobApplicationDetailSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(
            job__poster = self.request.user.user_profile
        ).select_related(
            "job", "user"
        ).prefetch_related(
            "user__professional_detail__skills_professional",
            "user__professional_detail__languages_professional",
            "user__professional_detail__education_professional",
            "user__professional_detail__professional_experience",
            "user__normal_workers",
        )
    

class UpdateApplicationStatusView(generics.UpdateAPIView):
    authentication_classes = [CustomJWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsEmployer]
    serializer_class = UpdateApplicationStatusSerializer

    def get_queryset(self):
        return JobApplication.objects.filter(job__poster = self.request.user.user_profile)


    


