# College Complaint and Maintenance Portal

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based College Complaint and Maintenance Portal that enables students to lodge facility complaints across 9 campus infrastructure categories, track sequential resolution workflows (`Submitted` → `Assigned` → `In Progress` → `Resolved` → `Closed`), submit service ratings, and allows estate maintenance coordinators to assign specialized technicians and monitor live service performance metrics.

## Problem Statement
Campus infrastructure defects (such as laboratory projector breakdowns, Wi-Fi connectivity blackouts, water leakage, or classroom electrical failures) frequently go unaddressed for days due to informal verbal reporting, lack of clear maintenance ownership, untracked dispatches, and an absence of student feedback loops.

## Proposed Solution
A dual-portal facility management system featuring:
1. Student complaint registration categorized into: `Classroom`, `Laboratory`, `Wi-Fi`, `Electricity`, `Water`, `Hostel`, `Cleanliness`, `Infrastructure`, and `Other`.
2. Support for priority tags (Low, Medium, High) and optional defect evidence image attachments.
3. Strict sequential 5-stage maintenance workflow: `Submitted` → `Assigned` → `In Progress` → `Resolved` → `Closed`.
4. Visual multi-step ticket tracking progress bar.
5. Interactive 5-star student service satisfaction feedback mechanism.
6. Estate office administration dashboard with live KPI counters (`Total Complaints`, `Pending`, `In Progress`, `Resolved`) and technician dispatch assignments.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (Campus Crimson Palette, CSS Grid, Flexbox, Status Badges, Visual Workflow Step Timelines, Interactive Star Ratings)
- **Programming & DOM**: Vanilla JavaScript (ES6+, FileReader API for Image Preview, Event Delegation, LocalStorage State Sync)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3008
- **Database Architecture**: SQLite3 DDL with Check Constraints (`database/schema.sql`)

## Features
- **Student Facility Portal**:
  - Lodge complaints across 9 recognized campus facility categories.
  - Campus location locator, priority assessment, title, and detailed defect descriptions.
  - Client-side image upload preview with `FileReader` data URL conversion.
  - Form validation verifying telephone numbers and required minimum character lengths.
  - "Track My Complaints" view with visual 5-stage progress steps.
  - Interactive 5-star rating and comment feedback submission once marked `Resolved`.
- **Estate Office / Admin Portal**:
  - Dynamic KPI cards: `Total Complaints`, `Pending`, `In Progress`, `Resolved`.
  - Filter tickets by category and workflow status; search by title, location, or ticket ID.
  - Dispatch specialized technicians (Electrical, Plumbing, Network, Carpentry, Housekeeping).
  - Advance tickets through the sequential lifecycle.

## Web Technologies Concepts Demonstrated
- **Sequential Finite State Machine Workflow**: Enforcing strict forward progression across `Submitted` → `Assigned` → `In Progress` → `Resolved` → `Closed`.
- **FileReader API for Image Previews**: Converting user-selected image files into base64 Data URLs for immediate client-side visual inspection before form submission.
- **Interactive Rating Widgets**: Implementing dynamic hover and active states for a 5-star evaluation component.
- **Form Validation & Regular Expressions**: Asserting minimum character lengths and verifying 10-digit Indian phone numbers (`/^[6-9]\d{9}$/`).
- **Data Persistence**: Preserving complaint logs, technician assignments, and feedback ratings in browser `localStorage`.

## Project Structure
```text
08_College_Complaint_Maintenance_Portal/
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
Runs directly with native Node.js without third-party npm packages:
```bash
cd WEB_TECHNOLOGIES/08_College_Complaint_Maintenance_Portal
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then navigate to:
```text
http://localhost:3008
```

### Option 2: Direct Browser Execution
Open `index.html` directly in any web browser.

## Usage
1. **Lodge Complaint**: In the Student Portal, choose a category (e.g. `Electricity`), select priority (`High`), enter location (`Classroom 204`), provide a title, description, and submit.
2. **Track Service**: The new ticket appears in `Track My Complaints` with status `Submitted`.
3. **Estate Dispatch**: Switch active portal to **Estate Office / Admin**. In the master roster, click `👨‍🔧 Assign` on the ticket, select a technician (e.g. `Venkatesan R`), and click `Dispatch Staff`. The ticket status transitions to `Assigned`.
4. **Progress Workflow**: The technician begins work (`▶ Start Work` -> `In Progress`) and completes the repair (`✓ Resolved`).
5. **Student Feedback**: Switch back to the Student Portal. The `Resolved` ticket presents a `⭐ Provide Service Feedback` button. Select 5 stars, leave a remark, and click submit to close the ticket.

## Sample Test Cases
### Test Case 1: Sequential Workflow Progression
- **Input**: Complaint advances from `Submitted` to `Assigned` (Technician: `Venkatesan`), then to `In Progress`, and finally to `Resolved`.
- **Expected Outcome**: All status updates are validated; `resolvedDate` is stamped automatically upon resolution.

### Test Case 2: Feedback Submission on Resolved Ticket
- **Input**: Student provides 5-star rating and comment on a `Resolved` ticket.
- **Expected Outcome**: Feedback is logged, rating is stored, and ticket status updates to `Closed`.

### Test Case 3: Feedback Block on Unresolved Ticket
- **Input**: Attempt to submit feedback on a ticket in `In Progress` status.
- **Expected Outcome**: Feedback submission rejected with error: "Feedback can only be provided for resolved complaints."

### Test Case 4: Category and Field Validation
- **Input**: Category selected is `InvalidCategory` or description length < 10 characters.
- **Expected Outcome**: Submission halted with validation error messages.

### Test Case 5: Dashboard Metric Dynamic Calculation
- **Input**: 6 total complaints: 2 pending (`Submitted` + `Assigned`), 2 in progress, 2 resolved (`Resolved` + `Closed`).
- **Expected Outcome**: Dashboard displays: Total = 6, Pending = 2, In Progress = 2, Resolved = 2 without hardcoded numbers.

## Limitations
- Automated IoT sensor triggers (e.g. automated water leak detectors) are not integrated; tickets are student-reported.
- Push notification dispatches to technician mobile apps are simulated via client status logs.

## Future Enhancements
- Integration of a dedicated PWA (Progressive Web App) mobile view for on-field maintenance technicians.
- SLA (Service Level Agreement) timer alerts if high-priority complaints remain unresolved after 24 hours.
- Automated material requisition inventory tracking for replacement electrical/plumbing hardware.

## Viva Questions
1. **Q: How does this system manage the complaint lifecycle workflow?**
   *A:* Through a finite state machine sequence defined in JavaScript: `['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed']`. Forward status transitions are validated at each stage, recording timestamps and technician assignments.

2. **Q: How is the image preview implemented on the client side?**
   *A:* Using the HTML5 `FileReader` API. When a file is chosen, `reader.readAsDataURL(file)` converts the image into an encoded base64 string, which is assigned to an `<img>` tag's `src` attribute for instant rendering.

3. **Q: How does the application calculate the dashboard KPI metrics?**
   *A:* Dynamic aggregation: `Pending` counts tickets where `status === 'Submitted' || status === 'Assigned'`, `In Progress` filters for `status === 'In Progress'`, and `Resolved` tallies `status === 'Resolved' || status === 'Closed'`.

4. **Q: Why is student feedback restricted only to resolved tickets?**
   *A:* A student can only evaluate service quality after the maintenance task is finished. Restricting feedback to `Resolved` status prevents premature ratings on incomplete repairs.

5. **Q: How does the star rating component capture values?**
   *A:* Each star element contains a `data-rating="N"` attribute. Clicking a star updates a hidden form input value, toggles `.active` classes on stars with rating `<= N`, and passes the value upon form submission.

6. **Q: What is the purpose of the 9 specific category options?**
   *A:* Standardizing issues into 9 distinct disciplines (`Classroom`, `Laboratory`, `Wi-Fi`, `Electricity`, `Water`, `Hostel`, `Cleanliness`, `Infrastructure`, `Other`) allows accurate routing to the appropriate maintenance department.

7. **Q: How is state managed between the student and estate office views?**
   *A:* All complaint tickets and technician mappings reside in a shared state object synchronized with browser `localStorage`, ensuring updates by the estate office immediately reflect in the student tracking tab.

8. **Q: What SQL check constraint guarantees that only valid statuses are saved?**
   *A:* `CHECK(status IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'))` in the SQLite DDL schema.
