from django.urls import path
from . import views

app_name = 'hostels'

urlpatterns = [
    # Public views
    path('', views.hostel_list, name='list'),
    path('<int:pk>/', views.hostel_detail, name='detail'),
    
    # Owner views
    path('dashboard/', views.owner_dashboard, name='owner_dashboard'),
    path('create/', views.hostel_form, name='create'),
    path('<int:pk>/edit/', views.hostel_form, name='edit'),
    path('<int:pk>/delete/', views.hostel_delete, name='delete'),
    
    # Room management
    path('<int:hostel_id>/room/create/', views.room_form, name='room_create'),
    path('<int:hostel_id>/room/<int:room_id>/edit/', views.room_form, name='room_edit'),
    
    # Reservations
    path('reservations/', views.reservation_list, name='reservation_list'),
    path('reservations/<int:hostel_id>/', views.reservation_detail, name='reservation_detail'),
    path('my-reservations/', views.my_reservations, name='my_reservations'),
    path('<int:pk>/reserve/', views.submit_reservation, name='reserve'),
    path('reservation/<int:pk>/<str:action>/', views.update_reservation, name='update_reservation'),

    # Reviews
    path('<int:pk>/review/', views.submit_review, name='submit_review'),
    
    # API endpoints
    path('api/search/', views.api_hostels_search, name='api_search'),
    path('api/<int:pk>/', views.api_hostel_detail, name='api_detail'),
    path('api/check-availability/', views.api_check_availability, name='api_check_availability'),
    path('submit-testimonial/', views.submit_testimonial, name='submit_testimonial'),
]
