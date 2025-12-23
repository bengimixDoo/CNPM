from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Quyền cao nhất: Chỉ dành cho Admin hoặc Superuser.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                    (request.user.role == 'ADMIN' or request.user.is_superuser))

class IsManager(permissions.BasePermission):
    """
    Quyền Quản lý: Dành cho Admin và Quản lý.
    (Admin mặc định có quyền của Quản lý)
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                    (request.user.role in ['ADMIN', 'QUAN_LY'] or request.user.is_superuser))

class IsAccountant(permissions.BasePermission):
    """
    Quyền Kế toán: Dành cho Kế toán, nhưng Quản lý và Admin cũng được phép truy cập.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                    (request.user.role in ['KE_TOAN', 'QUAN_LY', 'ADMIN'] or request.user.is_superuser))

class IsResident(permissions.BasePermission):
    """
    Quyền Cư dân: Chỉ kiểm tra xem user có phải là Cư dân không.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                    request.user.role == 'CU_DAN')

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Quyền sở hữu (Object Level Permission):
    - Admin/Quản lý: Có toàn quyền (Sửa/Xóa bất kỳ ai).
    - Cư dân: Chỉ được thao tác trên dữ liệu CỦA CHÍNH MÌNH.

    """
    def has_object_permission(self, request, view, obj):
        # 1. Admin và Quản lý luôn được phép
        if request.user.role in ['ADMIN', 'QUAN_LY'] or request.user.is_superuser:
            return True

        # 2. Các method an toàn (GET, HEAD, OPTIONS) -> Ai cũng xem được (tùy logic bạn)
        # Nếu bạn muốn Cư dân KHÁC không được xem của nhau, hãy xóa 2 dòng dưới này.
        #if request.method in permissions.SAFE_METHODS:
        #    return True

        # 3. Kiểm tra xem user đang request có phải là chủ sở hữu object đó không
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'chu_so_huu'):
            return obj.chu_so_huu == request.user

        return False