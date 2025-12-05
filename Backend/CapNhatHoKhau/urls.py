from django.urls import path
from . import views

urlpatterns = [
    # Danh sách Hộ Khẩu
    path('', views.HoKhauListView.as_view(), name='hokhau_list'),
    
    # Thêm mới Hộ Khẩu
    path('add/', views.HoKhauCreateView.as_view(), name='hokhau_create'),
    
    # Sửa Hộ Khẩu theo Mã Hộ Khẩu (MaHoKhau là Primary Key kiểu chuỗi)
    # SỬ DỤNG <str:pk> vì MaHoKhau là CharField (chuỗi)
    path('change/<str:pk>/', views.HoKhauUpdateView.as_view(), name='hokhau_update'),
    
    # Xóa Hộ Khẩu theo Mã Hộ Khẩu
    path('delete/<str:pk>/', views.HoKhauDeleteView.as_view(), name='hokhau_delete'),
]