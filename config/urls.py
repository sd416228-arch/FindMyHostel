"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView
from hostels.views import HomeView

urlpatterns = [
    # Custom website admin dashboard (replaces the Django admin as the
    # primary management console for website admins).
    path('panel/', include('adminpanel.urls')),
    # Any legacy /admin/ links are sent to the custom dashboard.
    re_path(r'^admin/', RedirectView.as_view(url='/panel/', permanent=True)),
    path('accounts/', include('accounts.urls')),
    path('hostels/', include('hostels.urls')),
    path('bookings/', include('bookings.urls')),
    path('', HomeView.as_view(), name='home'),
]

from django.views.static import serve

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]

