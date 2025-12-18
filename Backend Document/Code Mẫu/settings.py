# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 3rd Party
    'rest_framework',
    'corsheaders',

    # My Apps
    'users',
    'residents',
    'finance',
    'services',
]

AUTH_USER_MODEL = 'users.User'  # Quan trọng: Trỏ về Custom User

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# Database config (Neon Postgres) bạn tự điền nhé
DATABASES = { ... }