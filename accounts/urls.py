from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Original routes
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    
    # Separate Student/Traveler routes
    path('student/register/', views.student_register, name='student_register'),
    path('student/login/', views.student_login, name='student_login'),
    path('student/dashboard/', views.student_dashboard, name='student_dashboard'),
    
    # Separate Owner routes
    path('owner/register/', views.owner_register, name='owner_register'),
    path('owner/login/', views.owner_login, name='owner_login'),
    path('owner/logout/', views.owner_logout, name='owner_logout'),
    path('owner/profile/', views.owner_profile, name='owner_profile'),
    path('owner/profile/edit/', views.owner_edit_profile, name='owner_edit_profile'),
    
    # API endpoints
    path('api/check-email/', views.check_email_api, name='check_email_api'),
]
