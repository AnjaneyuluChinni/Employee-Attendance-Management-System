# **Personal Details**

Name: Chinni Anjaneyulu
College: Mohan Babu University
Contact: 6304979694
Email: chinni.anjaneyulu22@gmail.com

---
# **Employee Attendance Management System**

A modern attendance tracking platform built for employees and managers. The system includes secure authentication, daily check-in/check-out, attendance history, dashboards, reporting, and team analytics.
Built using **React, Node Js, Supabase, and TailwindCSS** and deployed on **Render**.

---

## **Live Demo**

[https://time-tracker-pro-1.onrender.com](https://time-tracker-pro-1.onrender.com)

## **GitHub Repository**

[https://github.com/AnjaneyuluChinni/Employee-Attendance-Management-System](https://github.com/AnjaneyuluChinni/Employee-Attendance-Management-System)

---

# **Seed Data for Reviewer Testing**

### Manager Account

```
Email: manager@test.com
Password: 123456
```

### Employee Accounts

```
Email: emp1@test.com
Password: 123456
```

```
Email: emp2@test.com
Password: 123456
```

### Notes

* These accounts allow quick login for testing.
* The database contains sample attendance records so dashboards, calendars, and reports reflect meaningful data.
* Reviewers can test:

  * Check-In / Check-Out
  * Attendance history
  * Monthly summary
  * Manager dashboard
  * Team calendar
  * Filters and CSV export

---

# **Tech Stack**

### Frontend

* React
* Zustand / Redux Toolkit
* TailwindCSS
* Vite

### Backend (Supabase)

* Node and Express Js
* Authentication
* PostgreSQL Database
* Row-Level Security (RLS)
* REST and Realtime APIs

### Deployment

* Render (Frontend Hosting)

---

# **Project Overview**

The system supports two user roles:

## Employee Features

* Login / Register
* Daily Check-In / Check-Out
* Attendance history
* Monthly summary
* Employee dashboard
* Profile page

## Manager Features

* Login
* View attendance of all employees
* Filter by employee, date, and status
* Team attendance calendar
* Export attendance reports (CSV)
* Manager dashboard with visual charts

---

# **Screenshots**

### Authentication Screens

| Login                  | Registration                 |
| ---------------------- | ---------------------------- |
| ![Login](client/Images/Login) | ![Register](client/Images/Register) |

### Employee Dashboard

![Employee Dashboard](client/Images/EmployeeDashboard)

### Attendance History

![Attendance History](client/Images/EmpHistroy)

### Check-In / Check-Out

![Mark Attendance](client/Images/MarkAttandance)

### Manager Dashboard

![Manager Dashboard](client/Images/ManagerDash)

### Employee Filters

![Reports](client/Images/EmpFilter)
![Reports](client/Images/EmpFilter2)

### Team Calendar

![Team Calendar](client/Images/TeamCalender)

### Reports and CSV Export

![Reports](client/Images/ReportsMan)

---

# **Database Schema (Supabase PostgreSQL)**

## Users Table

| Column     | Type      | Description        |
| ---------- | --------- | ------------------ |
| id         | uuid      | User ID            |
| name       | text      | Employee name      |
| email      | text      | Login email        |
| role       | text      | employee / manager |
| employeeId | text      | Employee code      |
| department | text      | Department name    |
| createdAt  | timestamp | Created timestamp  |

## Attendance Table

| Column       | Type      | Description             |
| ------------ | --------- | ----------------------- |
| id           | uuid      | Record ID               |
| userId       | uuid      | References users(id)    |
| date         | date      | Attendance date         |
| checkInTime  | time      | Check-in time           |
| checkOutTime | time      | Check-out time          |
| status       | text      | present / absent / late |
| totalHours   | numeric   | Hours worked            |
| createdAt    | timestamp | Record creation time    |

---

# **Architecture Overview**

```
React Frontend
   |
   |— Supabase Client (Node, Authentication, Database, Realtime)
           |
           └── PostgreSQL Database
```

* Supabase manages authentication, database, and access control.
* React handles UI, routing, and state management.
* RLS ensures employees access only their data.
* Managers receive elevated access based on policies.

---

# **Local Development Setup**

### 1. Clone the Repository

```sh
git clone https://github.com/AnjaneyuluChinni/Employee-Attendance-Management-System
cd Employee-Attendance-Management-System
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create `.env` File

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 4. Start Development Server

```sh
npm run dev
```

---

# **Environment Variables (`.env.example`)**

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

---

# **Folder Structure**

```
/public
/src
  /components
  /pages
  /store
  /utils
/supabase
/Images
/seed
  users.json
  attendance.json
.env.example
```

---

# **Seed Files**

Located in `/seed`:

* `users.json` – sample user accounts
* `attendance.json` – sample attendance records

Used for demonstrating dashboards, reports, and analytics.

---

# **Conclusion**

This project showcases:

* Modern frontend engineering
* Authentication and role-based access
* Realtime attendance tracking
* Manager-level analytics and reporting
* Supabase as a scalable backend
* Clean architecture and responsive UI

---

