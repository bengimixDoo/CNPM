from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import  HoKhau
from .forms import HoKhauForm

# Đường dẫn chuyển hướng chung sau khi thêm/sửa/xóa thành công
SUCCESS_URL_HOKHAU = reverse_lazy('hokhau_list')
# ==================================
# 1. VIEW HIỂN THỊ DANH SÁCH (READ)
# ==================================
class HoKhauListView(ListView):
    model = HoKhau
    template_name = 'hokhau_list.html' 
    context_object_name = 'hokhau_list'

    # def form_valid(self, form):
    #     # Dòng này tự động gọi tất cả các hàm clean_* và clean()
    #     if form.is_valid(): 
    #         # Nếu không có lỗi, tiến hành lưu vào DB
    #         return super().form_valid(form) 
    #     else:
    #         # Nếu có lỗi, render lại form với thông báo lỗi
    #         return self.form_invalid(form) 

# ==================================
# 2. VIEW THÊM MỚI (CREATE)
# ==================================
class HoKhauCreateView(CreateView):
    model = HoKhau
    form_class = HoKhauForm
    template_name = 'hokhau_form.html'
    success_url = SUCCESS_URL_HOKHAU

# ==================================
# 3. VIEW CHỈNH SỬA (UPDATE)
# ==================================
class HoKhauUpdateView(UpdateView):
    model = HoKhau
    form_class = HoKhauForm
    template_name = 'hokhau_form.html'
    success_url = SUCCESS_URL_HOKHAU
    # Chú ý: Vì MaHoKhau là PK kiểu CharField, Django sẽ dùng nó để tra cứu.
    # Trong URL, chúng ta sẽ dùng tham số <str:pk>.

# ==================================
# 4. VIEW XÓA (DELETE)
# ==================================
class HoKhauDeleteView(DeleteView):
    model = HoKhau
    template_name = 'hokhau_confirm_delete.html' 
    success_url = SUCCESS_URL_HOKHAU