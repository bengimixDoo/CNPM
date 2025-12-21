### 1. FILE: `views.py`

**Vai trò:** Tổng hợp dữ liệu (Aggregation), thống kê và báo cáo. File này import model từ khắp nơi trong dự án.

Python

```
# --- IMPORT ---
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Sum, Count # Hàm tính toán SQL mạnh mẽ
# Import Cross-App: Lấy dữ liệu từ Tài chính, Dịch vụ, Cư dân
from finance.models import HoaDon
from services.models import YeuCau
from residents.models import CanHo

# --- 1. VIEW CHO QUẢN LÝ (MANAGER DASHBOARD) ---
class DashboardManagerView(APIView):
    """
    Mục đích: Một màn hình tổng quan để Manager biết tình hình sức khỏe của tòa nhà ngay khi đăng nhập.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # 1. Phân quyền cứng: Chỉ Manager/Admin mới được xem số liệu nhạy cảm này
        if request.user.role not in ['manager', 'admin']:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        # 2. Sức khỏe Tài chính: Bao nhiêu hóa đơn chưa thu? Tổng tiền nợ là bao nhiêu?
        # aggregate(Sum): Giúp SQL cộng tổng ngay trong DB, trả về số duy nhất. Rất nhanh.
        unpaid_invoices = HoaDon.objects.filter(trang_thai=0).count()
        total_unpaid = HoaDon.objects.filter(trang_thai=0).aggregate(Sum('tong_tien'))['tong_tien__sum'] or 0

        # 3. Chất lượng Dịch vụ: Có bao nhiêu yêu cầu dân kêu ca mà chưa xử lý?
        pending_tickets = YeuCau.objects.exclude(trang_thai='DaXuLy').count()

        # 4. Hiệu suất Kinh doanh (Occupancy Rate): Tỉ lệ lấp đầy phòng
        total_apts = CanHo.objects.count()
        occupied_apts = CanHo.objects.exclude(trang_thai='Trong').count() # Khác 'Trống' tức là đang ở
        
        # Tránh lỗi chia cho 0 nếu chưa tạo căn hộ nào
        occupancy_rate = (occupied_apts / total_apts * 100) if total_apts > 0 else 0

        return Response({
            "unpaid_invoices_count": unpaid_invoices,
            "total_unpaid_amount": total_unpaid, # Số tiền "nợ xấu" cần thu hồi
            "pending_tickets": pending_tickets,  # KPI của bộ phận kỹ thuật
            "occupancy_rate": round(occupancy_rate, 2), # Chỉ số quan trọng của Bất động sản
            "total_apartments": total_apts
        })

# --- 2. VIEW CHO CƯ DÂN (RESIDENT DASHBOARD) ---
class DashboardResidentView(APIView):
    """
    Mục đích: Khi cư dân mở App, họ cần thấy ngay những gì liên quan tới họ (Nợ cước, Phản hồi từ BQL).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        cu_dan = user.cu_dan # Lấy hồ sơ cư dân từ user đang login
        
        data = {
            "unpaid_invoices": [],
            "my_tickets_status": []
        }

        # Nếu user này là Admin hoặc chưa được gán hồ sơ Cư dân -> Trả về rỗng
        if not cu_dan:
            return Response(data)

        # 1. Tìm Hóa đơn chưa thanh toán
        # Logic: Tìm hóa đơn của Căn hộ mà cư dân này đang ở (can_ho_dang_o)
        if cu_dan.can_ho_dang_o:
            invoices = HoaDon.objects.filter(can_ho=cu_dan.can_ho_dang_o, trang_thai=0)
            # List Comprehension: Chuyển object thành list dict gọn nhẹ
            data["unpaid_invoices"] = [
                {
                    "thang": i.thang, 
                    "nam": i.nam, 
                    "tong_tien": i.tong_tien,
                    "ma_hoa_don": i.ma_hoa_don
                } 
                for i in invoices
            ]
        
        # 2. Thống kê Yêu cầu của tôi
        # values('trang_thai').annotate(count=...): SQL Group By.
        # Ví dụ kết quả: [{'trang_thai': 'ChoXuLy', 'count': 2}, {'trang_thai': 'DaXuLy', 'count': 5}]
        tickets = YeuCau.objects.filter(cu_dan=cu_dan).values('trang_thai').annotate(count=Count('trang_thai'))
        data["my_tickets_status"] = tickets

        return Response(data)

# --- 3. CÁC TÍNH NĂNG MỞ RỘNG (Stub/Simulation) ---
class NotificationSendView(APIView):
    """ API giả lập gửi thông báo """
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request):
        # Check quyền Manager
        if request.user.role not in ['manager', 'admin']:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        # Trong thực tế: Đoạn này sẽ gọi Firebase (FCM) hoặc SMTP Email Server
        # Hiện tại: Chỉ giả vờ trả về thành công
        return Response({"message": f"Đã gửi thông báo..." })

class AuditLogView(APIView):
    """ API xem nhật ký hệ thống """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Chỉ Admin tối cao mới được xem ai đã làm gì
        if request.user.role != 'admin':
            return Response({"error": "Authorized only"}, status=status.HTTP_403_FORBIDDEN)
        
        # Trong thực tế: Bạn cần tạo thêm model AuditLog và query từ đó.
        # Hiện tại: Trả về dữ liệu mẫu (Dummy data)
        return Response([
            {"action": "LOGIN", "user": "admin", "time": "2023-10-20 10:00"},
            {"action": "CREATE_USER", "user": "admin", "time": "2023-10-20 10:05"},
        ])
```

---

### 2. FILE: `urls.py`

**Vai trò:** Định tuyến đơn giản cho các API báo cáo.

Python

```
from django.urls import path
from .views import DashboardManagerView, DashboardResidentView, NotificationSendView, AuditLogView

urlpatterns = [
    # Dashboard cho Quản lý
    path('v1/dashboard/manager', DashboardManagerView.as_view(), name='dashboard_manager'),
    
    # Dashboard cho Cư dân
    path('v1/dashboard/resident', DashboardResidentView.as_view(), name='dashboard_resident'),
    
    # Gửi thông báo
    path('v1/notifications/send', NotificationSendView.as_view(), name='notification_send'),
    
    # Xem log (Admin)
    path('v1/audit-logs/', AuditLogView.as_view(), name='audit_logs'),
]
```

---

### PHÂN TÍCH TỔNG QUAN APP DASHBOARD

#### 1. Tại sao App này quan trọng?

App này giải quyết bài toán **"Hiệu suất"** và **"Trải nghiệm người dùng"**:

- Thay vì Frontend phải gọi 3 API: `GET /invoices/`, `GET /tickets/`, `GET /apartments/` rồi tự cộng trừ nhân chia (vừa chậm vừa lộ logic), Backend làm hết việc nặng nhọc đó và trả về 1 cục JSON gọn nhẹ.
    
- Nó giúp tách biệt luồng dữ liệu của Manager và Resident rất rõ ràng.
    

#### 2. Kỹ thuật đáng chú ý

- **Database Aggregation (`Sum`, `Count`):** Trong `DashboardManagerView`, bạn dùng hàm của SQL để tính tổng tiền nợ.
    
    - _Tốt:_ Hiệu năng cao.
        
    - _Tránh:_ Dùng Python `sum()` (ví dụ: `sum([hd.tong_tien for hd in invoices])`) vì nó sẽ lôi hết dữ liệu từ DB ra RAM rồi mới cộng -> Chậm và tốn RAM. Bạn làm đúng cách rồi!
        
- **Permissions Layer:** Bạn kiểm tra `role` thủ công (`if request.user.role not in ...`) bên trong hàm `get`.
    
    - _Góp ý:_ Có thể viết một Class Permission riêng (như `IsManager`) để tái sử dụng, code sẽ đẹp hơn là if/else trong view.
        

#### 3. Các điểm cần hoàn thiện (Future Improvements)

- **AuditLog:** Hiện tại đang hardcode dummy data. Để hoàn thiện, bạn nên dùng middleware hoặc thư viện `django-simple-history` để tự động ghi lại mọi thao tác Create/Update/Delete của user vào DB.
    
- **Notifications:** Tích hợp **Firebase Cloud Messaging (FCM)** nếu làm Mobile App, hoặc gửi Email qua SMTP. Cần xử lý bất đồng bộ (Background Task) bằng Celery vì gửi 1000 email sẽ rất lâu.
    
- **Caching:** Dashboard Manager tính toán khá nhiều (đếm toàn bộ DB). Nếu dữ liệu lớn, nên cache lại kết quả này trong 5-10 phút (dùng Redis).