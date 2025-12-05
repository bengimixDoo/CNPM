from django.urls import path
from . import views

urlpatterns = [
    path('year/', views.thong_ke_theo_nam, name='thong_ke_theo_nam'),
]