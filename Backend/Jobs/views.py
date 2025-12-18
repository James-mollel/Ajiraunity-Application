from django.shortcuts import render
from Jobs.serializers import (JobCategorySerializer,CompanySerializer, JobsSerializer, ListJobsPublicSerializer )
from Jobs.models import JobCategory,Job,Company
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics,status, filters
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from Users.authentication import CustomJWTCookieAuthentication
from rest_framework.views import APIView
from Users.models import CustomUserModel
from rest_framework.permissions import BasePermission

from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q


class IsEmployer(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return  bool( user and getattr(user, "role", None) == CustomUserModel.Roles.EMPLOYER )
       
        


# Create your views here.

class ProfessionalJobsCategoryView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobCategorySerializer 

    def get_queryset(self):
        return JobCategory.objects.filter(category_type = "professional").order_by("name")


class CasualJobsCategoryView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobCategorySerializer
    

    def get_queryset(self):
        return JobCategory.objects.filter(category_type = "informal").order_by("name")




#======== COMPANY =====
class ListCreateCompanyView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = CompanySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response({"message":"Company created successfully!"}, status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        employer_comp = getattr(self.request.user, "user_profile", None)
        if employer_comp is None:
            raise PermissionDenied("You are not required here!")
        
        return Company.objects.filter(owner = employer_comp)
    

class ViewUpdateDestroyCompanyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = CompanySerializer

    def get_queryset(self):
        employer_comp = getattr(self.request.user, "user_profile", None)
        if employer_comp is None:
            raise PermissionDenied("You are not allowed here!") 
        
        return Company.objects.filter(owner = employer_comp)
    



# ======JOBS ==========
class CreateCompanyJobView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = JobsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()

        return  Response({"message":"Job created successfully"}, status=status.HTTP_201_CREATED)
    

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["post_type"]="COMPANY"
        return context
    


class CreateIndividualJobView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = JobsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()

        return  Response({"message":"Job created successfully"}, status=status.HTTP_201_CREATED)
    

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["post_type"] ="INDIVIDUAL"
        return context
    

class JobPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class ListJobsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = JobsSerializer
    pagination_class = JobPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["post_type","status"] 

    
    def get_queryset(self):
        job_employer = getattr(self.request.user, "user_profile", None)
        if job_employer is None:
            raise PermissionDenied("You are not allowed here!")
        
        queryset =  Job.objects.filter(poster = job_employer)

        post_type = self.request.query_params.get("post_type")
        status_params = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if post_type in ["COMPANY","INDIVIDUAL"]:
            queryset = queryset.filter(post_type = post_type)
        if status_params in ["ACTIVE","CLOSED","PENDING"]:
            queryset = queryset.filter(status =status_params.upper())

        if search and len(search.strip()) > 2:
            queryset = queryset.filter(
                Q(title__icontains = search) | 
                Q(code__icontains = search)
            )

        return queryset.order_by("-created_at")
    



class ViewUpdateDestroyJobsView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = JobsSerializer

    def get_queryset(self):
        employer_job = getattr(self.request.user, "user_profile", None)
        if employer_job is None:
            raise PermissionDenied("You are not allowed here!")
        
        return Job.objects.filter(poster = employer_job)
    




class ListJobsPublicView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ListJobsPublicSerializer
    pagination_class = JobPagination

    def get_queryset(self):
        querys = Job.objects.filter(status = Job.JobStatus.ACTIVE).select_related(
            "company",
            "region",
            "district",
            "ward",
            "category",
        )

        search = self.request.query_params.get("query", None)
        search_type = self.request.query_params.get("type", None)

        post_type = self.request.query_params.get("post_type", None)

        company = self.request.query_params.get("company", None)
        job_type = self.request.query_params.get("job_type", None)

        experience_level = self.request.query_params.get("experience_level", None)
        # category = self.request.query_params.get("category", None)

        # ------------PERFORM SEARCH ----------
        if search and search_type == "title":
          querys =  querys.filter(title__icontains = search)
        
        elif search and search_type == "category":
           querys =  querys.filter(category__name__icontains = search)

        
        elif search and search_type == "region":
           querys=  querys.filter(region__name__icontains = search)

        elif search and search_type == "district":
            querys = querys.filter(district__name__icontains = search)
        
        elif search and search_type == "ward":
           querys =  querys.filter(ward__name__icontains = search)


        elif search and len(search.strip()) > 2:
            querys = querys.filter(
                Q(title__icontains = search) |
                Q(region__name__icontains = search)| 
                Q(district__name__icontains = search)| 
                Q(ward__name__icontains = search)| 
                Q(category__name__icontains = search) |
                Q(job_type__icontains = search) |
                Q(job_summary__icontains = search) 

            )
        # ------------PERFORM FILTERS -------------

        if post_type and post_type in ["COMPANY", "INDIVIDUAL"]:
            querys = querys.filter(post_type = post_type)

        if job_type is not None:
            querys = querys.filter(job_type = job_type)

        if company is not None:
            querys = querys.filter(company__name = company)
        
        if experience_level is not None:
            querys = querys.filter(experience_level = experience_level)

        # if  is not None and category_id.isdigit():
        #     querys = querys.filter(category_id = category_id)

        return querys.order_by("-created_at")
    


class JobsSuggestionsSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        search = request.query_params.get("query", None)
        my_query_set = Job.objects.filter(status = Job.JobStatus.ACTIVE)


        if not search or len(search.strip()) < 2:
            return Response({"suggestions": []})
       
        suggestions  = []
        
        titles = my_query_set.filter(title__icontains = search).values_list("title", flat=True).distinct()[:5]
        for title in titles:
            suggestions.append({"text":title, "type":"title"})


        categories = my_query_set.filter(category__name__icontains = search).values_list("category__name", flat=True).distinct()[:5]
        for category in categories:
            suggestions.append({"text":category, "type":"category"})


            #BY -------------LOCATIONS ------------
        regions = my_query_set.filter(region__name__icontains = search).values_list("region__name", flat=True).distinct()[:5]
        for region in regions:
            suggestions.append({"text":region, "type":"region"})

        
        districts = my_query_set.filter(district__name__icontains = search).values_list("district__name", flat=True).distinct()[:5]
        for district in districts:
            suggestions.append({"text":district, "type":"district"})

        
        wards = my_query_set.filter(ward__name__icontains = search).values_list("ward__name", flat=True).distinct()[:5]
        for ward in wards:
            suggestions.append({"text":ward, "type":"ward"})

        
        return Response({"suggestions": suggestions[:10]})



#RETRIEVE JOB PUBLIC===============

class RetrieveJobPublicView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ListJobsPublicSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Job.objects.filter(status = Job.JobStatus.ACTIVE)
    

class CloseJobView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    authentication_classes = [CustomJWTCookieAuthentication]

    def post(self, request,job_id, *args, **kwargs):
        try:
            job = Job.objects.get(id = job_id, poster = request.user.user_profile)
        except Job.DoesNotExist:
            raise NotFound("Job not found")
        
        if job.status != Job.JobStatus.ACTIVE:
            return Response({"detail":"Only active jobs can be closed"}, status=status.HTTP_400_BAD_REQUEST)
        
        job.status = Job.JobStatus.CLOSED
        job.save(update_fields = ['status','updated_at'])

        return Response({"message":"Job successfully closed.", "status":job.status}, status=status.HTTP_200_OK)


 