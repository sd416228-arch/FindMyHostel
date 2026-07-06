from django.urls import path
from . import views

app_name = 'bookings'

urlpatterns = [
    # Public views
    path('', views.booking_list, name='list'),
    path('<int:pk>/', views.booking_detail, name='detail'),
    path('<int:pk>/cancel/', views.cancel_booking, name='cancel'),
    
    # API endpoints
    path('api/create/', views.api_create_booking, name='api_create'),
    path('api/user/', views.api_user_bookings, name='api_user_bookings'),
    path('api/<int:pk>/cancel/', views.api_cancel_booking, name='api_cancel'),
]
