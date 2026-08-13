import time
from importlib import import_module

from django.conf import settings
from django.contrib.sessions.backends.base import UpdateError
from django.contrib.sessions.exceptions import SessionInterrupted
from django.utils.cache import patch_vary_headers
from django.utils.deprecation import MiddlewareMixin
from django.utils.http import http_date

OWNER_SESSION_COOKIE_NAME = 'owner_sessionid'
ADMIN_SESSION_COOKIE_NAME = 'admin_sessionid'


class NoCacheMiddleware(MiddlewareMixin):
    """Prevent the browser from storing stateful/form pages.

    Without this, the browser caches filled forms and the Back/Forward
    buttons resurrect them, letting a user re-submit a booking, login,
    reservation, etc. after the action was already completed.

    ``no-store`` disables the browser back/forward cache (bfcache) for these
    responses, so pressing Back always re-fetches a fresh page from the
    server (a blank form at worst, or a redirect because the user is now
    logged in / already booked).
    """

    def process_response(self, request, response):
        path = request.path or ''
        # Keep static & media assets cacheable.
        if path.startswith(settings.STATIC_URL) or path.startswith(settings.MEDIA_URL):
            return response
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response


def is_admin_panel_path(path):
    """Return True if the request path belongs to the Admin Panel (/panel/...).

    The Admin Panel uses an independent session cookie so that logging in on
    the Admin Panel has no effect on the main website and vice versa.
    """
    parts = [p for p in path.split('/') if p]
    if not parts:
        return False
    return parts[0] == 'panel'


def is_owner_portal_path(path):
    """Return True if the request path belongs to the Owner Portal.

    Owner Portal paths use an independent session cookie so that logging in
    on the Owner Portal has no effect on the main (user) website and vice versa.
    """
    parts = [p for p in path.split('/') if p]
    if not parts:
        return False

    first = parts[0]
    # /accounts/owner/... (login, register, logout, profile)
    if first == 'accounts' and len(parts) >= 2 and parts[1] == 'owner':
        return True

    # Owner management pages under /hostels/
    if first == 'hostels' and len(parts) >= 2:
        second = parts[1]
        if second in ('dashboard', 'create', 'reservation', 'reservations', 'testimonial'):
            return True
        # /hostels/<id>/edit|delete|room/...
        if second.isdigit() and len(parts) >= 3 and parts[2] in ('edit', 'delete', 'room'):
            return True

    # Owner management pages under /bookings/
    if first == 'bookings' and len(parts) >= 2 and parts[1] == 'owner':
        return True

    return False


class PortalSessionMiddleware(MiddlewareMixin):
    """Session middleware that keeps the Owner Portal and the main website
    on separate sessions (separate cookies)."""

    def __init__(self, get_response):
        super().__init__(get_response)
        engine = import_module(settings.SESSION_ENGINE)
        self.SessionStore = engine.SessionStore

    def _cookie_name(self, request):
        if getattr(request, '_fm_admin_panel', False):
            return ADMIN_SESSION_COOKIE_NAME
        if getattr(request, '_fm_owner_portal', False):
            return OWNER_SESSION_COOKIE_NAME
        return settings.SESSION_COOKIE_NAME

    def process_request(self, request):
        request._fm_owner_portal = is_owner_portal_path(request.path)
        request._fm_admin_panel = is_admin_panel_path(request.path)
        cookie_name = self._cookie_name(request)
        session_key = request.COOKIES.get(cookie_name)
        request.session = self.SessionStore(session_key)

    def process_response(self, request, response):
        try:
            accessed = request.session.accessed
            modified = request.session.modified
            empty = request.session.is_empty()
        except AttributeError:
            return response

        cookie_name = self._cookie_name(request)

        if cookie_name in request.COOKIES and empty:
            response.delete_cookie(
                cookie_name,
                path=settings.SESSION_COOKIE_PATH,
                domain=settings.SESSION_COOKIE_DOMAIN,
                samesite=settings.SESSION_COOKIE_SAMESITE,
            )
            need_vary_cookie = True
        else:
            need_vary_cookie = accessed
            if (modified or settings.SESSION_SAVE_EVERY_REQUEST) and not empty:
                if request.session.get_expire_at_browser_close():
                    max_age = None
                    expires = None
                else:
                    max_age = request.session.get_expiry_age()
                    expires = http_date(time.time() + max_age)
                if response.status_code < 500:
                    try:
                        request.session.save()
                    except UpdateError:
                        raise SessionInterrupted(
                            "The request's session was deleted before the "
                            "request completed. The user may have logged "
                            "out in a concurrent request, for example."
                        )
                    response.set_cookie(
                        cookie_name,
                        request.session.session_key,
                        max_age=max_age,
                        expires=expires,
                        domain=settings.SESSION_COOKIE_DOMAIN,
                        path=settings.SESSION_COOKIE_PATH,
                        secure=settings.SESSION_COOKIE_SECURE or None,
                        httponly=settings.SESSION_COOKIE_HTTPONLY or None,
                        samesite=settings.SESSION_COOKIE_SAMESITE,
                    )
                    need_vary_cookie = True

        if need_vary_cookie:
            patch_vary_headers(response, ("Cookie",))
        return response
