#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    if 'runserver' in sys.argv and os.environ.get('RUN_MAIN') != 'true':
        print("\n" + "="*50)
        print("🏠 FIND MY HOSTEL - LINKS")
        print("="*50)
        print("🌍 Main Website : http://127.0.0.1:8000/")
        print("🏢 Owner Portal : http://127.0.0.1:8000/accounts/owner/login/")
        print("="*50 + "\n")

    try:
        # pyrefly: ignore [missing-import]
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
