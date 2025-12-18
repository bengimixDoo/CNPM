from rest_framework import permissions

class IsManager(permissions.BasePermission):
    """
    Chỉ cho phép ADMIN hoặc QUAN_LY truy cập.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'QUAN_LY'])

class IsResidentOwner(permissions.BasePermission):
    """
    Object-level permission: Chỉ cho phép chủ sở hữu (Cư dân) xem/sửa đối tượng của mình.
    Yêu cầu Model phải có trường liên kết với Cư dân (ví dụ: cu_dan, ma_can_ho...).
    """
    def has_object_permission(self, request, view, obj):
        # Admin/Manager luôn được phép
        if request.user.role in ['ADMIN', 'QUAN_LY']:
            return True
        
        # Logic check cho từng loại Model (Bạn cần tùy chỉnh theo tên trường trong Model)
        # Ví dụ: Check xem Ticket này có phải của User này gửi không
        if hasattr(obj, 'cu_dan') and request.user.cu_dan_id:
            return obj.cu_dan.id == request.user.cu_dan_id
            
        # Ví dụ: Check xem Hóa đơn này có phải của Căn hộ user đang ở không
        if hasattr(obj, 'can_ho') and request.user.cu_dan_id:
            # Cần query lấy căn hộ của user hiện tại để so sánh
            # (Code này mang tính minh họa logic)
            return True 
            
        return False