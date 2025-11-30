# 📌 **Employee Attendance Management System**

A full-stack attendance tracking platform built for **Employees** and **Managers**, featuring secure authentication, daily check-in/out, attendance dashboards, reporting, and team analytics.

---

## 🚀 **Tech Stack**

### **Frontend**

* React
* Redux Toolkit / Zustand
* TailwindCSS or CSS

### **Backend**

* Node.js
* Express.js
* JWT Authentication

### **Database**

* MongoDB **or** PostgreSQL

---

## 🧠 **Project Overview**

This system provides two user roles:

### 👨‍💼 **Employee**

* Register / Login
* Mark daily attendance (Check In / Check Out)
* View personal attendance history
* Monthly summaries
* Dashboard with stats

### 👩‍💼 **Manager**

* Login
* View attendance of all employees
* Filter by employee, date, or status
* Team calendar overview
* Export attendance reports (CSV)
* Team dashboard with statistics & charts

---

# 🖼 **Screenshots**

> Replace the placeholders `./screenshots/...` with your actual image paths.

### 🔐 **Auth Screens**

| Login                             | Registration                            |
| --------------------------------- | --------------------------------------- |
| ![Login](Images/Login) | ![Register](Images/Register) |

---

### 🧑‍💼 **Employee Dashboard**

![Employee Dashboard](Images/EmployeeDashboard)

---

### 📆 **Attendance History**

![Attendance History](Images/EmpHistroy)

---

### 🟢 **Check-In / Check-Out Page**

![Mark Attendance](Images/MarkAttandance)

---

### 👨‍💼 Manager Dashboard

![Manager Dashboard](Images/ManagerDash)

---
### 📊 Reports & CSV Export

![Reports](Images/EmpFilter)
![Reports](Images/EmpFilter2)


---
### 📊 Team Calender

![Reports](Images/Team Calender)

---
### 📊 Reports & CSV Export

![Reports](Images/ReportsMan)

---

# 🗄 **Database Schema**

## **Users Table**

| Field      | Description          |
| ---------- | -------------------- |
| id         | unique identifier    |
| name       | employee name        |
| email      | login email          |
| password   | hashed password      |
| role       | employee / manager   |
| employeeId | unique employee code |
| department | department name      |
| createdAt  | timestamp            |

## **Attendance Table**

| Field        | Description                        |
| ------------ | ---------------------------------- |
| id           | unique record id                   |
| userId       | reference to user                  |
| date         | attendance date                    |
| checkInTime  | timestamp                          |
| checkOutTime | timestamp                          |
| status       | present / absent / late / half-day |
| totalHours   | calculated hours                   |
| createdAt    | timestamp                          |

---

# 🔌 **API Endpoints**

## **Auth**

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register new account |
| POST   | `/api/auth/login`    | Login user           |
| GET    | `/api/auth/me`       | Get logged-in user   |

---

## **Employee Attendance**

| Method | Endpoint                     | Description                 |
| ------ | ---------------------------- | --------------------------- |
| POST   | `/api/attendance/checkin`    | Mark check-in               |
| POST   | `/api/attendance/checkout`   | Mark check-out              |
| GET    | `/api/attendance/my-history` | Get full attendance history |
| GET    | `/api/attendance/my-summary` | Monthly summary             |
| GET    | `/api/attendance/today`      | Today’s attendance status   |

---

## **Manager Attendance**

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/api/attendance/all`          | View all employees’ attendance |
| GET    | `/api/attendance/employee/:id` | Single employee details        |
| GET    | `/api/attendance/summary`      | Team summary                   |
| GET    | `/api/attendance/export`       | Export CSV                     |
| GET    | `/api/attendance/today-status` | Today's presence/absence list  |

---

## **Dashboards**

| Role     | Endpoint                  |
| -------- | ------------------------- |
| Employee | `/api/dashboard/employee` |
| Manager  | `/api/dashboard/manager`  |

---

# 📊 **Dashboard Features**

## **Employee Dashboard**

* Today's check-in / check-out status
* Monthly attendance stats
* Total hours worked
* Last 7 days summary
* Quick Check-In/Check-Out

## **Manager Dashboard**

* Total employees
* Present vs Absent today
* Late arrivals
* Department-wise charts
* Weekly trend graph
* List of absent employees

---

# 📅 **Attendance History View**

* Calendar view
* Color coded:

  * 🟢 Present
  * 🔴 Absent
  * 🟡 Late
  * 🟠 Half-Day
* Click on a date for details
* Filter by month

---

# 📂 **Reports Page**

* Select date range
* Filter by employee
* Export results to CSV
* Downloadable reports

---

# 🧪 **Seed Data**

You can generate sample data for:

* Employees
* Managers
* Attendance records

Include a seeder script like:

```
npm run seed
```

---

# ⚙️ **Setup Instructions**

### **1. Clone Repository**

```sh
git clone https://github.com/your-username/attendance-system.git
cd attendance-system
```

---

## **2. Backend Setup**

```sh
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
```

Run server:

```
npm start
```

---

## **3. Frontend Setup**

```sh
cd frontend
npm install
npm run dev
```

---

# 🌍 **Environment Variables (`.env.example`)**

```
# Backend
PORT=
MONGO_URI=
JWT_SECRET=

# Frontend
VITE_API_URL=http://localhost:5000
```

---

# 📁 **Folder Structure**

```
/backend
  /controllers
  /models
  /routes
  /middleware
  /services

/frontend
  /src
    /components
    /pages
    /redux or /store
    /utils
```

---

---

