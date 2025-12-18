# I. Map **Domain → Django App / Spring Module**

## 1. Tư duy cốt lõi (rất quan trọng)

> **Domain ≠ Database ≠ API**
> 
> Domain = _ngữ cảnh nghiệp vụ_ (Bounded Context – DDD-lite)

➡️ Mỗi **domain**:

- Là **1 Django app**
    
- Hoặc **1 Spring module**
    

---

## 2. Bảng map Domain chuẩn

|Domain|Django app|Spring module|Ý nghĩa|
|---|---|---|---|
|`users`|`apps/users`|`users-service`|Auth, account, role|
|`residents`|`apps/residents`|`residents-service`|Cư dân, hộ|
|`finance`|`apps/finance`|`finance-service`|Billing, invoice|
|`services`|`apps/services`|`services-service`|Yêu cầu, tương tác|
|`assets`|`apps/assets`|`assets-service`|Tài sản|
|`parking`|`apps/parking`|`parking-service`|Gửi xe|
|`notifications`|`apps/notifications`|`notifications-service`|Email, push|

---

## 3. Ví dụ cụ thể: `finance/billing-engine`

### Django

`apps/ └── finance/     ├── domain/     │   ├── billing_engine.py     │   ├── pricing_rules.py     │   └── calculators/     ├── models/     │   ├── invoice.py     │   ├── invoice_item.py     │   └── price_snapshot.py     ├── api/     │   ├── views.py     │   ├── serializers.py     │   └── urls.py     └── services/         └── billing_service.py`

### Spring

`finance/ ├── domain/ │   ├── BillingEngine.java │   ├── PricingRule.java ├── entity/ │   ├── Invoice.java │   └── InvoiceItem.java ├── service/ │   └── BillingService.java ├── controller/ │   └── BillingController.java`

📌 **Engine nằm trong domain, không nằm trong controller**

---

# II. Thiết kế **Monorepo Structure (Chuẩn công ty)**

## 1. Cấu trúc tổng thể

`repo-root/ ├── backend/ │   ├── django/ │   │   ├── apps/ │   │   ├── config/ │   │   └── manage.py │   └── spring/ │       ├── users/ │       ├── finance/ │       └── services/ ├── frontend/ │   ├── web/ │   └── admin/ ├── infra/ │   ├── docker/ │   ├── k8s/ │   └── nginx/ ├── docs/ │   ├── architecture/ │   ├── domain/ │   └── api/ └── CONTRIBUTING.md`

![https://i0.wp.com/christianlydemann.com/wp-content/uploads/2019/04/Monorepo-architecture-2.png?fit=1200%2C604&ssl=1&utm_source=chatgpt.com](https://i0.wp.com/christianlydemann.com/wp-content/uploads/2019/04/Monorepo-architecture-2.png?fit=1200%2C604&ssl=1&utm_source=chatgpt.com)

![https://media2.dev.to/dynamic/image/width%3D800%2Cheight%3D%2Cfit%3Dscale-down%2Cgravity%3Dauto%2Cformat%3Dauto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxk2jena16ml54on55r0l.png?utm_source=chatgpt.com](https://media2.dev.to/dynamic/image/width%3D800%2Cheight%3D%2Cfit%3Dscale-down%2Cgravity%3Dauto%2Cformat%3Dauto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxk2jena16ml54on55r0l.png?utm_source=chatgpt.com)

![https://images.sitepen.com/wp-images/2022/08/diagram-2.png?utm_source=chatgpt.com](https://images.sitepen.com/wp-images/2022/08/diagram-2.png?utm_source=chatgpt.com)

---

## 2. Map branch → thư mục

|Branch|Thư mục|
|---|---|
|`chore/be/project-skeleton`|`backend/django + infra`|
|`feat/be/users/auth-api`|`apps/users`|
|`feat/be/finance/billing-engine`|`apps/finance/domain`|
|`feat/be/services/interactions`|`apps/services`|

📌 CI có thể chạy **chỉ phần bị ảnh hưởng**

---

# III. `CONTRIBUTING.md` (bản công ty thật)

## 1. Chuẩn branch naming

`## Branch Naming Convention  <type>/<layer>/<domain>/<feature>  Examples: - feat/be/finance/billing-engine - fix/be/users/token-expiry - chore/infra/docker-setup`

---

## 2. Git Workflow

`## Git Workflow  - main: production (protected) - develop: integration - feature branches: one feature per branch  Flow: 1. Create branch from develop 2. Commit with conventional commits 3. Open PR → develop 4. Require:   - CI passed   - Code review approved`

---

## 3. Commit message chuẩn

`## Commit Message Convention  <type>(<scope>): <message>  Examples: - feat(users): implement auth API - fix(finance): correct billing rounding - chore(be): init project skeleton`

---

## 4. Quy tắc code review

`## Code Review Rules  - No direct push to main - Domain logic must not be in controller - No business logic in serializer - Tests required for billing & finance`

---

# IV. Cách này “ăn tiền” ở đâu?

✔️ Dùng được cho:

- Django monolith → microservice
    
- Spring Boot enterprise
    
- Team 2 người → 50 người  
    ✔️ Dễ scale  
    ✔️ Dễ tuyển dev mới  
    ✔️ Dễ bảo trì 5–10 năm
    

---

# V. Bước tiếp theo (nâng level)

Bạn có thể chọn **1 trong 3**:

1️⃣ Mình **vẽ architecture diagram chuẩn (C4 model)**  
2️⃣ Thiết kế **billing-engine chi tiết (rule, snapshot, versioning)**  
3️⃣ Viết **template Django app / Spring module** dùng cho mọi domain