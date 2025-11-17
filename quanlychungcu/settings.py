# Mở file: quanlychungcu/settings.py
# (Thay thế toàn bộ file)

import os
from dotenv import load_dotenv
from urllib.parse import urlparse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env') # Tải file .env

# --- Cấu hình CSDL (Lấy từ file .env) ---
db_url = os.getenv("DATABASE_URL")
tmpPostgres = urlparse(db_url)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': tmpPostgres.path.replace('/', ''),
        'USER': tmpPostgres.username,
        'PASSWORD': tmpPostgres.password,
        'HOST': tmpPostgres.hostname,
        'PORT': tmpPostgres.port or 5432,
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

SECRET_KEY = 'django-insecure-u!6=52=yf34!wk$a%wg8j5mx&f2!mh+=ct+oz+wd-#77v0*y4('
DEBUG = True

ALLOWED_HOSTS = [
    '.ngrok-free.app',
    '127.0.0.1',
    'localhost',
]

# --- Cấu hình App ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Thư viện bên thứ ba
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # App của bạn
    'users.apps.UsersConfig',
    # 'api.apps.ApiConfig', # <-- CHÚNG TA SẼ THÊM APP NÀY SAU
    'quanlychungcu'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # <-- CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'quanlychungcu.urls' # <-- Tên project của bạn
WSGI_APPLICATION = 'quanlychungcu.wsgi.application' # <-- Tên project của bạn

# ... (Giữ nguyên TEMPLATES, AUTH_PASSWORD_VALIDATORS, ...) ...
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# === CẤU HÌNH QUAN TRỌNG CHO LOGIN ===

# 1. Chỉ định Custom User Model
# AUTH_USER_MODEL = 'users.CustomUser'

# 2. Cấu hình CORS (Cho phép FE gọi)
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'ngrok-skip-browser-warning',
]

# 3. Cấu hình Django Rest Framework (Dùng JWT)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
