# College Bus Tracking and Pass System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based College Bus Tracking and Digital Pass Management System that allows students to explore routes, search intermediate stops, track bus transit status via an interactive timeline without paid map APIs, generate digital student bus passes, and allow transport administrators to manage fleet logistics and simulate live transit progression.

## Problem Statement
Traditional college bus administration depends on paper laminated bus passes that are easily misplaced, forged, or degraded. Furthermore, students frequently lack visibility into intermediate bus stop timings and current route progression, causing avoidable transit delays and crowd congestion.

## Proposed Solution
A client-side transit management web application featuring:
1. Searchable bus directory with route names, driver contact details, seat capacities, and scheduled departure times.
2. Route search enabling students to look up intermediate boarding stops (e.g. "Chromepet", "Guindy", "Avadi").
3. Interactive visual route tracking timeline displaying current bus stop location and status (`Not Started`, `On Route`, `At College`, `Completed`) without requiring a paid external map API.
4. Digital Bus Pass Generator creating a student transport card complete with barcode styling, route details, and expiry date validation.
5. Administrative fleet control allowing dispatchers to advance bus stops in real time and track active fleet metrics.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (CSS Grid, Flexbox, Keyframe Animations, Timeline Visualizers, Digital Pass Card Mockups)
- **Client Logic**: Vanilla JavaScript (ES6+, DOM Manipulation, Array Filtering, Form Validation, LocalStorage Sync)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3005
- **Database Architecture**: SQLite3 DDL (`database/schema.sql`)

## Features
- **Student Transport Portal**:
  - Search routes by route title, bus number, or boarding stop.
  - Filter buses by transit status (`On Route`, `At College`, `Not Started`, `Completed`).
  - View live stop progress via an interactive modal timeline with passed, active, and upcoming nodes.
  - Digital Bus Pass generation form with dynamic stop selection based on chosen route.
  - Duplicate active bus pass prevention.
  - Digital bus pass card with college branding, student details, validity status badge (`Valid` / `Expired`), and barcode simulation.
  - Print-friendly digital bus pass.
- **Transport Admin Portal**:
  - Live fleet KPI cards: Total Fleet Buses, Buses On Route, Buses at College, and Total Issued Passes.
  - Real-time bus simulation controls: "Advance Stop" button simulates bus reaching consecutive stops and marks arrival at campus.
  - Add new bus route modal.
  - Master ledger of all active student bus passes.

## Web Technologies Concepts Demonstrated
- **Interactive Visual Timeline Simulation**: Creating a pure CSS/JavaScript stop progression tracker without third-party paid map dependencies.
- **Dynamic Dependent Dropdowns**: Automatically updating the "Boarding Stop" dropdown whenever a student selects a different bus route.
- **Date Comparison & Expiry Verification**: Comparing pass expiration dates against current system timestamps to dynamically set `Valid` or `Expired` badges.
- **Duplicate Prevention Logic**: Verifying that a student ID does not already possess an active valid bus pass before issuing a new one.
- **State Management & Persistence**: Storing fleet coordinates, bus statuses, and issued passes in browser `localStorage`.

## Project Structure
```text
05_College_Bus_Tracking_Pass_System/
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
cd WEB_TECHNOLOGIES/05_College_Bus_Tracking_Pass_System
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then navigate to:
```text
http://localhost:3005
```

### Option 2: Direct Browser Execution
Open `index.html` directly in any web browser.

## Usage
1. **Search Bus Routes**: In the Student Transport Portal, enter a stop name (e.g. "Chromepet") in the search bar. The directory filters immediately to display matching buses.
2. **Track Route**: Click `📍 Live Stop Tracker` on any bus card to open the interactive timeline showing past, current, and upcoming stops.
3. **Generate Digital Bus Pass**: Click the `🎫 Digital Bus Pass` tab. Enter your student ID and name, select your bus route and boarding stop, and click `Generate Digital Bus Pass`.
4. **Inspect Pass**: The digital bus pass card updates immediately with your route, valid expiry date, and verified badge. Click `Print Digital Pass` for a hard copy.
5. **Admin Transit Controls**: Switch the active view to **Transport Department / Admin**. Click `▶ Advance Stop` on any bus row to simulate the vehicle advancing to its next scheduled stop.

## Sample Test Cases
### Test Case 1: Route Search by Intermediate Stop
- **Input**: Query: "Chromepet"
- **Expected Outcome**: Only Bus `TN-20-CZ-1001` (Tambaram → PEC Campus) is returned in the search results.

### Test Case 2: Digital Pass Generation
- **Input**: ID: `PEC2023CS010`, Name: `Siddharth`, Bus: `TN-20-CZ-1001`, Stop: `Chromepet`, Valid Until: `2026-12-31`
- **Expected Outcome**: Pass created with token `BPASS-XXXX`, status "Valid", and preview card rendered.

### Test Case 3: Rejection of Duplicate Active Bus Pass
- **Input**: Attempt to generate another bus pass for student ID `PEC2023CS001` (which already has an active pass).
- **Expected Outcome**: Submission halted with error: "Student already holds an active bus pass."

### Test Case 4: Pass Expiry Verification
- **Input**: Pass validity set to past date `2026-09-30` against current reference date `2026-10-05`.
- **Expected Outcome**: Pass status badge dynamically computes and displays `EXPIRED` in red.

### Test Case 5: Bus Stop Progression & Status Transition
- **Input**: Bus is at stop index 3 of 4 (`On Route`). Admin clicks `Advance Stop`.
- **Expected Outcome**: Bus reaches last stop (index 4), status transitions to `At College`, and live timeline highlights PEC Campus as the active terminal.

## Limitations
- GPS hardware coordinates from physical IoT onboard tracking units are simulated via scheduled stop progressions.
- External paid mapping services (Google Maps API) are intentionally avoided in accordance with zero-cost academic requirements.

## Future Enhancements
- Integration of free OpenStreetMap (Leaflet.js) vector mapping for geographic polyline rendering.
- Push notifications alerted to students when the bus is within 10 minutes of their boarding point.
- Emergency SOS broadcast trigger for transport coordinators.

## Viva Questions
1. **Q: How does the application implement bus tracking without a paid map API?**
   *A:* It uses an interactive visual timeline and progression state engine where each route is structured as an ordered array of stop objects. The bus's current position is indexed, allowing visual DOM highlights for past, current, and upcoming stages.

2. **Q: How are dependent dropdowns populated in JavaScript?**
   *A:* When the `change` event fires on `passBusSelect`, the listener retrieves the selected bus object from state, extracts its `stops` array, clears `passStopSelect`, and creates new `<option>` elements for each stop.

3. **Q: How is pass validity verified dynamically?**
   *A:* The application compares the ISO timestamp of `validUntil` against the current date. If `today > validUntil`, the status is determined as `Expired`; otherwise, it is `Valid`.

4. **Q: What is the purpose of preventing duplicate bus passes?**
   *A:* It ensures that a single student cannot register for multiple bus seats simultaneously, maintaining transport department seat capacity integrity.

5. **Q: How does the administrative "Advance Stop" feature work?**
   *A:* Clicking the button increments `bus.currentStopIndex` by 1. If the index reaches the final stop in the route array, `bus.currentStatus` transitions from `On Route` to `At College`.

6. **Q: How does the route search match intermediate stops?**
   *A:* By using `Array.prototype.some()`, which evaluates whether any stop in `bus.stops` contains the user's search substring: `bus.stops.some(s => s.name.toLowerCase().includes(query))`.

7. **Q: How is the digital bus pass styled for printing?**
   *A:* Using the native `window.print()` JavaScript method paired with `@media print` CSS rules that isolate the `.digital-bus-pass` element and hide navigation bars.

8. **Q: Why is localStorage used instead of hardcoded JavaScript variables?**
   *A:* `localStorage` ensures that generated student passes and fleet status changes persist across browser tab refreshes.
