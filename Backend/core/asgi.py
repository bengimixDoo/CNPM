"""
<<<<<<<< HEAD:Backend/core/asgi.py
ASGI config for core project.
========
ASGI config for quanlychungcu project.
>>>>>>>> codeBEforQuanLy:Backend/quanlychungcu/asgi.py

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_asgi_application()
