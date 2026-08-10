import re
from django.conf import settings


def _is_owner_path(path):
    if path.startswith('/accounts/owner/'):
        return True
    if path.startswith('/admin/'):
        return True
    if path.startswith('/hostels/'):
        rest = path[len('/hostels/'):]
        if not rest:
            return False
        if rest == 'dashboard/' or rest == 'create/':
            return True
        if re.match(r'^\d+/(edit/|delete/|room/)', rest):
            return True
        return False
    return False


class MultiSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info

        if _is_owner_path(path):
            cookie_name = 'owner_sessionid'
        else:
            cookie_name = 'sessionid'

        original = settings.SESSION_COOKIE_NAME
        settings.SESSION_COOKIE_NAME = cookie_name

        try:
            return self.get_response(request)
        finally:
            settings.SESSION_COOKIE_NAME = original
