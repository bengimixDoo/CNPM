from rest_framework import permissions

class IsCitizen(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'CU_DAN' or request.user.groups.filter(name='Citizen').exists()
        )

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == 'QUAN_LY' or request.user.groups.filter(name='Manager').exists()
        )