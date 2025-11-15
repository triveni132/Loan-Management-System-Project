# 🏦 Loan Origination & Approval System — Backend

## 📘 Overview

This backend powers the **Loan Origination & Approval System**, built using **Node.js (Express)**, **MongoDB (Mongoose)**, and **JWT Authentication**.

It allows:

- 🧍 Customers to register, apply for loans, and track application status.
- 🧑‍💼 Loan Officers to review, approve, or reject loan applications.
- 🔒 Secure JWT-based authentication and role-based access control.
- 🧮 Automatic loan eligibility scoring using income and credit score.

---

## ⚙️ Tech Stack

| Component              | Technology            |
| ---------------------- | --------------------- |
| Backend                | Node.js, Express.js   |
| Database               | MongoDB + Mongoose    |
| Authentication         | JWT (JSON Web Tokens) |
| Password Security      | bcrypt.js             |
| Environment Management | dotenv                |

---

## 📂 Folder Structure

```
backend/
│
├── controllers/
│   ├── auth.controller.js
│   ├── loan.controller.js
│   └── officer.controller.js
│
├── routes/
│   ├── auth.router.js
│   ├── loan.router.js
│   └── officer.router.js
│
├── middleware/
│   └── authMiddleware.js
│
├── services/
│   └── loanService.js
│
├── models/
│   ├── User.js
│   ├── Customer.js
│   ├── LoanOfficer.js
│   └── LoanApplication.js
│
├── utils/
│   └── jwt.js
│
├── .env
├── server.js
└── README.md
```

---

## ⚡ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone {Repo Link...}
cd backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/loan-system
JWT_SECRET=supersecretkey
```

### 4️⃣ Start MongoDB

Ensure MongoDB is running locally or use an online cluster (like MongoDB Atlas).

### 5️⃣ Run the Server

```bash
npm start
```

Server will run at:
👉 http://localhost:5000

---

## 🔐 Authentication Module

### 📍 Register User

**POST** `/auth/register`

```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "P@ssw0rd",
  "role": "CUSTOMER"
}
```

#### ✅ Response

```json
{
  "message": "User registered successfully",
  "userId": "6741396b9c61f6b33b2f0201"
}
```

### 📍 Login

**POST** `/auth/login`

```json
{
  "email": "ravi@example.com",
  "password": "P@ssw0rd"
}
```

#### ✅ Response

```json
{
  "token": "<jwt_token>",
  "userId": "6741396b9c61f6b33b2f0201",
  "role": "CUSTOMER"
}
```

Use this token in headers for all protected routes:

```
Authorization: Bearer <jwt_token>
```

---

## 💳 Loan Module

### 📍 Apply for Loan

**POST** `/loans/apply`  
(Requires CUSTOMER role)

```json
{
  "customerId": "6741396b9c61f6b33b2f0201",
  "amountRequested": 500000,
  "tenureMonths": 24
}
```

#### ✅ Response

```json
{
  "loanId": "67414f6eb68d4d2f3dff2c90",
  "message": "Loan application submitted."
}
```

### 📍 Check Loan Status

**GET** `/loans/:id/status`

#### ✅ Response

```json
{
  "status": "APPROVED",
  "eligibilityScore": 0.82
}
```

---

## 🧠 Loan Evaluation Logic

Implemented inside `/services/loanService.js`:

### Formula:

```
score = (0.6 * creditScoreNorm) + (0.4 * incomeNorm)
```

- If score ≥ 0.5 → **APPROVED**
- Else → **REJECTED**

---

## 🧑‍💼 Officer Module

### 📍 Get All Pending Loans

**GET** `/officer/loans/pending`  
(Requires OFFICER role)

#### ✅ Response

```json
[
  {
    "_id": "67418b8c4e3b124b2b903c4e",
    "amountRequested": 500000,
    "status": "PENDING",
    "customerId": {
      "income": 65000,
      "creditScore": 750,
      "userId": { "name": "Ravi Kumar", "email": "ravi@example.com" }
    }
  }
]
```

### 📍 Review Loan

**POST** `/officer/loans/:id/review`  
(Requires OFFICER role)

```json
{ "action": "APPROVE" }
```

#### ✅ Response

```json
{
  "message": "Loan approved successfully.",
  "loanId": "67418b8c4e3b124b2b903c4e",
  "status": "APPROVED"
}
```

---

## 🛡️ Role-Based Access

- **CUSTOMER**: Can register, apply, and view loan status
- **OFFICER**: Can review and approve/reject loans

Access controlled via middleware:

```javascript
authenticateUser, authorizeRoles("OFFICER");
```

---

## 🧠 Future Enhancements

- Add Admin role for system-wide reports
- Integrate email notifications on loan status changes
- Add frontend (React) dashboard for customers & officers
- Add pagination and filtering for officer loan list

---

## 📸 Example API Flow

1. **Register** → `/auth/register`
2. **Login** → `/auth/login` → Get token
3. **Apply for Loan** → `/loans/apply`
4. **Officer views pending** → `/officer/loans/pending`
5. **Officer approves** → `/officer/loans/:id/review`
6. **Customer checks status** → `/loans/:id/status`

---

## 🧾 License

This project is for educational and assessment purposes (NodeJS TA Assignment).
