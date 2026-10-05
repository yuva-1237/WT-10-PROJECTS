# Project 10: Hostel Management System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To engineer a complete, interactive, and responsive web application for managing college student residential complexes (hostels). The system manages dual-role workflows (Resident Student and Warden/Administrator) with dynamic room allocations, transfer handling, capacity constraints, digital outpass/leave application workflows, maintenance grievance tracking, and real-time residential statistics.

## Problem Statement
Traditional hostel record-keeping depends on handwritten registers and disparate noticeboards, causing:
1. Frequent room double-allocation or overcrowding exceeding bed capacities.
2. Cumbersome room transfer tracking where occupancy numbers fall out of sync.
3. Slow and unverified paper outpass procedures leading to safety concerns.
4. Unmonitored maintenance complaints (plumbing, electrical, Wi-Fi) with no audit trail.
5. Inability of administrators to quickly assess live bed vacancies across multiple blocks and floors.

## Proposed Solution
A modern, zero-dependency Web Technologies application with:
1. **Dynamic Room Occupancy & Capacity Matrix**: Visual progress bars and badges illustrating live capacity, occupied beds, and available slots across blocks and floors.
2. **Room Allocation & Transfer Engine**: Intelligent logic preventing over-allocation, and automatically decrementing source room occupancy while incrementing destination room occupancy during student transfers.
3. **Resident Student Portal**: Personalized dashboard displaying assigned room, bed number, room amenities, assigned roommates, hostel fee status (Paid/Partial/Pending), and outpass history.
4. **Leave Application & Warden Workflow**: Electronic outpass filing with date validation (return date cannot precede departure date) and parental consent confirmation; warden review interface with Approve/Reject actions and remarks.
5. **Maintenance Grievance Workflow**: Categorized complaint submission (`Submitted` -> `In Progress` -> `Resolved`) ensuring accountability.
6. **Live Dashboard Metrics**: Dynamic counters calculating Total Rooms, Occupied Rooms, Available Rooms, Pending Leaves, and Pending Complaints directly from records.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<form>`, `<footer>`).
- **Styling**: Vanilla CSS3 (Custom properties, Flexbox, CSS Grid, media queries for 390px, 768px, 1440px viewports, Forest Green & Golden Amber theme).
- **Client Logic**: Vanilla JavaScript ES6+ (DOM manipulation, event delegation, array methods `filter`, `find`, `some`, `reduce`, dynamic modal management).
- **Data & Persistence**: Browser `localStorage` cache with seed data fallback (`data/initial_data.json`) and standalone SQLite schema definition (`database/schema.sql`).
- **Server / Testing Runtime**: Node.js native `http` module serving port 3010 and Node.js `assert` unit test runner.

## Features

### Student Resident Features
- **Student Profile View**: View Roll ID, Name, Department, Academic Year, Room, Block, Bed, and Contact details.
- **Room & Roommate Details**: Inspect allocated room amenities and view real-time roommate cards.
- **Fee Status Tracking**: Monitor annual hostel boarding and mess fee status (Paid / Partial / Pending) with paid and due balances.
- **Submit Outpass / Leave Request**: Apply for leave with departure date, return date, reason, and parental consent confirmation.
- **Leave History**: Track status (`Pending`, `Approved`, `Rejected`) alongside warden remarks.
- **Submit Maintenance Complaint**: Report issues categorized by Electricity, Plumbing, Wi-Fi, Cleanliness, Carpentry, or Other.
- **Track Complaint Status**: Observe live grievance status progression.

### Warden / Administrator Features
- **Hostel Overview Dashboard**: Real-time statistics displaying Total Rooms, Occupied Rooms, Available Rooms, Pending Leave Requests, and Pending Complaints.
- **Room Occupancy Matrix**: Detailed cards for each room showing bed occupancy percentage and vacancies.
- **Student Resident Management**: Add new residents to the system.
- **Room Allocation & Transfers**: Allocate beds to unassigned students or transfer residents between rooms with automatic balance adjustments.
- **Leave Approval Queue**: Review student leave requests, input administrative remarks, and Approve or Reject applications.
- **Maintenance Complaint Management**: Update complaint resolution lifecycle from Submitted to In Progress to Resolved.

## Web Technologies Concepts Demonstrated
- **Semantic HTML5**: Clean semantic element structure, ARIA accessibility attributes for role switching and modal dialogues.
- **CSS3 Grid & Flexbox**: Multi-column responsive layout adapting fluidly from wide screens down to single-column mobile viewports.
- **State Management**: Coordinated state synchronization across room vacancies, student records, leave queues, and complaint tables.
- **Client-Side Form Validation**: Date comparison logic preventing past or inverted departure/return dates; minimum length checks.
- **Dynamic DOM Rendering**: Immediate UI updates reflecting capacity shifts and status changes without full page reloads.

## Project Structure
```text
10_Hostel_Management_System/
│
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
│
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
1. Ensure Node.js (v16 or higher) is installed on your machine.
2. Navigate into the project folder:
   ```bash
   cd WEB_TECHNOLOGIES/10_Hostel_Management_System
   ```
3. Initialize the SQLite database (optional for backend persistence):
   ```bash
   node database/init_db.js
   ```

## How to Run
1. Start the independent local server:
   ```bash
   npm start
   ```
   Or directly:
   ```bash
   node server.js
   ```
2. Open your web browser and navigate to:
   ```text
   http://localhost:3010
   ```
3. Alternatively, open `index.html` directly in any modern browser.

## Usage
1. **Switch Roles**: Use the top-right toggle to switch between Resident Student and Warden/Admin mode.
2. **Student Experience**: In Resident mode, view your assigned room and roommates, apply for an outpass, or file a plumbing/electrical grievance.
3. **Room Allocation**: In Warden mode, navigate to "Student Room Allocations", select a student, and allocate or transfer them to another room.
4. **Approve Leaves**: In Warden mode, open "Review Leave Requests" to review pending outpasses and approve or reject them with remarks.
5. **Manage Complaints**: In Warden mode, open "Manage Complaints" and update status dropdowns to track repair progress.

## Sample Test Cases

### Test Case 1: Room Allocation Rejection on Full Capacity
- **Input**: Attempt to allocate student to Room 101 when `available === 0`.
- **Expected Result**: System rejects allocation with error: `"Cannot allocate: Target room has no available capacity."`

### Test Case 2: Room Allocation Updates Occupancy and Bed
- **Input**: Allocate student `PEC002` to vacant Room 102 (`available === 2`).
- **Expected Result**: Room 102 occupied increments from 1 to 2, available decrements to 1, student assigned `Bed 2`.

### Test Case 3: Room Change Updates Both Old and New Rooms
- **Input**: Transfer student from Room 101 to Room 102.
- **Expected Result**: Room 101 occupancy decrements by 1; Room 102 occupancy increments by 1; student record updated.

### Test Case 4: Leave Request Date Validation
- **Input**: Submit leave with Departure Date `2026-10-15` and Return Date `2026-10-10`.
- **Expected Result**: System halts submission with validation error: `"Return date cannot precede departure date."`

### Test Case 5: Dynamic Dashboard Statistics Verification
- **Input**: Data set with 3 rooms (2 with occupants, 2 with vacancies), 2 pending leaves, 2 unresolved complaints.
- **Expected Result**: Dashboard metrics dynamically output: Total: 3, Occupied: 2, Available: 2, Pending Leaves: 2, Pending Complaints: 2.

## Limitations
1. In-browser demo simulates authentication via a role switch and resident selector dropdown.
2. SMS notification integration to parents for approved outpasses is simulated.

## Future Enhancements
1. Biometric turnstile integration at hostel gate scanning student QR outpasses.
2. Automated mess rebate deduction calculated based on approved leave duration.
3. Online hostel fee payment gateway integration with instant receipt generation.

## Viva Questions

### Q1: How does the room allocation algorithm prevent overbooking?
**A**: When an administrator attempts to allocate a room, the algorithm checks the room's `available` property (`capacity - occupied`). If `available <= 0`, allocation is halted with an error message, and disabled options are rendered in the room selection dropdown.

### Q2: What happens to the previous room when a student is transferred to a new room?
**A**: During a room transfer, the script identifies the student's previous `roomNo`, decrements that room's `occupied` count by 1, and recalculates its `available` slots before incrementing the target room's occupancy, maintaining global consistency.

### Q3: How is date integrity validated during leave application?
**A**: JavaScript parses the departure and return strings into `Date` objects and checks if `to.getTime() < from.getTime()`. If the return date precedes departure, the submission is rejected with an explanatory validation alert.

### Q4: How are roommates dynamically discovered and displayed?
**A**: Roommates are determined using `Array.prototype.filter()` where `student.roomNo === currentStudent.roomNo` and `student.studentId !== currentStudent.studentId`. This ensures roommates dynamically update whenever students are transferred.

### Q5: How are the 5 top dashboard metrics calculated dynamically?
**A**: JavaScript aggregates metrics directly from the data collections:
`rooms.length` for Total Rooms, `rooms.filter(r => r.occupied > 0).length` for Occupied Rooms, `rooms.filter(r => r.available > 0).length` for Available Rooms, `leaveRequests.filter(l => l.status === 'Pending').length` for Pending Leaves, and `complaints.filter(c => c.status !== 'Resolved').length` for Pending Complaints.

### Q6: How does the complaint lifecycle progress?
**A**: Complaints enter the system with `Submitted` status. The hostel warden can update the status to `In Progress` when assigned to technicians, and subsequently mark it `Resolved` once repairs are completed.

### Q7: Why is semantic HTML5 critical in this application?
**A**: Semantic elements like `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<table>` provide structured meaning for assistive screen readers, enhance keyboard navigation, and establish a clear document hierarchy.

### Q8: How does the application ensure state persistence across page reloads?
**A**: All state changes (room allocations, leaves, complaints) are serialized to JSON strings and stored in the browser's `localStorage`. Upon page load, the application deserializes these records, falling back to `data/initial_data.json` if storage is empty.
