# FindMy Hostel Django Project

A Django web application for hostel management.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Virtual environment created and activated

### Installation

1. **Activate the virtual environment:**
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser (admin account):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

   The application will be available at `http://localhost:8000/`

## Project Structure

```
FindMy Hostel/
├── config/              # Django configuration
│   ├── __init__.py
│   ├── settings.py      # Project settings
│   ├── urls.py          # URL routing
│   ├── wsgi.py          # WSGI configuration
│   └── asgi.py          # ASGI configuration
├── static/              # Static files (CSS, JS, images)
├── templates/           # HTML templates
├── venv/                # Virtual environment
├── manage.py            # Django management script
├── db.sqlite3           # Database (auto-created)
├── requirements.txt     # Python dependencies
└── .gitignore          # Git ignore file
```

## Available Commands

- `python manage.py runserver` - Start development server
- `python manage.py migrate` - Apply database migrations
- `python manage.py makemigrations` - Create new migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py collectstatic` - Collect static files

## Admin Panel

Access the admin panel at `http://localhost:8000/admin/` with your superuser credentials.

## Environment Variables

For production, update the following in `config/settings.py`:
- `SECRET_KEY` - Change to a secure random key
- `DEBUG` - Set to `False`
- `ALLOWED_HOSTS` - Add your domain

## Next Steps

1. Create Django apps: `python manage.py startapp app_name`
2. Define models in each app's `models.py`
3. Create views and URL patterns
4. Build templates in the `templates/` directory
