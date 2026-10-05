# Hospital Appointment Management System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based Hospital Appointment Management System that facilitates doctor directory browsing, specialization filtering, dynamic available time slot selection, real-time double-booking prevention, appointment status tracking, and reception desk roster administration.

## Problem Statement
In conventional outpatient departments, physical queueing and manual registers frequently cause appointment scheduling conflicts, double-booking of doctors, elongated patient wait times, and high cancellation friction without slot re-allocation.

## Proposed Solution
A dual-portal web application (Patient Portal & Reception / Admin Portal) featuring:
1. Interactive physician directory with clinical credentials, consultation fees, and available days.
2. Dynamic time slot allocator preventing slot collisions (double-booking) in real time.
3. Form validation checking patient name, age, 10-digit mobile number, and email.
4. Patient appointment history view with cancellation capabilities that immediately release slots back into availability.
5. Reception dashboard with real-time KPI metrics (Total, Booked, Completed, Cancelled) and status toggles.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Status Badges, Interactive Time Slot Grids)
- **Client Logic**: Vanilla JavaScript (ES6+, Event Delegation, Array Filtering, Set Operations, LocalStorage State Sync)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3003
- **Database Architecture**: SQLite3 DDL with multi-column UNIQUE constraint preventing slot collision (`database/schema.sql`)

## Features
- **Patient Portal**:
  - Doctor search by name or clinical specialty.
  - Multi-specialization dropdown filtering (Cardiology, Orthopedics, Pediatrics, Neurology, General Medicine, Dermatology).
  - Calendar date selector with minimum date enforcement (past dates disabled).
  - Visual time slot matrix highlighting Available slots (green) vs. Booked slots (disabled red with strikethrough).
  - Instant double-booking prevention guard.
  - Booking confirmation token (`APT-XXXXX`).
  - Appointment history lookup with instant cancellation action.
- **Reception / Admin Portal**:
  - Live metric cards: Total Appointments, Active Bookings, Completed Consultations, Cancelled Visits.
  - Master clinical roster with search and filter.
  - Mark appointments as "Completed" upon doctor consultation.
  - Add new consulting physician profile modal.

## Web Technologies Concepts Demonstrated
- **Slot Collision & Double-Booking Prevention**: Checking in-memory and stored datasets to verify that `(doctorId + date + time + 'Booked')` is uniquely constrained.
- **Dynamic DOM Generation**: Dynamically rendering doctor cards, time slot buttons with state-dependent CSS classes, and master appointment tables.
- **Tabbed Interface Navigation**: Switching views between "Find Doctors" and "My Appointment History" using tab data attributes.
- **Form Validation & Date Constraints**: Enforcing `min` date limits programmatically and validating phone (`/^[6-9]\d{9}$/`) and email syntax.
- **Client-Side Storage**: Synchronizing all state changes to browser `localStorage` with seed JSON fallback.

## Project Structure
```text
03_Hospital_Appointment_Management_System/
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
No third-party npm packages are required:
```bash
cd WEB_TECHNOLOGIES/03_Hospital_Appointment_Management_System
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then navigate to:
```text
http://localhost:3003
```

### Option 2: Direct Browser Execution
Open `index.html` directly in your web browser.

## Usage
1. **Find a Doctor**: In the Patient Portal, browse available doctors or filter by specialization (e.g. Cardiology).
2. **Book a Slot**: Click `Book Appointment Slot` on any doctor card. Enter patient details, choose an upcoming date, and select an available (green) time slot. Click `Confirm Appointment`.
3. **Verify Double-Booking Guard**: Try booking the exact same doctor on the exact same date and time slot. Notice that the slot turns red and disabled, preventing duplicate bookings.
4. **Cancel Visit**: Open the `My Appointment History` tab and click `Cancel` on a booked appointment to immediately free the slot.
5. **Admin Roster**: Switch the active view to **Hospital Reception / Admin** to monitor clinic KPIs and mark patient consultations as completed.

## Sample Test Cases
### Test Case 1: Booking an Available Slot
- **Input**: Doctor: `Dr. Rajesh Varma`, Date: `Tomorrow`, Slot: `11:00 AM`, Patient: `Anand`, Phone: `9840112233`, Email: `anand@gmail.com`
- **Expected Outcome**: Appointment confirmed with status "Booked", token generated, and redirected to History tab.

### Test Case 2: Prevention of Double-Booking
- **Input**: Attempting to book `Dr. Rajesh Varma` on the same date at `11:00 AM`.
- **Expected Outcome**: The slot is rendered as disabled (`booked` CSS class) and cannot be selected. If forced, client validation rejects the submission with: "Selected time slot is already booked for this doctor."

### Test Case 3: Slot Re-activation on Cancellation
- **Input**: Patient cancels appointment `APT-1001` (`09:00 AM` for `Dr. Rajesh Varma`).
- **Expected Outcome**: Appointment status updates to "Cancelled", and `09:00 AM` slot switches from red disabled to green available in the booking modal.

### Test Case 4: Form Validation for Invalid Phone
- **Input**: Phone entered as `12345`
- **Expected Outcome**: Form submission halted with error: "Please enter a valid 10-digit mobile number."

### Test Case 5: Doctor Filtering by Specialization
- **Input**: Select `Orthopedics` in the specialization dropdown.
- **Expected Outcome**: Directory immediately filters to display only orthopedic specialists (e.g. `Dr. Priya Sundaram`).

## Limitations
- SMS gateway integration for automated patient reminders requires a third-party paid SMS API (e.g. Twilio).
- Multi-hospital branch networking is not implemented; system focuses on single-center OPD operations.

## Future Enhancements
- Integration of an online payment gateway (UPI, Stripe, Razorpay) for advance consultation fee collection.
- Automated WhatsApp notifications for appointment confirmation and token updates.
- Telemedicine video consultation link generation via WebRTC.

## Viva Questions
1. **Q: How does this application prevent double-booking of appointment slots?**
   *A:* When a doctor and date are selected, the application queries the appointments array for any existing records matching the same `doctorId`, `date`, and `status === 'Booked'`. Matching time slots are rendered as disabled in the DOM, and a pre-submission validation guard prevents duplicate submissions.

2. **Q: How does cancellation affect slot availability?**
   *A:* When an appointment status changes to `'Cancelled'`, it no longer satisfies the `status === 'Booked'` condition during the availability scan, rendering the slot green and selectable for other patients.

3. **Q: What database constraint represents double-booking prevention in SQL?**
   *A:* A compound unique constraint: `UNIQUE(doctor_id, appointment_date, appointment_time, status)`, which enforces database-level uniqueness across those fields.

4. **Q: Why is the `min` attribute applied to the appointment date input?**
   *A:* Setting `bookDate.min` to today's date formatted as `YYYY-MM-DD` disables past dates in the native browser calendar picker, preventing backdated appointments.

5. **Q: How does tab switching work in Vanilla JavaScript?**
   *A:* Event listeners on the `.tab-btn` elements inspect their `data-tab` attribute, toggle the `.active` and `.hidden` utility classes on corresponding content sections, and trigger targeted rendering functions.

6. **Q: What is the purpose of using regular expressions (regex) in client-side form validation?**
   *A:* Regex patterns allow rigorous character-level verification (e.g. `/^[6-9]\d{9}$/` for Indian mobile numbers and standard email syntaxes) before passing data to application state.

7. **Q: How are KPI metrics (Total, Booked, Completed, Cancelled) calculated?**
   *A:* They are derived dynamically from the appointments array using JavaScript `Array.prototype.filter().length` without hardcoded counts.

8. **Q: What is the difference between client-side validation and server-side validation?**
   *A:* Client-side validation improves user experience by providing immediate feedback before sending data over the network, while server-side validation is essential for system security because client-side scripts can be bypassed.
