## 1. Cấu trúc chung của tên branch

`<type>/<scope>/<short-description>`

Hoặc chi tiết hơn:

`<type>/<layer-or-platform>/<domain-or-module>/<feature-name>`

---

## 2. Giải nghĩa từng **prefix** (type)

### 🔹 `chore/`

`chore/be/project-skeleton`

**chore = việc lặt vặt, việc nền tảng**

👉 Dùng khi:

- Setup project
    
- Cấu hình môi trường
    
- Tạo skeleton / boilerplate
    
- Thay đổi CI/CD, Docker, ESLint, Prettier
    
- Không trực tiếp thêm feature cho user
    

📌 **Không ảnh hưởng business logic**

Ví dụ:

- `chore/be/init-django`
    
- `chore/infra/setup-nginx`
    
- `chore/ci/add-github-actions`
    

---

### 🔹 `feat/`

`feat/be/users/auth-api`

**feat = feature (tính năng mới)**

👉 Dùng khi:

- Thêm API mới
    
- Thêm use-case mới
    
- Thêm business logic mới
    

📌 **Có giá trị trực tiếp cho người dùng / hệ thống**

Ví dụ:

- `feat/be/orders/create-order`
    
- `feat/fe/login-page`
    
- `feat/mobile/push-notification`
    

---

## 3. Giải nghĩa từng **scope**

### 🔹 `be`

`feat/be/...`

**be = backend**

Các scope thường gặp:

|Viết tắt|Nghĩa|
|---|---|
|`be`|Backend|
|`fe`|Frontend|
|`mobile`|Mobile|
|`infra`|Infrastructure|
|`devops`|CI/CD, deployment|
|`ai`|AI / ML|
|`data`|Data / ETL|

📌 Việc tách `be` / `fe` giúp:

- Mono-repo dễ quản lý
    
- CI/CD trigger chính xác
    
- Reviewer biết context ngay
    

---

## 4. Phân tích từng branch bạn đưa

---

### ✅ `chore/be/project-skeleton`

👉 Nghĩa:

- Công việc backend
    
- Dựng **khung dự án ban đầu**
    
- Có thể bao gồm:
    
    - Folder structure
        
    - Base settings
        
    - Core dependencies
        
    - README
        
    - `.env.example`
        

📌 Rất chuẩn cho **branch đầu tiên của project**

---

### ✅ `feat/be/users/auth-api`

👉 Tách ra:

|Phần|Nghĩa|
|---|---|
|`users`|Domain (bounded context)|
|`auth-api`|Tính năng: API xác thực|

👉 Thường bao gồm:

- Login / Register
    
- JWT / OAuth
    
- Refresh token
    
- Permission / Role
    

📌 Đặt **users/auth-api** là cực kỳ clean theo **DDD-lite**

---

### ✅ `feat/be/residents/master-data`

👉 Nghĩa:

- Domain: `residents` (cư dân)
    
- Feature: `master-data`
    

**Master Data** = dữ liệu nền tảng, ít thay đổi:

Ví dụ:

- Loại cư dân
    
- Trạng thái cư trú
    
- Quan hệ hộ gia đình
    
- Danh mục chuẩn
    

📌 Chuẩn kiểu **enterprise / government / real-estate systems**

---

### ✅ `feat/be/finance/billing-engine`

👉 Đây là **branch rất “đắt tiền” 💰**

|Thành phần|Nghĩa|
|---|---|
|`finance`|Domain tài chính|
|`billing-engine`|Lõi tính tiền|

👉 Thường bao gồm:

- Rule tính phí
    
- Công thức
    
- Chu kỳ hóa đơn
    
- Snapshot giá
    
- Penalty / discount
    
- Versioning công thức
    

📌 Từ **engine** cho thấy:

- Không phải CRUD thường
    
- Có logic phức tạp
    
- Có thể tái sử dụng
    

---

### ✅ `feat/be/services/interactions`

👉 Domain: `services`  
👉 Feature: `interactions`

**Interactions** thường ám chỉ:

- Cư dân ↔ dịch vụ
    
- Request / ticket / feedback
    
- Lịch sử tương tác
    
- Workflow trạng thái
    

📌 Tên này mở rộng tốt, không bó hẹp use-case

---

## 5. Vì sao cách đặt này được dùng trong công ty lớn?

### 🎯 1. Đọc branch là hiểu ngay **business**

Không cần mở code.

---

### 🎯 2. Tối ưu code review & CI/CD

- Auto assign reviewer theo scope
    
- Pipeline chạy đúng phần
    

---

### 🎯 3. Chuẩn cho:

- Monorepo
    
- Microservice
    
- DDD
    
- Agile / Scrum
    

---

## 6. So với cách “không chuyên nghiệp”

❌ Sai:

`fix1 test-api new-feature backend123`

❌ Không biết:

- Làm gì?
    
- Ảnh hưởng phần nào?
    
- Có phải feature thật không?
    

---

## 7. Gợi ý bộ chuẩn bạn có thể áp dụng luôn

`feat/be/<domain>/<feature> fix/be/<domain>/<bug> chore/be/<task> refactor/be/<domain>/<reason> test/be/<domain>/<what> docs/<scope>/<topic>`