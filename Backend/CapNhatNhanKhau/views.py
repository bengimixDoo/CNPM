from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import NhanKhau
from .forms import NhanKhauForm

# Đường dẫn chuyển hướng chung sau khi thêm/sửa/xóa thành công
SUCCESS_URL = reverse_lazy('nhankhau_list')
# ==================================
# 1. VIEW HIỂN THỊ DANH SÁCH (READ)
# ==================================
class NhanKhauListView(ListView):
    model = NhanKhau
    template_name = 'nhankhau_list.html' # Tạo file này trong thư mục templates/nhankhau/
    context_object_name = 'nhan_khau_list' # Tên biến dùng trong template

# ==================================
# 2. VIEW THÊM MỚI (CREATE)
# ==================================
class NhanKhauCreateView(CreateView):
    model = NhanKhau
    form_class = NhanKhauForm # Sử dụng form đã định nghĩa
    template_name = 'nhankhau_form.html'
    success_url = SUCCESS_URL

    def form_valid(self, form):
        # Dòng này tự động gọi tất cả các hàm clean_* và clean()
        if form.is_valid(): 
            # Nếu không có lỗi, tiến hành lưu vào DB
            return super().form_valid(form) 
        else:
            # Nếu có lỗi, render lại form với thông báo lỗi
            return self.form_invalid(form)

# ==================================
# 3. VIEW CHỈNH SỬA (UPDATE)
# ==================================
class NhanKhauUpdateView(UpdateView):
    model = NhanKhau
    form_class = NhanKhauForm
    template_name = 'nhankhau_form.html'
    success_url = SUCCESS_URL
    # Mặc định, view này sẽ tìm kiếm đối tượng dựa trên 'pk' (Primary Key mặc định 'id') trong URL.

# ==================================
# 4. VIEW XÓA (DELETE)
# ==================================
class NhanKhauDeleteView(DeleteView):
    model = NhanKhau
    template_name = 'nhankhau_confirm_delete.html' # Template xác nhận xóa
    success_url = SUCCESS_URL
    # Mặc định, view này sẽ tìm kiếm đối tượng dựa trên 'pk' (Primary Key mặc định 'id') trong URL.


