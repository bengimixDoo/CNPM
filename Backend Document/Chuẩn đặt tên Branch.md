## 1. Chuẩn đặt tên **branch** (áp dụng luôn)

### 📌 Format chính thức

`<type>/<layer>/<domain>/<feature>`

---

## 2. Danh sách **type** (bắt buộc nhớ)

|Type|Khi dùng|
|---|---|
|`feat`|Thêm tính năng mới|
|`fix`|Sửa bug|
|`chore`|Setup, config, việc nền|
|`refactor`|Cải tổ code, không đổi hành vi|
|`test`|Test, coverage|
|`docs`|Tài liệu|
|`perf`|Tối ưu hiệu năng|

---

## 3. **Layer / Platform**

|Layer|Nghĩa|
|---|---|
|`be`|Backend|
|`fe`|Frontend|
|`mobile`|Mobile|
|`infra`|Hạ tầng|
|`ai`|AI / ML|
|`data`|ETL / Data|

---

## 4. **Domain** (rất quan trọng – business-driven)

Ví dụ hệ thống cư dân – tài chính – dịch vụ:

`users residents finance services assets parking notifications reports`

📌 **Domain ≠ bảng DB**, mà là **ngữ cảnh nghiệp vụ**.

---

## 5. **Feature** (ngắn – đúng – không mơ hồ)

|Tốt|Không tốt|
|---|---|
|`auth-api`|`auth`|
|`billing-engine`|`billing`|
|`invoice-snapshot`|`invoice2`|
|`price-rule`|`logic`|

---

## 6. Ví dụ chuẩn hoàn chỉnh (copy dùng luôn)

`chore/be/project-skeleton feat/be/users/auth-api feat/be/residents/master-data feat/be/finance/billing-engine feat/be/services/interactions  fix/be/finance/billing-rounding-error refactor/be/users/auth-token-flow test/be/finance/billing-engine docs/be/finance/billing-design`

---

## 7. Chuẩn **commit message** đi kèm (rất hay bị làm sai)

`feat(users): add JWT auth API fix(finance): correct billing rounding chore(be): initialize project skeleton refactor(auth): simplify token refresh flow`

📌 Chuẩn này:

- Sinh changelog tự động
    
- Dùng được với semantic release
    
- Reviewer đọc là hiểu ngay
    

---

## 8. Luồng làm việc chuẩn (team chuyên nghiệp)

`main (protected) └── develop     ├── feat/be/finance/billing-engine     ├── feat/be/users/auth-api     └── fix/be/services/request-status`

- ❌ Không commit thẳng vào `main`
    
- ✔️ Mỗi feature = 1 branch
    
- ✔️ Merge qua PR/MR
    

---

## 9. Một câu chốt để bạn nhớ lâu

> **Branch name = tài liệu sống của hệ thống**

Người giỏi nhìn tên branch là đoán được:

- Kiến trúc
    
- Domain
    
- Độ phức tạp
    
- Mức độ rủi ro khi merge