# Digital Library Management System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based Digital Library Management System that automates catalog search, category filtering, book issues with available copy decrement, return handling with available copy increment, and dynamic overdue fine calculation based on date arithmetic.

## Problem Statement
Traditional academic library circulations frequently encounter delays in physical card indexing, inaccurate inventory stock tracking, and manual calculation errors when assessing overdue penalty fines against borrowing policies.

## Proposed Solution
A client-side digital library application featuring:
1. Multi-parameter book search across Title, Author, and ISBN, supplemented by subject category filters.
2. Dynamic stock tracking: Issuing a book decrements available copies in real time; returning a book replenishes available copies.
3. Automatic 14-day loan duration scheduling.
4. Dynamic overdue fine calculation engine: Computing exact days elapsed between Due Date and Actual Return Date, multiplying by ₹5 per late day.
5. Dual portal interfaces for Student Borrowers and Library Administrators with real-time KPI metrics and circulation ledgers.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (Custom Amber/Bronze Academic Palette, CSS Grid, Flexbox, Status Badges, Fine Computation Cards)
- **Programming & DOM**: Vanilla JavaScript (ES6+, Date Arithmetic, Object Mapping, Event Delegation, LocalStorage State Management)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3004
- **Database Architecture**: SQLite3 DDL with inventory check constraints (`database/schema.sql`)

## Features
- **Student Member Portal**:
  - Browse book catalog with title, author, category, ISBN, shelf location, and real-time available copy badges.
  - Search books by title, author, or ISBN.
  - Filter books by curriculum categories (Computer Science, IT, ECE, Mechanical, Mathematics, Literature).
  - Issue available books with automated 14-day due date computation.
  - Active loan ledger showing borrowed titles, issue dates, due dates, and pending overdue status.
  - Return book interface with interactive calendar picker and dynamic late fine calculator.
- **Librarian / Administrator Portal**:
  - Live metric cards: Cataloged Titles, Total Inventory Volumes, Active Loans, and Total Fines Collected.
  - Add, edit, and delete catalog books.
  - Master circulation history ledger recording student IDs, issue dates, return dates, and fine payments.

## Web Technologies Concepts Demonstrated
- **Date Arithmetic & Epoch Computation**: Utilizing `Date.getTime()` millisecond differences to compute overdue days: `diffDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24))`.
- **Dynamic Fine Calculation**: Computing penalty fines purely in code without hardcoded constants: `fine = lateDays * dailyFineRate`.
- **Dynamic Inventory State Tracking**: Managing atomic decrement of `availableCopies` on issue and increment on return.
- **Client-Side Form Handling & Dynamic Modals**: Populating modal inputs dynamically based on user selections and validating inputs before updating state.
- **Data Persistence**: Synchronizing books catalog and transaction records with browser `localStorage`.

## Project Structure
```text
04_Digital_Library_Management_System/
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
No external npm dependencies are required:
```bash
cd WEB_TECHNOLOGIES/04_Digital_Library_Management_System
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then open your browser to:
```text
http://localhost:3004
```

### Option 2: Direct Browser Execution
Open `index.html` directly in any web browser.

## Usage
1. **Search Books**: In the Student Member Portal, search for a book by title (e.g. "Web Technologies") or filter by category (e.g. "Computer Science").
2. **Issue a Book**: Click `📖 Issue Book` on any book with available stock. Confirm the student borrower details and click `Confirm Book Issue`.
3. **Verify Inventory Update**: Notice that available copies decrement by 1, and the title now appears in the `My Borrowed Books` tab with a 14-day due date.
4. **Return Book with Fine Calculation**: Click `🔄 Return Book`. Change the actual return date to a date beyond the due date (e.g., 5 days later). Observe the overdue days update to `5 Days` and the fine calculate to `₹25`. Click `Process Return`.
5. **Librarian Administration**: Switch active portal to **Librarian / Administrator** to view total fines collected, inventory statistics, and manage books.

## Sample Test Cases
### Test Case 1: Dynamic Fine Calculation for Overdue Return
- **Input**: Due Date: `2026-10-10`, Return Date: `2026-10-15`, Daily Rate: `₹5`
- **Calculation**: Late Days = `5`, Fine = `5 × ₹5 = ₹25`
- **Expected Outcome**: Dialog renders "Overdue Days: 5 Days" and "Total Calculated Fine: ₹25".

### Test Case 2: Zero Fine for On-Time Return
- **Input**: Due Date: `2026-10-10`, Return Date: `2026-10-09` (returned 1 day early)
- **Calculation**: Late Days = `0`, Fine = `₹0`
- **Expected Outcome**: Dialog renders "Overdue Days: 0 Days" and "Total Calculated Fine: ₹0".

### Test Case 3: Available Copies Decrement on Issue
- **Input**: Book `BK-103` has `quantity: 6, availableCopies: 6`. Student issues the book.
- **Expected Outcome**: `availableCopies` becomes `5`.

### Test Case 4: Stock Depletion Protection
- **Input**: Book `availableCopies: 0`
- **Expected Outcome**: Issue button is disabled (`Unavailable`), preventing negative inventory.

### Test Case 5: Available Copies Restoration on Return
- **Input**: Book `BK-101` with `availableCopies: 3` has an active loan returned.
- **Expected Outcome**: `availableCopies` increments to `4`, and loan status updates to `Returned`.

## Limitations
- Barcode/RFID scanner hardware integration is simulated via text ISBN input.
- Electronic book (ePub/PDF) digital reader viewer is not integrated into this physical circulation system.

## Future Enhancements
- Integration of a barcode scanner camera module via the WebRTC `getUserMedia()` API.
- Automated email reminders dispatched 2 days prior to loan expiration.
- Book reservation/queueing system when all physical copies are on loan.

## Viva Questions
1. **Q: How is the overdue fine calculated dynamically in JavaScript?**
   *A:* The application parses the ISO date strings into JavaScript `Date` objects, computes their millisecond difference `(ret.getTime() - due.getTime())`, converts milliseconds to days using division by `(1000 * 60 * 60 * 24)`, and multiplies any positive day difference by the daily rate (₹5): `fine = diffDays > 0 ? diffDays * rate : 0`.

2. **Q: How does the application ensure inventory counts remain valid?**
   *A:* When a book is issued, `availableCopies` decrements by 1 only if `availableCopies > 0`. When returned, it increments by 1 without exceeding total `quantity`.

3. **Q: What is the significance of `Date.setHours(0, 0, 0, 0)` in date difference calculations?**
   *A:* It resets the hour, minute, second, and millisecond components to midnight for both dates, preventing partial day fractional distortions during day difference computation.

4. **Q: How is multi-criteria filtering implemented across Title, Author, and ISBN?**
   *A:* The `Array.prototype.filter()` callback converts both the search query and the book fields to lowercase and checks inclusion using `String.prototype.includes()`, while simultaneously verifying category matching.

5. **Q: What happens when an overdue book is returned in the system?**
   *A:* The system records the return date, logs the paid fine amount in the transaction record, updates the status from `Issued` to `Returned`, and increments the library's total fines collected KPI metric.

6. **Q: How does the UI indicate that a book is out of stock?**
   *A:* The application renders a red `Out of Stock` badge and applies the `disabled` attribute to the issue button, preventing user interaction.

7. **Q: Why is event delegation preferred for the catalog and loans tables?**
   *A:* Event delegation allows a single listener on the parent container (`booksGrid` or `myLoansTbody`) to intercept click events on dynamically generated action buttons via `event.target.closest()`, reducing memory overhead.

8. **Q: How is state persisted across browser refreshes?**
   *A:* State is serialized to a JSON string using `JSON.stringify()` and saved in `localStorage`. On application boot, `localStorage.getItem()` restores the state, falling back to seed JSON data if empty.
