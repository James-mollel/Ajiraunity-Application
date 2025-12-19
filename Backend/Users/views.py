from django.shortcuts import render
from .serializers import (RegisterSerializer, WorkerProfileSerializer,
                           PasswordResetSerializer,PasswordConfirmSerializer,
                             ReturnUserShortInfo, EmployerProfileSerializer, FeedBackSerializer )
from .models import CustomUserModel, UsersProfile
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from .authentication import CustomJWTCookieAuthentication
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from rest_framework.throttling import UserRateThrottle
from .retelimit import ratelimit
from django.db import transaction
import datetime


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"Ok":True})




class IsJobSeeker(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return  bool( user and getattr(user, "role", None) == CustomUserModel.Roles.WORKER )

class IsEmployer(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return  bool( user and getattr(user, "role", None) == CustomUserModel.Roles.EMPLOYER )
    


class CustomTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("__rfn")

        if refresh_token is None:
            return Response({"detail":"Authentication required"}, status=status.HTTP_403_FORBIDDEN)
        request.data["refresh"] = refresh_token
        try:
           response = super().post(request, *args, **kwargs)
        except (TokenError, InvalidToken,CustomUserModel.DoesNotExist ):
            return Response({"detail":"Authentication required"},status=status.HTTP_403_FORBIDDEN)
        
        if response.status_code == 200:
            access = response.data.get("access")
            if access:
                response.set_cookie(
                    key="__act",
                    value=access,
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path="/",
                    expires=datetime.datetime.now() + datetime.timedelta(minutes=30)

                )

        return response



class EmployerRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @ratelimit(limit=10, window=600, block_time=600)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.save()
        return Response({"message":f"Verification link was sent to {user.email}, Please check your inbox!"}, status=status.HTTP_201_CREATED)
    
    def get_serializer_context(self):
        return {"role":"EMPLOYER"}
    

class WorkerRegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    @ratelimit(limit=10, window=600, block_time=600)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.save()
        return Response({"message":f"Verification link was sent to {user.email}, Please check your inbox!"}, status=status.HTTP_201_CREATED)
    
    def get_serializer_context(self):
        return {"role":"WORKER"}
    

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    @ratelimit(limit=10, window=600, block_time=600)
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUserModel.objects.get(id = uid)
        except (TypeError, ValueError, OverflowError, CustomUserModel.DoesNotExist):
            return Response({"detail":"The link is invalid or has expired, Please try again later!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if default_token_generator.check_token(user, token):
            if user.is_active:
                return Response({"detail":"Email already verified!, Please log in"}, status=status.HTTP_400_BAD_REQUEST)
            
            user.is_active = True
            user.save()
            return Response(
                {"message":"🎉 Email verified successfully!, Please log in!"},
                status=status.HTTP_200_OK
            )
        else:
            return Response({"detail":"The link is invalid or has expired, Please try again later!"}, status=status.HTTP_400_BAD_REQUEST )
        


class LoginView(APIView):
    permission_classes = [AllowAny]

    @ratelimit(limit=10, window=600, block_time=600)
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if (not password or not email):
            return Response({"detail":"All fields required!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if (len(password) > 100):
            return Response({"detail":"Too many chars in password"}, status=status.HTTP_400_BAD_REQUEST)
        if len(email) > 260:
            return Response({"detail":"Too many chars in email"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, email = email, password=password)
        

        if  user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token

                user_datas = ReturnUserShortInfo(user).data

                response = Response({"message":"Welcome back! 🎉", "user":user_datas}, status=status.HTTP_200_OK)
                response.set_cookie(
                    key='__act',
                    value=str(access),
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path='/',
                    expires=datetime.datetime.now() + datetime.timedelta(minutes=30)
                )
                response.set_cookie(
                    key="__rfn",
                    value=str(refresh),
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path='/',
                    expires=datetime.datetime.now() + datetime.timedelta(days=7)
                )

                return response
            else:
                return Response({"detail":"Your Account not yet Verified, Check your email to verify it"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
           return Response({"detail":"Invalid email or password!"}, status=status.HTTP_401_UNAUTHORIZED)

            
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]

    def post(self, request):
        response = Response({"message":"Logged out successfully!"}, status=status.HTTP_200_OK)

        response.delete_cookie(
            key="__act",
            samesite = "None",
            path="/",
        )

        response.delete_cookie(
            key="__rfn",
            samesite = "None",
            path="/",
        )
        
        return response

        

#CURRENT USER!
class PermitUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTCookieAuthentication]

    def get(self, request):
        if request.user.is_authenticated:
            user = ReturnUserShortInfo(request.user).data
            return Response({"user":user}, status=status.HTTP_200_OK)
        else:
            return  Response({"detail":"Forbidden"},status=status.HTTP_403_FORBIDDEN)
#CURRENT USER!



# Password reset view 
class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    @ratelimit(limit=10, window=300, block_time=600)
    def post(self, request):
        serializer = PasswordResetSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"If this email is registered, a reset link has been sent"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Password reset view 



# Password confirm View 

class PasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    @ratelimit(limit=10, window=300, block_time=600)
    def post(self, request, uidb64, token):
        serializer = PasswordConfirmSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Password changed successfully, Please login to continue!"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Password confirm View 





class WorkerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = WorkerProfileSerializer
    # throttle_classes = [ProfileUpdateThrottle]


    def get_object(self): 
        return self.request.user.user_profile
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', True)
        instance = self.get_object() # above data
        serializer = self.get_serializer(
            instance, data = request.data, partial=partial
        )
        serializer.is_valid(raise_exception = True)
        self.perform_update(serializer)

        instance.refresh_from_db()
        out_serializer = self.get_serializer(instance)
        return Response(out_serializer.data, status=status.HTTP_200_OK)
    
   

# # PROFILE USERS VIEW 






class EmployerProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, IsEmployer]
    authentication_classes = [CustomJWTCookieAuthentication]
    serializer_class = EmployerProfileSerializer


    def get_object(self): 
        return self.request.user.user_profile
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):

        partial = kwargs.pop('partial', True)
        instance = self.get_object() # above data
        serializer = self.get_serializer(
            instance, data = request.data, partial=partial
        )
        serializer.is_valid(raise_exception = True)
        self.perform_update(serializer)

        instance.refresh_from_db()
        out_serializer = self.get_serializer(instance)
        return Response(out_serializer.data, status=status.HTTP_200_OK)
    



class FeedBackView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = FeedBackSerializer
    
   