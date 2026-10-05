# Screenshots & UI Layout Guide - Digital Library Management System

This directory documents the digital library interface modules:

1. **Student Library Portal & Catalog Search**:
   - Live book search bar (Search by Title, Author, ISBN) with category filter dropdown.
   - Book catalog card grid with available copies counter (green badge if in stock, red if zero copies).
   - "Issue Book" modal with automatic 14-day loan duration calculator.

2. **Issued Books & Dynamic Fine Return Modal**:
   - Active student loans table showing Book Title, Issue Date, Due Date, and Overdue Indicator.
   - "Return Book" dialog with dynamic late days and fine calculator (`Due Date vs Return Date` difference multiplied by ₹5/day).

3. **Librarian / Administrator Dashboard**:
   - Real-time inventory KPIs (Total Titles, Total Inventory Volumes, Issued Copies, Total Fines Collected).
   - Master Catalog Management table with Add Book, Edit Book, and Delete Book controls.
   - Master Issue / Return Circulation ledger.
