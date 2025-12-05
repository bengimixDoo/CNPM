from django.urls import path
from . import views

urlpatterns = [
    # Danh sách Nhân Khẩu
    path('', views.NhanKhauListView.as_view(), name='nhankhau_list'),
    
    # Thêm mới Nhân Khẩu
    path('add/', views.NhanKhauCreateView.as_view(), name='nhankhau_create'),
    
    # Sửa Nhân Khẩu theo ID
    # <int:pk> là tham số động (Primary Key của Nhân Khẩu)
    path('change/<int:pk>/', views.NhanKhauUpdateView.as_view(), name='nhankhau_update'),
    
    # Xóa Nhân Khẩu theo ID
    path('delete/<int:pk>/', views.NhanKhauDeleteView.as_view(), name='nhankhau_delete'),
]