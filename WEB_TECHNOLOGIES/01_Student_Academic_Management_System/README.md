# Student Academic Management System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based Student Academic Management System that automates student profile maintenance, curriculum subject enrollment, internal/external examination mark entry, attendance tracking, and dynamic semester CGPA calculation without hardcoded values.

## Problem Statement
Traditional academic record keeping often relies on manual spreadsheets or disparate log books, leading to calculation errors in cumulative grade point averages (CGPAs), data redundancies, lack of validation on evaluation marks, and delayed communication of grades to students.

## Proposed Solution
A modern, dual-role (Administrator/Faculty & Student) single-page web application featuring:
1. Client-side state persistence with `localStorage` and fallback to JSON seed records.
2. Robust form validation with regex pattern matching for student identity, emails, and phone numbers.
3. Real-time dynamic calculation of total marks, Anna University/autonomous-aligned letter grades (O, A+, A, B+, B, C, U), grade points, and weighted semester CGPA.
4. Real-time search, multi-criteria filtering by department and academic year, and dynamic table generation.
5. Dedicated student portal allowing individual learners to view their grades, attendance status, and print semester grade sheets.

## Technologies Used
- **Frontend Structure**: HTML5 (Semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Media Queries, Custom Badges, Modals, Responsive Tables)
- **Logic & DOM**: Vanilla JavaScript (ES6+, Event Listeners, State Management, Regex Form Validation, LocalStorage, Array Methods)
- **Server**: Node.js built-in HTTP server (`server.js`) for zero-dependency static serving on port 3001
- **Database Architecture**: SQLite3-compatible SQL DDL (`database/schema.sql`)

## Features
- **Admin Capabilities**:
  - Add, edit, and delete student records with instant duplicate ID rejection.
  - Add new curriculum subjects with custom credit weightage (1 to 6 credits).
  - Enter and update subject internal marks (0 to 40) and external marks (0 to 60).
  - Track subject-wise attendance percentage with automated low-attendance warnings (<75%).
  - Search students by ID or name; filter by department and academic year.
  - Live KPI metric cards for Total Enrolled Students, Active Curriculum Subjects, Overall Average CGPA, and Pass Rate.
- **Student Capabilities**:
  - Secure profile lookup by Student Registration ID.
  - Comprehensive grade sheet display with credits, marks breakdown, letter grade, and grade points.
  - Dynamic weighted CGPA badge calculation.
  - Print-friendly semester academic report generation.

## Web Technologies Concepts Demonstrated
- **Semantic HTML5**: Extensive use of structured markup including `<header>`, `<main>`, `<section>`, `<table>`, and accessible `<form>` elements.
- **Advanced CSS3**: Custom CSS custom properties (variables), modern card layouts via CSS Grid, Flexbox alignment, modal dialog overlays, and media queries for mobile/tablet/desktop.
- **DOM Manipulation & Events**: Event delegation on table action buttons, real-time input event listeners for dynamic mark tallying, and dynamic table row injection.
- **Client-Side Form Validation**: JavaScript-driven validation ensuring mandatory fields, email regex, 10-digit phone format, and numeric range limits (internal <= 40, external <= 60).
- **Asynchronous Data Handling**: Async/await `fetch()` loading seed JSON data with localStorage persistence.
- **Mathematical Computation**: Weighted average algorithms calculating CGPA = `Σ(Grade Point × Credits) / Σ(Credits)`.

## Project Structure
```text
01_Student_Academic_Management_System/
├── README.md
├── package.json
├── server.js
├── index.html
├── src/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
├── data/
│   └── initial_data.json
├── database/
│   ├── schema.sql
│   └── init_db.js
├── screenshots/
│   └── README.md
└── tests/
    └── test.js
```

## Installation
No third-party npm packages are required. The project runs using native Node.js:
```bash
cd WEB_TECHNOLOGIES/01_Student_Academic_Management_System
```

## How to Run
### Option 1: Using the Node.js Development Server
```bash
npm start
```
Then open your browser and navigate to:
```text
http://localhost:3001
```

### Option 2: Direct Browser Execution
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Firefox, Microsoft Edge, Safari).

## Usage
1. **Switch Portals**: Use the top-right dropdown to toggle between **Administrator / Faculty** and **Student Portal**.
2. **Add a Student**: Click `+ Add New Student`, enter the student details (e.g. ID `PEC2023CS005`), and click Save.
3. **Enter Marks**: On any student row, click `📝 Marks`. Enter internal (max 40) and external (max 60) marks. Observe the real-time update of total marks, grade, and grade points. Click `Save Marks & Attendance`.
4. **Filter & Search**: Use the search box or department dropdown to narrow down student records instantly.
5. **View as Student**: Switch to Student Portal, select a student ID, and click `View Academic Sheet` to inspect their dynamic CGPA and attendance.

## Sample Test Cases
### Test Case 1: Add Valid Student Record
- **Input**: ID: `PEC2023CS010`, Name: `Karthik S`, Dept: `Information Technology`, Year: `3rd Year`, Email: `karthik@gmail.com`, Phone: `9840112233`
- **Expected Outcome**: Record is saved, modal closes, total student counter increments, and table renders the new row.

### Test Case 2: Validation of Invalid Email and Phone
- **Input**: Email: `karthik.pec`, Phone: `12345`
- **Expected Outcome**: Submission halted, display errors: "Please enter a valid email address." and "Phone number must be a 10-digit number starting with 6-9."

### Test Case 3: Rejection of Duplicate Student ID
- **Input**: ID: `PEC2023CS001` (already exists in database)
- **Expected Outcome**: Form rejected with error message: "This Student ID already exists."

### Test Case 4: Mark Range Boundary Enforcement
- **Input**: Internal Mark: `45` (limit is 40), External Mark: `65` (limit is 60)
- **Expected Outcome**: Inputs clamp automatically to respective maximum bounds (40 and 60), ensuring invalid scores cannot be registered.

### Test Case 5: Accurate Weighted CGPA Calculation
- **Input**: Subject 1 (4 Credits, 94 Marks -> O / 10), Subject 2 (4 Credits, 82 Marks -> A+ / 9), Subject 3 (2 Credits, 90 Marks -> O / 10)
- **Calculation**: Total points: `(10*4) + (9*4) + (10*2) = 40 + 36 + 20 = 96`. Total credits: `10`. CGPA = `9.60`.
- **Expected Outcome**: CGPA displayed is exactly `9.60`.

## Limitations
- State is currently saved in browser `localStorage`; multi-tab sync across disparate client devices requires a remote centralized database server.
- File attachment of official medical certificates for attendance condonation is not yet integrated.

## Future Enhancements
- Integration of a cloud database (PostgreSQL / MongoDB) with JWT-based role authentication.
- Automated PDF report card generation and automated email dispatches to parents.
- Graphical charts for semester-on-semester academic performance trends using Chart.js.

## Viva Questions
1. **Q: What is the Document Object Model (DOM) and how is it used in this project?**
   *A:* The DOM is an object-oriented programmatic representation of the HTML document structure. In this project, DOM methods (`getElementById`, `querySelector`, `createElement`) are utilized to dynamically render students, compute CGPAs in real time, and handle modal states.

2. **Q: What is event delegation and where is it applied here?**
   *A:* Event delegation is a technique where a single event listener is attached to a parent element (`studentsTableBody`) to handle events triggered by its descendant buttons (`Edit`, `Delete`, `Marks`). This avoids attaching individual listeners to dynamic rows and improves memory efficiency.

3. **Q: How does `localStorage` differ from `sessionStorage` and cookies?**
   *A:* `localStorage` stores key-value pairs persistently across browser sessions without expiration until cleared explicitly (up to ~5MB), whereas `sessionStorage` expires when the tab closes, and cookies carry smaller payloads (~4KB) automatically with HTTP requests.

4. **Q: How is the CGPA computed dynamically without hardcoding?**
   *A:* The application loops through each course record, looks up its credit weight from the subjects dictionary, calculates the total mark (internal + external), determines the grade point, multiplies points by credits, sums them up, and divides by total credits: `CGPA = Σ(GP × Credits) / Σ(Credits)`.

5. **Q: How is client-side form validation enforced in this project?**
   *A:* Custom JavaScript validation checks values using regular expressions (e.g. `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for email and `/^[6-9]\d{9}$/` for mobile) and enforces numeric boundary limits before state modification, displaying contextual inline errors.

6. **Q: Why use Semantic HTML5 elements like `<header>`, `<main>`, `<section>`, and `<footer>` instead of generic `<div>` tags?**
   *A:* Semantic HTML conveys structural meaning to web browsers, screen readers, and search engines, improving accessibility, maintainability, and search engine optimization (SEO).

7. **Q: What is the purpose of CSS Flexbox versus CSS Grid in this interface?**
   *A:* CSS Grid is used for 2-dimensional layouts such as the responsive KPI stats cards (`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`), while Flexbox is used for 1-dimensional alignments like header branding and action button bars.

8. **Q: What role does the `server.js` file serve in this project?**
   *A:* It acts as a lightweight, zero-dependency Node.js HTTP web server that handles static resource requests, sets correct MIME types (HTML, CSS, JS, JSON), and serves the application locally on port 3001.
