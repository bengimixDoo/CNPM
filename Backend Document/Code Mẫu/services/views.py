from rest_framework import viewsets, permissions
from .models import PhuongTien, YeuCau, TinTuc
from .serializers import PhuongTienSerializer, YeuCauSerializer, TinTucSerializer
from core.permissions import IsManager, IsResidentOwner

class PhuongTienViewSet(viewsets.ModelViewSet):
    queryset = PhuongTien.objects.all()
    serializer_class = PhuongTienSerializer
    permission_classes = [permissions.IsAuthenticated]

class YeuCauViewSet(viewsets.ModelViewSet):
    queryset = YeuCau.objects.all()
    serializer_class = YeuCauSerializer
    
    def get_queryset(self):
        # Cư dân chỉ thấy yêu cầu của mình
        user = self.request.user
        if user.role == 'CU_DAN' and user.cu_dan_id:
            return YeuCau.objects.filter(cu_dan_id=user.cu_dan_id)
        return YeuCau.objects.all() # Manager thấy hết

    def perform_create(self, serializer):
        # Tự động gán người gửi là cư dân đang login (nếu có profile cư dân)
        if self.request.user.cu_dan_id:
            # Import model CuDan ở đây để tránh lỗi circular nếu cần, hoặc query trực tiếp
            from residents.models import CuDan
            cu_dan = CuDan.objects.get(id=self.request.user.cu_dan_id)
            serializer.save(cu_dan=cu_dan)
        else:
            # Handle trường hợp admin tạo hộ
            serializer.save()

class TinTucViewSet(viewsets.ModelViewSet):
    queryset = TinTuc.objects.all()
    serializer_class = TinTucSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsManager()] # Chỉ Manager được đăng bài
        return [permissions.AllowAny()] # Ai cũng xem được

    def perform_create(self, serializer):
        serializer.save(nguoi_dang=self.request.user)