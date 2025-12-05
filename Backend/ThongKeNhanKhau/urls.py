from django.urls import path
from . import views

urlpatterns = [
    path('gender/', views.thong_ke_gioi_tinh, name='thong_ke_gioi_tinh'),
]