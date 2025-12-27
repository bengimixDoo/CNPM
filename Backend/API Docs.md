# API Documentation

**Base URL**: `/api/v1/`

## 1. Authentication & Users
**Base Path**: `/users`

| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/auth/token/` | `POST` | Login. Returns Access & Refresh tokens. | All |
| `/auth/token/refresh/` | `POST` | Refresh Access Token. | All |
| `/auth/logout/` | `POST` | Logout (Blacklist Token). | All |
| `/users/` | `GET` | List all users. | Admin, Manager |
| `/users/` | `POST` | Create a new user (Manager account). | Admin |
| `/users/me/` | `GET` | Get current user profile. | All |
| `/users/{id}/` | `GET` | Get user details. | Admin, Manager, Owner |
| `/users/{id}/` | `PUT/PATCH` | Update user details. | Admin, Manager, Owner |
| `/users/{id}/change_password/` | `POST` | Change password. | Owner |
| `/users/{id}/link_resident/` | `POST` | Link a User account to a Resident (CuDan) profile. | Manager, Admin |

## 2. Residents Management
**Base Path**: `/residents` & `/apartments`

### Apartments (Căn Hộ)
| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/apartments/` | `GET` | List apartments. | All (Filtered) |
| `/apartments/` | `POST` | Create a new apartment. | Manager, Admin |
| `/apartments/{id}/` | `GET` | Get apartment details. | All |
| `/apartments/{id}/` | `PUT/PATCH` | Update apartment info. | Manager, Admin |
| `/apartments/{id}/` | `DELETE` | Delete apartment. | Admin |
| `/apartments/{id}/log/` | `GET` | View modification history of an apartment. | Manager, Admin |

### Residents (Cư Dân)
| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/residents/` | `GET` | List residents. | All (Filtered) |
| `/residents/` | `POST` | Create a new resident profile. | Manager, Admin |
| `/residents/{id}/` | `GET` | Get resident details. | All |
| `/residents/{id}/` | `PUT/PATCH` | Update resident info. | Manager, Admin |
| `/residents/{id}/` | `DELETE` | Delete resident. | Admin |
| `/residents/{id}/log/` | `GET` | View modification history of a resident. | Manager, Admin |

### History (Biến Động Dân Cư)
| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/history/` | `GET` | List population changes (Temporary Residence, Absence, Transfer). | Manager, Admin |
| `/history/{id}/` | `POST` | Create a record of population change. | Manager, Admin |
| `/history/{id}/log/` | `GET` | View detailed log of a specific change. | Manager, Admin |

## 3. Finance
**Base Path**: `/finance`

| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/finance/fees/` | `GET` | List Fee Categories (Bảng giá các loại phí). | All |
| `/finance/fees/` | `POST` | Create new Fee Category. | Accountant, Manager |
| `/finance/readings/` | `GET` | List Utility Readings (Chỉ số điện nước). | All (Filtered) |
| `/finance/readings/` | `POST` | Record utility reading. | Accountant |
| `/finance/invoices/` | `GET` | List Invoices. | All (Filtered) |
| `/finance/invoices/` | `POST` | Create/Generate Invoice. | Accountant |
| `/finance/revenue-stats/` | `GET` | View Revenue Statistics. | Manager, Accountant |
| `/finance/fundraising-drives/`| `GET/POST`| Manage Fundraising Drives (Đợt vận động). | Manager, Accountant |
| `/finance/donations/` | `GET/POST` | Manage Donations (Đóng góp của cư dân). | Manager, Accountant (View/Edit), Resident (View own) |

## 4. Services
**Base Path**: `/services`

| Endpoint | Method | Description | Roles |
| :--- | :--- | :--- | :--- |
| `/services/vehicles/` | `GET` | List Vehicles. | All (Filtered) |
| `/services/vehicles/` | `POST` | Register a new vehicle. | Manager |
| `/services/vehicles/{id}/` | `DELETE` | Remove a vehicle. | Manager |
| `/services/news/` | `GET` | List News/Announcements. | All |
| `/services/news/` | `POST` | Publish News. | Manager, Accountant |
| `/services/support-tickets/` | `GET` | List Support Tickets (Phản ánh). | All (Filtered) |
| `/services/support-tickets/` | `POST` | Submit a Support Ticket. | Resident |
| `/services/support-tickets/{id}/`| `PATCH` | Update ticket status (Respond/Process). | Manager |
| `/services/pricing/` | `GET/POST` | Manage Service Pricing (Bảng giá dịch vụ). | Manager |
| `/services/utilities/` | `GET/POST` | Manage Utility Readings (Accessible via Services as well). | Accountant |

---
**Note**: Most endpoints support standard `GET`, `POST`, `PUT`, `PATCH`, `DELETE` methods consistent with RESTful standards unless otherwise noted.
