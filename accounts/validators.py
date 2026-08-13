import re

PHONE_RE = re.compile(r'^\d{10}$')


def is_valid_phone(phone):
    """Return True if the phone number is exactly 10 digits."""
    return bool(phone) and bool(PHONE_RE.fullmatch(str(phone).strip()))
