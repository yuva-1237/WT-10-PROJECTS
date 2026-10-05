# Web Technologies

## 10 Application-Based Academic Projects

**Student Name:** Yuvathilagan  
**Subject:** Web Technologies  
**Degree / Branch:** B.E. Computer Science and Engineering  
**Academic Institution:** Prathyusha Engineering College  
**Submission Type:** Application-Based Academic Project Collection  

---

## Executive Summary

This repository contains a comprehensive suite of **10 independent, application-based academic web projects** developed for the **Web Technologies** curriculum. Each project is architected as an autonomous web application featuring zero unnecessary external dependencies, clean semantic HTML5 markup, responsive CSS3 styling, vanilla JavaScript ES6+ state management, comprehensive form validations, dynamic DOM manipulation, real-time calculations without hardcoded outputs, SQLite database schemas, and automated unit test suites.

Every application runs on its own dedicated HTTP port (3001 through 3010) or can be executed directly in any modern web browser via `index.html`.

---

## Master Project Catalog

```text
WEB_TECHNOLOGIES/
│
├── 01_Student_Academic_Management_System/     (Port 3001)
├── 02_Online_Examination_System/              (Port 3002)
├── 03_Hospital_Appointment_Management_System/ (Port 3003)
├── 04_Digital_Library_Management_System/      (Port 3004)
├── 05_College_Bus_Tracking_Pass_System/       (Port 3005)
├── 06_Internship_Job_Application_Portal/      (Port 3006)
├── 07_College_Canteen_Pre_Order_System/       (Port 3007)
├── 08_College_Complaint_Maintenance_Portal/   (Port 3008)
├── 09_College_Event_Registration_System/      (Port 3009)
└── 10_Hostel_Management_System/               (Port 3010)
```

---

### 1. Student Academic Management System
* **Folder**: `01_Student_Academic_Management_System/`
* **Objective**: Maintain student records, course enrollments, internal/external marks, attendance percentages, and dynamic Anna University 10-point GPA/CGPA calculations.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Dual-role access: Administrator and Student.
  * Full Student CRUD (Create, Read, Update, Delete) with duplicate roll number prevention.
  * Subject enrollment and dynamic semester mark entry.
  * Dynamic letter grade assignment (O, A+, A, B+, B, C, U) and weighted GPA/CGPA computation.
  * Real-time search, department filtering, and attendance monitoring.
* **Web Concepts Demonstrated**: Form validation, dynamic table rendering, event listeners, local persistence, weighted mathematical calculations.
* **Run Command**:
  ```bash
  cd 01_Student_Academic_Management_System && npm start
  # URL: http://localhost:3001
  ```

---

### 2. Online Examination System
* **Folder**: `02_Online_Examination_System/`
* **Objective**: Deliver a timed, interactive online examination platform with dynamic question banks, live countdown timer, interactive question palette, automatic scoring, and detailed answer review.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Student login, exam instructions, and timed test session.
  * Interactive question palette tracking Answered, Flagged, and Unanswered states.
  * Live JavaScript countdown timer with automatic test submission upon expiration.
  * Instant dynamic score calculation (Score, Percentage, Pass/Fail determination).
  * Administrator console to add, edit, delete, and configure question banks.
* **Web Concepts Demonstrated**: `setInterval` timers, radio button state tracking, conditional rendering, array aggregation, DOM event dispatching.
* **Run Command**:
  ```bash
  cd 02_Online_Examination_System && npm start
  # URL: http://localhost:3002
  ```

---

### 3. Hospital Appointment Management System
* **Folder**: `03_Hospital_Appointment_Management_System/`
* **Objective**: Facilitate outpatient clinic consultations by matching patients with specialized doctors, managing time slot matrices, and strictly preventing double-booking conflicts.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Patient registration and appointment booking.
  * Doctor directory with search and specialization filtering (Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology).
  * Dynamic time slot matrix with visual booked/available badges.
  * Strict double-booking guard preventing duplicate appointments for the same doctor, date, and time.
  * Appointment lifecycle management (`Booked`, `Completed`, `Cancelled`).
* **Web Concepts Demonstrated**: Complex date/time validation, array deduplication, modal workflows, dynamic UI slot rendering.
* **Run Command**:
  ```bash
  cd 03_Hospital_Appointment_Management_System && npm start
  # URL: http://localhost:3003
  ```

---

### 4. Digital Library Management System
* **Folder**: `04_Digital_Library_Management_System/`
* **Objective**: Catalog college library assets, manage circulation records (issue and return), dynamically adjust inventory stock, and compute overdue fines automatically.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Searchable book catalog with category filters and available copy counters.
  * Book issue engine with automatic stock decrement and zero-stock guards.
  * Book return engine with automatic stock restoration.
  * Dynamic fine calculator (₹5/day for returns past the 14-day borrowing duration).
  * Librarian management dashboard for adding, editing, and retiring titles.
* **Web Concepts Demonstrated**: Inventory state synchronization, epoch timestamp subtraction, date arithmetic, table manipulation.
* **Run Command**:
  ```bash
  cd 04_Digital_Library_Management_System && npm start
  # URL: http://localhost:3004
  ```

---

### 5. College Bus Tracking and Pass System
* **Folder**: `05_College_Bus_Tracking_Pass_System/`
* **Objective**: Administer college transit fleets, route timetables, stop progression timelines (zero-dependency without external paid APIs), and verifiable digital bus passes.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Route and stop search across college transit corridors.
  * Visual route milestone progression timeline with live status (`Not Started`, `On Route`, `At College`, `Completed`).
  * Student registration and instant digital verified bus pass generation.
  * Administrator transit console to update bus coordinates and current stops.
* **Web Concepts Demonstrated**: Progress timeline UI, SVG badge rendering, string search algorithms, digital pass formatting.
* **Run Command**:
  ```bash
  cd 05_College_Bus_Tracking_Pass_System && npm start
  # URL: http://localhost:3005
  ```

---

### 6. Internship and Job Application Portal
* **Folder**: `06_Internship_Job_Application_Portal/`
* **Objective**: Connect engineering students with corporate recruitment drives, allowing multi-criteria job filtering, resume upload validation, and tracking recruitment pipelines.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Job board with real-time search across role, company, job type (Internship/Full-Time), and location.
  * Student profile and resume file validation (type check `.pdf`, `.doc`, `.docx` and size limit < 5MB).
  * Duplicate application prevention guard.
  * 5-stage candidate recruitment workflow: `Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected` / `Rejected`.
  * Recruiter posting interface and applicant review table.
* **Web Concepts Demonstrated**: Client-side File API validation, multi-parameter filtering, progressive status badge styling.
* **Run Command**:
  ```bash
  cd 06_Internship_Job_Application_Portal && npm start
  # URL: http://localhost:3006
  ```

---

### 7. College Canteen Pre-Order System
* **Folder**: `07_College_Canteen_Pre_Order_System/`
* **Objective**: Eliminate dining hall queues via a pre-order food catalog, dynamic interactive shopping cart, real-time bill calculations (subtotal, 5% tax, total), and kitchen order processing.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Categorized menu (Breakfast, Meals, Snacks, Drinks, Desserts) with dietary tags.
  * Dynamic JavaScript shopping cart supporting addition, removal, and quantity adjustments.
  * Automatic price computation: Subtotal, CGST/SGST taxes, Grand Total.
  * Order placement with unique token generation and kitchen status tracking (`Placed` → `Preparing` → `Ready` → `Collected`).
* **Web Concepts Demonstrated**: Cart state management, floating-point currency formatting, modal receipts, real-time counters.
* **Run Command**:
  ```bash
  cd 07_College_Canteen_Pre_Order_System && npm start
  # URL: http://localhost:3007
  ```

---

### 8. College Complaint and Maintenance Portal
* **Folder**: `08_College_Complaint_Maintenance_Portal/`
* **Objective**: Provide an institutional grievance redressal system spanning 9 academic and campus facility categories, enforcing a strict sequential resolution workflow and student feedback ratings.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Grievance filing across 9 categories (Classroom, Laboratory, Wi-Fi, Electricity, Water, Hostel, Cleanliness, Infrastructure, Other).
  * Optional file attachment validation.
  * Strict sequential workflow: `Submitted` → `Assigned` → `In Progress` → `Resolved` → `Closed`.
  * 5-star student satisfaction rating and feedback upon issue resolution.
  * Administrator analytics dashboard computing real-time status breakdowns.
* **Web Concepts Demonstrated**: Finite state machine transitions, interactive star rating widget, dynamic metrics cards.
* **Run Command**:
  ```bash
  cd 08_College_Complaint_Maintenance_Portal && npm start
  # URL: http://localhost:3008
  ```

---

### 9. College Event Registration System
* **Folder**: `09_College_Event_Registration_System/`
* **Objective**: Coordinate college symposia, hackathons, and cultural fests with automated deadline expiry enforcement, seat capacity limits, duplicate registration guards, canvas QR codes, and CSV exports.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, HTML5 Canvas, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Event catalog with category filters (Technical, Cultural, Sports, Workshop, Seminar).
  * Automated deadline guard disabling expired registrations.
  * Real-time capacity tracker with progress bars blocking registrations when full.
  * Digital pass generation with dynamic HTML5 Canvas QR code representation.
  * One-click RFC 4180 CSV export of participant rosters for event coordinators.
* **Web Concepts Demonstrated**: HTML5 Canvas 2D procedural rendering, date boundary comparisons, Blob/Data URI CSV generation.
* **Run Command**:
  ```bash
  cd 09_College_Event_Registration_System && npm start
  # URL: http://localhost:3009
  ```

---

### 10. Hostel Management System
* **Folder**: `10_Hostel_Management_System/`
* **Objective**: Manage campus residential student halls, room allocations, bed capacity constraints, outpass/leave approval workflows, and maintenance grievance tracking.
* **Technologies**: HTML5, CSS3, JavaScript ES6+, LocalStorage, SQLite3 schema, Node.js HTTP server.
* **Main Features**:
  * Dual-role system: Resident Student and Hostel Warden/Admin.
  * Real-time room occupancy grid across blocks and floors.
  * Room allocation and transfer engine maintaining vacancy synchronization.
  * Student resident portal showing assigned roommates, room amenities, and boarding fee status.
  * Electronic leave/outpass request submission and warden approval/rejection queue.
  * Live top dashboard displaying: Total Rooms, Occupied Rooms, Available Rooms, Pending Leaves, Pending Complaints.
* **Web Concepts Demonstrated**: Relational entity coordination, date range validation, multi-tab layout, state preservation.
* **Run Command**:
  ```bash
  cd 10_Hostel_Management_System && npm start
  # URL: http://localhost:3010
  ```

---

## Universal Project Structure

Every single application adheres to this standard architecture:

```text
PROJECT_FOLDER/
│
├── README.md              # 16-section academic documentation with 5+ test cases & 8+ viva Q&As
├── package.json           # Independent scripts & metadata
├── server.js              # Dedicated Node.js HTTP static server
├── index.html             # Semantic HTML5 application entry point
├── src/
│   ├── css/
│   │   └── style.css      # Custom responsive CSS3 design system
│   ├── js/
│   │   └── app.js         # Vanilla JavaScript application logic & storage
│   └── assets/            # Project icons and visual assets
│
├── data/
│   └── initial_data.json  # Realistic sample dataset
├── database/
│   ├── schema.sql         # Production-grade SQLite3 table definitions
│   └── init_db.js         # Verification and bootstrap script
├── screenshots/
│   └── README.md          # Visual walkthrough and screenshot descriptions
└── tests/
    └── test.js            # Automated unit test suite verifying core business logic
```

---

## Automated Verification Suite

Run all test suites across all 10 projects using Node.js:

```bash
node 01_Student_Academic_Management_System/tests/test.js
node 02_Online_Examination_System/tests/test.js
node 03_Hospital_Appointment_Management_System/tests/test.js
node 04_Digital_Library_Management_System/tests/test.js
node 05_College_Bus_Tracking_Pass_System/tests/test.js
node 06_Internship_Job_Application_Portal/tests/test.js
node 07_College_Canteen_Pre_Order_System/tests/test.js
node 08_College_Complaint_Maintenance_Portal/tests/test.js
node 09_College_Event_Registration_System/tests/test.js
node 10_Hostel_Management_System/tests/test.js
```

All 10 test suites pass with **50/50 test cases PASSED (0 failures)**.
