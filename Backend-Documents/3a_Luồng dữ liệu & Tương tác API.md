**Nguyên lý chung:** Client (Web/App) <-> Django API <-> ORM (Models) <-> PostgreSQL (Neon).
### Tổng quan luồng dữ liệu của một API (Ví dụ: Xem hóa đơn)

1. **Request:** Cư dân (User ID: 5) gửi `GET /api/finance/bills/`.
    
2. **Middleware:** Django kiểm tra Token. Xác định User ID = 5.
    
3. **View (Controller):**
    
    - Từ User ID 5 -> Query bảng `Users` -> Lấy `cu_dan_id` (Ví dụ: 10).
        
    - Từ `cu_dan_id` = 10 -> Query bảng `CuDan` -> Lấy `MaCanHoDangO` (Ví dụ: ID 101).
        
    - Query bảng `HoaDon` với điều kiện `MaCanHo = 101`.
        
4. **Database:** Trả về danh sách các row thỏa mãn.
    
5. **Serializer:** Chuyển dữ liệu từ Python Object sang JSON.
    
6. **Response:** Trả về JSON cho Client hiển thị.