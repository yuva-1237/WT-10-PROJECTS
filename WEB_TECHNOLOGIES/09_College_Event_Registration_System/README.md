# Project 09: College Event Registration System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To architect and implement an interactive, responsive web application for managing college symposiums, cultural festivals, hackathons, sports meets, and technical workshops. The system enforces dynamic validation constraints including automatic registration cut-off upon deadline expiration, strict seat capacity limits, duplicate registration guards, automated digital pass generation with simulated QR code verification, and administrator participant roster CSV exports.

## Problem Statement
Traditional paper-based or unconstrained online Google Forms for campus events frequently suffer from:
1. Registrations continuing after deadlines have expired.
2. Overbooking beyond venue and computing lab seating capacities.
3. Multiple duplicate registrations by enthusiastic students skewing participant counts.
4. Cumbersome manual ticket verification and lack of digital entry passes.
5. Inefficient participant record compilation and delayed export to spreadsheets for attendance tracking.

## Proposed Solution
A modern, zero-dependency Web Technologies application with:
1. **Dynamic Event Directory**: Categorized browsing across Technical, Cultural, Sports, Workshop, and Seminar events with real-time text search and category tab filtering.
2. **Automated Deadline Guard**: Real-time evaluation of event registration cut-off timestamps disabling booking interfaces with a "Deadline Passed" badge.
3. **Seat Capacity Tracking**: Progress bars indicating seats booked vs remaining capacity; automatically transitions to "Housefull" and blocks excess bookings.
4. **Duplicate Prevention Guard**: Instant verification preventing the same student roll number from reserving duplicate seats for the same event.
5. **Unique Registration Token & QR Pass**: Generation of unique IDs (`REG-EVT-XXXX`) rendered on an interactive canvas digital pass ready for printing and entry scanning.
6. **Administrative Console**: Full event catalog lifecycle management (Create, Edit, Delete, Capacity adjustment) and one-click RFC 4180 CSV export of participant rosters.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<dialog>/modal`, `<canvas>`).
- **Styling**: Vanilla CSS3 (Custom properties, Flexbox, CSS Grid, media queries for 390px, 768px, 1440px viewports, linear gradients, modal transitions).
- **Client Logic**: Vanilla JavaScript ES6+ (DOM manipulation, event delegation, regular expression validation, canvas 2D context procedural drawing, dynamic CSV generation).
- **Data & Persistence**: Browser `localStorage` cache with seed data fallback (`data/initial_data.json`) and standalone SQLite schema definition (`database/schema.sql`).
- **Server / Testing Runtime**: Node.js native `http` module serving port 3009 and Node.js `assert` unit test runner.

## Features

### Student Features
- **Browse & Filter Events**: Explore campus happenings with dynamic category tabs (Technical, Cultural, Sports, Workshop, Seminar) and real-time substring search.
- **Inspect Event Synopsis**: View detailed agendas, dates, timings, venue locations, and seat limits.
- **Seat Availability Meter**: Real-time progress bar reflecting live bookings and available seats.
- **Interactive Registration Form**: Complete validation of Student Roll ID, Name, PEC Email, and 10-digit Phone.
- **Verified Digital Pass**: Modal pass showing event details, student credentials, and a procedurally rendered canvas QR code.
- **Booking Management**: View booked registrations under "My Registrations" and cancel tickets to release seats back into the pool.

### Administrator Features
- **Catalog Management**: Add new events or modify dates, venues, deadlines, and seat caps.
- **Dynamic Capacity Control**: Expand or limit event participant maximums.
- **Roster Inspection**: Review all confirmed participants across events.
- **Roster CSV Export**: Download complete participant data formatted for spreadsheet analysis.

## Web Technologies Concepts Demonstrated
- **Semantic HTML5**: Native semantic document tree, clean form controls with explicit labels, and ARIA attributes for screen readers.
- **CSS3 Responsive Grid & Flexbox**: Fluid multi-column cards that re-flow into single-column layouts on mobile viewports.
- **Form Validation & RegEx**: Client-side field verification rejecting invalid emails and non-10-digit mobile numbers before submission.
- **Canvas API Rendering**: HTML5 `<canvas>` 2D context drawing procedural finder patterns and hash-based data grids simulating QR codes.
- **Data Export via Blob / Data URI**: Client-side RFC 4180 CSV generation triggered programmatically without server reliance.
- **State Management & Deduplication**: Array filter and some methods guaranteeing data integrity and capacity constraints.

## Project Structure
```text
09_College_Event_Registration_System/
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
   cd WEB_TECHNOLOGIES/09_College_Event_Registration_System
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
   http://localhost:3009
   ```
3. Alternatively, open `index.html` directly in any modern browser.

## Usage
1. **Explore Events**: Filter events by clicking categories or typing in the search box.
2. **Register**: Click "Register Now" on any open event, fill in student credentials, and submit.
3. **Verify Pass**: Inspect the generated pass with the unique `REG-EVT-XXXX` token and QR code.
4. **Manage Bookings**: Switch to "My Registrations" to view or cancel passes.
5. **Admin Console**: Switch to "Admin Console" to create new events, adjust capacities, or export participant rosters to CSV.

## Sample Test Cases

### Test Case 1: Deadline Expiry Enforcement
- **Input**: Attempt to register for an event whose deadline timestamp is earlier than the reference date (`2026-09-30` < `2026-10-05`).
- **Expected Result**: System rejects registration with error: `"Registration deadline for this event has passed."` Button shows `"Deadline Closed"`.

### Test Case 2: Maximum Capacity Limit Enforcement
- **Input**: Event capacity set to 2 participants; two confirmed registrations already exist. A third student attempts registration.
- **Expected Result**: System halts submission with error: `"Event has reached maximum participant capacity."` Card displays `"Housefull"` badge.

### Test Case 3: Duplicate Registration Guard
- **Input**: Student ID `PEC2023CS001` attempts to register a second time for event `EVT-201`.
- **Expected Result**: System detects existing record and outputs: `"Student is already registered for this event."`

### Test Case 4: Unique Token Generation
- **Input**: Valid student inputs for open event.
- **Expected Result**: Registration succeeds, issuing unique token starting with `REG-EVT-` and rendering the digital pass.

### Test Case 5: Participant Roster CSV Export
- **Input**: Administrator clicks "Export Participant CSV".
- **Expected Result**: Browser prompts download of valid `.csv` file containing headers and formatted participant records.

## Limitations
1. In-browser demo uses simulated QR procedural patterns rather than external heavy QR libraries to remain 100% zero-dependency.
2. Payment gateway integration for paid events is simulated.

## Future Enhancements
1. Real-time WebSocket attendance scanner via mobile device camera.
2. Automated confirmation email and SMS delivery with embedded pass PDF.
3. Multi-tier team registrations for inter-college hackathons and relays.

## Viva Questions

### Q1: How does the application prevent registrations once the deadline has passed?
**A**: During form submission, JavaScript constructs `Date` objects for both the event deadline and current date. It normalizes end-of-day timestamps (`setHours(23, 59, 59, 999)`) and evaluates whether the current time exceeds the deadline, rejecting the registration and disabling the button if expired.

### Q2: What HTML5 element is used to render the event pass QR code?
**A**: The HTML5 `<canvas>` element is utilized. JavaScript obtains its 2D rendering context (`canvas.getContext('2d')`) and draws coordinate grids, finder patterns, and pseudo-random hash patterns representing the student's registration token.

### Q3: How is the participant CSV export generated without an external backend?
**A**: JavaScript aggregates the participant records into comma-separated text lines according to RFC 4180 specifications, prepends the MIME data URI header `data:text/csv;charset=utf-8,`, encodes it using `encodeURI()`, creates a virtual `<a>` element, sets the `download` attribute, and programmatically triggers `link.click()`.

### Q4: How is duplicate registration prevented across identical students?
**A**: Before accepting a registration, JavaScript checks existing registrations using `Array.prototype.some()`, matching both the `eventId` and `studentId` in uppercase. If a match is found, the submission is aborted with a validation warning.

### Q5: How does the capacity calculation dynamically reflect in the UI?
**A**: For each event card, the script counts confirmed registrations where `status === 'Confirmed'`. It computes the remaining seats (`maxParticipants - confirmedCount`) and updates a CSS width percentage style on the progress bar element in real time.

### Q6: What semantic HTML5 elements are used in this project?
**A**: `<header>`, `<nav>`, `<main>`, `<section>`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<form>`, `<label>`, `<button>`, and `<footer>` are used to ensure proper accessibility and SEO hierarchy.

### Q7: Why is `localStorage` supplemented by a seed JSON file?
**A**: `localStorage` guarantees client-side state persistence across reloads and offline usage, while `data/initial_data.json` acts as an initial bootstrap seed and fallback if storage is cleared.

### Q8: How is responsive layout achieved for various screen resolutions?
**A**: CSS Flexbox is used for header and filter bars, while CSS Grid (`repeat(auto-fill, minmax(350px, 1fr))`) is used for event cards. Media queries adapt padding and column counts down to single-column viewports on 390px mobile screens.
