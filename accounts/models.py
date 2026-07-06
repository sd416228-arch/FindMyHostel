from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

class CustomUser(AbstractUser):
    """Custom User model with email as username and role field"""
    
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('owner', 'Hostel Owner'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'auth_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    def is_hostel_owner(self):
        return self.role == 'owner'
    
    def is_student(self):
        return self.role == 'student'
