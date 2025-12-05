# 📌 **Employee Attendance Management System**

A modern attendance tracking platform built for **Employees** and **Managers**, featuring secure authentication, daily check-in/out, attendance history, dashboards, team analytics, and reporting.

Built using **React + Supabase + TailwindCSS** and deployed on Render.

---

## 🔗 **Live Demo**

👉 [https://time-tracker-pro-1.onrender.com](https://time-tracker-pro-1.onrender.com)

## 💻 **GitHub Repository**

👉 [https://github.com/AnjaneyuluChinni/Employee-Attendance-Management-System](https://github.com/AnjaneyuluChinni/Employee-Attendance-Management-System)

---

# 👤 **Developer Details**

**Name:** Chinni Anjaneyulu
**College:** Mohan Babu University
**Contact:** 6304979694

---

# ⭐ **Seed Data (For Reviewer Testing)**

### **Manager Account**

```
Email: manager@test.com
Password: 123456
```

### **Employee Accounts**

```
Email: emp1@test.com
Password: 123456
```

```
Email: emp2@test.com
Password: 123456
```

### **Notes**

* These sample accounts allow instant login for testing.
* The database contains sample attendance records so dashboards, calendar, and reports show meaningful data.
* Reviewers can test:

  * Check-In / Check-Out
  * Attendance history
  * Monthly summary
  * Manager dashboard
  * Team calendar
  * Filters & CSV export

---

# 🚀 **Tech Stack**

### **Frontend**

* React
* Zustand / Redux Toolkit
* TailwindCSS
* Vite

### **Backend (BaaS)**

* **Supabase**

  * Authentication
  * PostgreSQL Database
  * Row-Level Security (RLS)
  * REST & Realtime APIs

### **Deployment**

* Render (Frontend hosting)

---

# 🧠 **Project Overview**

The system supports **two user roles**:

---

## 👨‍💼 **Employee Features**

* Login / Register
* Daily Check-In / Check-Out
* View attendance history
* Monthly attendance summary
* Dashboard with stats
* Profile page

---

## 👩‍💼 **Manager Features**

* Login
* View attendance of all employees
* Filter by employee, date, and status
* Team attendance calendar
* Export reports (CSV)
* Team dashboard with charts

---

# 🖼 **Screenshots**

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
### 📊 Employees Filters

![Reports](Images/EmpFilter)
![Reports](Images/EmpFilter2)


---
### 📊 Team Calender

![Reports](Images/TeamCalender)

---
### 📊 Reports & CSV Export

![Reports](Images/ReportsMan)

---


# 🗄 **Database Schema (Supabase PostgreSQL)**

## **Users Table**

| Column     | Type      | Description          |
| ---------- | --------- | -------------------- |
| id         | uuid      | user ID              |
| name       | text      | employee name        |
| email      | text      | login email          |
| role       | text      | employee / manager   |
| employeeId | text      | unique employee code |
| department | text      | department name      |
| createdAt  | timestamp | creation time        |

---

## **Attendance Table**

| Column       | Type      | Description             |
| ------------ | --------- | ----------------------- |
| id           | uuid      | record ID               |
| userId       | uuid      | references users(id)    |
| date         | date      | attendance date         |
| checkInTime  | time      | check-in time           |
| checkOutTime | time      | check-out time          |
| status       | text      | present / absent / late |
| totalHours   | numeric   | hours worked            |
| createdAt    | timestamp | record timestamp        |

---

# 🔌 **Architecture Overview**

```
React Frontend
   |
   |— Supabase Client (Auth, DB, Realtime)
           |
           └── PostgreSQL Database
```

* Supabase handles authentication, database, and role access.
* React manages UI, state, and API consumption.
* Row-Level Security ensures employees only access their own records.
* Managers have extended privileges via policy rules.

---

# ⚙️ **Setup Instructions (Local Development)**

### **1. Clone the Repository**

```sh
git clone https://github.com/AnjaneyuluChinni/Employee-Attendance-Management-System
cd Employee-Attendance-Management-System
```

---

### **2. Install Dependencies**

```sh
npm install
```

---

### **3. Create `.env` File**

Create `.env` in the root:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
```

---

### **4. Start App**

```sh
npm run dev
```

---

# 🌍 **Environment Variables (`.env.example`)**

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

---

# 📁 **Folder Structure**

```
/public
/src
  /components
  /pages
  /store (Zustand / Redux)
  /utils
/supabase
/Images
/seed
  users.json
  attendance.json
.env.example
```

---

# 🧪 **Seed Files**

Located in `/seed`:

* `users.json` → sample users
* `attendance.json` → sample attendance records

Used to demonstrate real data on dashboards & reports.

---

# 🏁 **Conclusion**

This project demonstrates:

✔ Modern frontend engineering
✔ Authentication & role-based access
✔ Real-time attendance tracking
✔ Manager reporting & analytics
✔ Supabase as production-ready backend
✔ Clean architecture & UI

---

# 🎉 **Thank You for Reviewing!**

For any clarifications or demo walkthrough, feel free to reach out.

---

# ✅ Your README is DONE

You can now **paste this entire README into GitHub**, commit it, and your project will look **professional, clean, and ready for evaluation**.

If you want, I can also:

🔥 Create an architecture diagram
🔥 Prepare Technical F2F answers
🔥 Generate a 60-second project pitch

Just say **“Prepare me for F2F.”**
