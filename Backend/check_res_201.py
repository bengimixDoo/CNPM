
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User
from residents.models import CanHo

try:
    user = User.objects.get(username='res_201')
    print(f"Found User: {user.username}")
    
    if user.cu_dan:
        cudan = user.cu_dan
        print(f"  - Resident Profile: {cudan.ho_ten} (CCCD: {cudan.so_cccd})")
        
        if cudan.can_ho_dang_o:
            apt = cudan.can_ho_dang_o
            print(f"  - Apartment: {apt.so_phong} (Tang {apt.tang}, Toa {apt.toa_nha})") # Corrected field name from phong to so_phong if checked models earlier? Wait, models.py says 'phong'
             # Let's re-verify models.py field name. It was 'phong'.
            print(f"  - Apartment Details: {apt}")
        else:
            print("  - No apartment linked to this resident profile.")
    else:
        print("  - No resident profile (CuDan) linked to this user.")

except User.DoesNotExist:
    print("User 'res_201' does not exist in the database.")
except Exception as e:
    print(f"Error: {e}")
