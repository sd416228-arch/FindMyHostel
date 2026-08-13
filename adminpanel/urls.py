from django.urls import path
from . import views

app_name = 'adminpanel'

urlpatterns = [
    # Authentication
    path('login/', views.admin_login, name='login'),
    path('register/', views.admin_register, name='register'),
    path('logout/', views.admin_logout, name='logout'),

    # Dashboard
    path('', views.dashboard, name='dashboard'),

    # Users
    path('users/', views.user_list, name='users'),
    path('users/<int:pk>/', views.user_detail, name='user_detail'),
    path('users/<int:pk>/toggle-active/', views.user_toggle_active, name='user_toggle_active'),
    path('users/<int:pk>/toggle-verified/', views.user_toggle_verified, name='user_toggle_verified'),
    path('users/<int:pk>/set-role/', views.user_set_role, name='user_set_role'),
    path('users/<int:pk>/delete/', views.user_delete, name='user_delete'),

    # Hostels
    path('hostels/', views.hostel_list, name='hostels'),
    path('hostels/<int:pk>/', views.hostel_detail, name='hostel_detail'),
    path('hostels/<int:pk>/toggle-verified/', views.hostel_toggle_verified, name='hostel_toggle_verified'),
    path('hostels/<int:pk>/toggle-active/', views.hostel_toggle_active, name='hostel_toggle_active'),
    path('hostels/<int:pk>/delete/', views.hostel_delete, name='hostel_delete'),

    # Bookings
    path('bookings/', views.booking_list, name='bookings'),
    path('bookings/<int:pk>/', views.booking_detail, name='booking_detail'),
    path('bookings/<int:pk>/set-status/', views.booking_set_status, name='booking_set_status'),
    path('bookings/<int:pk>/delete/', views.booking_delete, name='booking_delete'),

    # Reservations
    path('reservations/', views.reservation_list, name='reservations'),
    path('reservations/<int:pk>/action/', views.reservation_action, name='reservation_action'),

    # Testimonials
    path('testimonials/', views.testimonial_list, name='testimonials'),
    path('testimonials/<int:pk>/toggle-active/', views.testimonial_toggle_active, name='testimonial_toggle_active'),
    path('testimonials/<int:pk>/delete/', views.testimonial_delete, name='testimonial_delete'),
]