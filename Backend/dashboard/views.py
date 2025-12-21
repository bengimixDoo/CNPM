from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Sum, Count
from finance.models import HoaDon
from services.models import YeuCau
from residents.models import CanHo

class DashboardManagerView(APIView):
    """
    Endpoint: GET /api/v1/dashboard/manager
    Thống kê (số hoá đơn chưa thu, yêu cầu đang xử lý, occupancy rate).
    """
    permission_classes = [permissions.IsAuthenticated] # Cần check Role Manager

    def get(self, request):
        if request.user.role not in ['manager', 'admin']:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        # 1. Hóa đơn chưa thu
        unpaid_invoices = HoaDon.objects.filter(trang_thai=0).count()
        total_unpaid = HoaDon.objects.filter(trang_thai=0).aggregate(Sum('tong_tien'))['tong_tien__sum'] or 0

        # 2. Yêu cầu đang xử lý
        pending_tickets = YeuCau.objects.exclude(trang_thai='DaXuLy').count()

        # 3. Occupancy Rate (Tỉ lệ lấp đầy)
        total_apts = CanHo.objects.count()
        occupied_apts = CanHo.objects.exclude(trang_thai='Trong').count()
        occupancy_rate = (occupied_apts / total_apts * 100) if total_apts > 0 else 0

        return Response({
            "unpaid_invoices_count": unpaid_invoices,
            "total_unpaid_amount": total_unpaid,
            "pending_tickets": pending_tickets,
            "occupancy_rate": round(occupancy_rate, 2),
            "total_apartments": total_apts
        })

class DashboardResidentView(APIView):
    """
    Endpoint: GET /api/v1/dashboard/resident
    Hoá đơn chưa thanh toán, yêu cầu của tôi.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        cu_dan = user.cu_dan
        
        data = {
            "unpaid_invoices": [],
            "my_tickets_status": []
        }

        if not cu_dan:
            return Response(data) # Chưa link cư dân thì không có data

        # 1. Hóa đơn chưa thanh toán của căn hộ đang ở
        if cu_dan.can_ho_dang_o:
            invoices = HoaDon.objects.filter(can_ho=cu_dan.can_ho_dang_o, trang_thai=0)
            data["unpaid_invoices"] = [
                {
                    "thang": i.thang, 
                    "nam": i.nam, 
                    "tong_tien": i.tong_tien,
                    "ma_hoa_don": i.ma_hoa_don
                } 
                for i in invoices
            ]
        
        # 2. Yêu cầu của tôi
        tickets = YeuCau.objects.filter(cu_dan=cu_dan).values('trang_thai').annotate(count=Count('trang_thai'))
        data["my_tickets_status"] = tickets

        return Response(data)

class NotificationSendView(APIView):
    """
    Endpoint: POST /api/v1/notifications/send
    Gửi email/push (Simulated).
    """
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request):
        if request.user.role not in ['manager', 'admin']:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        title = request.data.get('title')
        message = request.data.get('message')
        # target_users = ... logic filter user
        
        # Simulate sending
        return Response({"message": f"Đã gửi thông báo '{title}' đến toàn bộ cư dân (Simulated)." })

class AuditLogView(APIView):
    """
    Endpoint: GET /api/v1/audit-logs/
    Lịch sử tác động (ADMIN).
    Tạm thời trả về dummy or empty list nếu chưa implement AuditLog Model middleware.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Authorized only"}, status=status.HTTP_403_FORBIDDEN)
        
        return Response([
            {"action": "LOGIN", "user": "admin", "time": "2023-10-20 10:00"},
            {"action": "CREATE_USER", "user": "admin", "time": "2023-10-20 10:05"},
        ])
