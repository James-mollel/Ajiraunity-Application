from django.urls import path
from .views import (WorkerRegisterView, EmployerRegisterView, CustomTokenRefreshView,
                    PasswordResetView, PasswordConfirmView, LogoutView, WorkerProfileView,
                    get_csrf_token,PermitUserView, LoginView, VerifyEmailView, EmployerProfileView,
                    FeedBackView)
 
urlpatterns = [
    path("signup/worker/user/", WorkerRegisterView.as_view(), name="register_worker" ),
    path("signup/employer/", EmployerRegisterView.as_view(), name="register_employer"),
    path("auth/user-csrf/",get_csrf_token, name="get_csrf_token"),
    path("auth/user/login/", LoginView.as_view(), name="login_user"),
    path("auth/user/user-current/", PermitUserView.as_view(), name="permit_current_user"),
    path("user/loggout/auth/", LogoutView.as_view(), name="Loggout_user"),


    
    path("auth-user/profile-data/",WorkerProfileView.as_view(), name="worker_profile_update"),
    path("auth-employer/profile-data/",EmployerProfileView.as_view(), name="worker_profile_update"),

    
 
    path("password-reset/user/", PasswordResetView.as_view(), name="password_reset_view_enter_email"),
    path("password/confirm/users/<uidb64>/<token>/", PasswordConfirmView.as_view(), name="password_confirm"),

    path("verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify_email"),
    path("refresh/users/",CustomTokenRefreshView.as_view(), name="refresh_token"),

    path("user-feedback/", FeedBackView.as_view(), name="user_feedback"),

]  