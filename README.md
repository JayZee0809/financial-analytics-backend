
# 🧾 Financial Analytics Backend System

## 🚀 Overview
Backend system for managing financial records, RBAC, and analytics dashboards.

## Key Features
### Authentication & Security
- JWT auth
- bcrypt hashing
- Rate limiting
- Brute-force protection
- Account locking
- Timing attack mitigation

### RBAC
- Roles: ADMIN, ANALYST, VIEWER
- Middleware authorization

### Role Approval Workflow
- Request elevated roles
- Admin approval/rejection

### Financial Records
- CRUD (soft delete, only admin can access the deleted records)
- Pagination & filtering

### Dashboard
- Income/Expense summary
- Category breakdown

### Architecture
- Controller → Service → Repository
- Centralized error handling
- Async handlers
- Standard response format

### Performance
- Composite indexing
- Optimized aggregation queries
- Soft delete filtering done at query level (role-based)

## Tech Stack
- **Backend** - Node.js, Express
- **Database** - PostgreSQL (Supabase)
- **ORM** - Prisma
- **Validation** - Joi
- **Authentication** - JWT
- **Security** - bcrypt, express-rate-limit

## Auth Flow
1. Register → VIEWER
2. Request role → PENDING
3. Admin approves
4. Login → JWT

## DB Design
- Soft delete (isDeleted)
- Composite indexes

## Tradeoffs
- No refresh tokens
- No Redis
- Simpler workflow model
- If the proportion of soft-deleted records grows significantly, moving isDeleted before range columns or using a partial index would improve performance
- For complex performance tuning and queries vanilla sql using pg is more suitable

## Future Improvements
- Refresh tokens
- Audit logs
- Notifications
- caching/async processing/pre-aggregations (very useful in dashboard if DB gets large)
- Catagories can be tag based, each record can belong to multiple catagories, catagories shall of key-value pair type
- whitelisting in helmet, proper access-control
- In a production setup with huge and complex database, a combination of ORM and vanilla sql can be used if required

## Run
```bash
npm install
npx prisma migrate dev
npm run dev
npm run seed
```
(after this we get the initial admin account with creds: admin@test.com / Admin@123, use this for testing purposes)

## API

### Auth

**POST** `/auth/register`

#### Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "ANALYST"
}
```
#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "VIEWER",
    "requestedRole": "ANALYST",
    "roleRequestStatus": "PENDING"
  }
}
```

**POST** `/auth/login`

#### Request
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

### Role Management (ADMIN Only)

### Get Pending Role Requests

**GET** `/users/role-requests`

**Headers**
```txt
Authorization: Bearer ADMIN_TOKEN
```

#### Response
```json
</> JSON

{
  "success": true,
  "message": "Pending requests fetched",
  "data": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "requestedRole": "ANALYST"
    }
  ]
}
```

### Approve Role Request

**PATCH** `/users/:id/approve-role`

#### Response
```json
{
  "success": true,
  "message": "Role approved successfully"
}
```

### Reject Role Request

**PATCH** `/users/:id/reject-role`

#### Response
```json
{
  "success": true,
  "message": "Role request rejected"
}
```

### Financial Records

**Access Rules**
```txt
ADMIN
- Full access (create, update, delete, view)
- Can view all records, including soft-deleted records

ANALYST
- Read-only access
- Can view only active records (isDeleted = false)

VIEWER
- No access to financial records
```

#### Create Record (Admin Only)

**POST** `/financials`

#### Request
```json
{
  "amount": 5000,
  "type": "EXPENSE",
  "category": "Food",
  "date": "2024-01-10",
  "notes": "Dinner"
}
```

#### Response
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "id": "uuid",
    "amount": 5000,
    "type": "EXPENSE",
    "category": "Food"
  }
}
```

#### Get Records (Admin & Analyst)

**GET** `/financials`

**Query Params**

```txt
?page=1&limit=10&type=EXPENSE&category=Food&from=2024-01-01&to=2024-12-31
```

**Behavior**

- ADMIN → receives all records (including soft-deleted)
- ANALYST → receives only non-deleted records

#### Response
```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [
    {
      "id": "uuid",
      "amount": 5000,
      "type": "EXPENSE",
      "category": "Food",
      "date": "2024-01-10"
    }
  ]
}
```

#### Update Record (Admin Only)

**PATCH** `/financials/:id`

#### Request
```json
{
  "amount": 6000,
  "notes": "Updated dinner"
}
```

#### Response
```json
{
  "success": true,
  "message": "Record updated successfully"
}
```

#### Delete Record (Admin Only - Soft Delete)

**DELETE** `/financials/:id`

**Behavior**
- Performs soft delete (isDeleted = true)
- Record is not permanently removed

#### Response
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```
#### Get Categories

**GET** `/financials/categories (Admin Only, for assistance in creating records efficiently)`

#### Response
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": ["Food", "Travel", "Salary"]
}
```

### Dashboard

#### Access
* **ADMIN** → Full access (includes soft-deleted data if applicable)
* **ANALYST** → Access to active data only

#### Get Summary

**GET** `/dashboard/summary`

#### Query Params
```txt
?from=2024-01-01&to=2024-12-31
```

#### Response
```json
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": {
    "totalIncome": 10000,
    "totalExpense": 5000,
    "categorySummary": [
      {
        "category": "Food",
        "income": 2000,
        "expense": 3000
      }
    ]
  }
}
```

## Error Responses

### 🔴 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input data"
}
```

### 🔴 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 🔴 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 🔴 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```
## 🧠 Notes

* All protected routes require:
```txt
Authorization: Bearer <TOKEN>
```

* Default pagination:
```txt
page = 1
limit = 10
```

* Soft delete is implemented using:
```txt
isDeleted = true
```

#### Designed with scalability, security, and maintainability in mind.
