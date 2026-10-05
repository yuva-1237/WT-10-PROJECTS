# Screenshots & UI Layout Guide - Hospital Appointment Management System

This directory documents the clinical interface components:

1. **Patient Booking Portal & Doctor Directory**:
   - Filter bar with search by doctor name, specialization dropdown, and consultation fee tags.
   - Doctor Profile Cards featuring doctor credentials, consultation room, consultation fee, and available days.
   - "Book Appointment" modal displaying interactive date picker and real-time available time slot buttons (booked slots disabled with red badge, available slots in green).

2. **Double-Booking Prevention Guard**:
   - Visual disabled state and validation alert if another user selects an already committed slot for that specific doctor and calendar date.

3. **My Appointments / History View**:
   - Patient view displaying current Booked visits, past Completed visits, and Cancelled appointments.
   - One-click "Cancel Appointment" action that immediately frees the reserved slot in the hospital scheduler.

4. **Hospital Admin / Reception Desk View**:
   - Comprehensive appointment log with status switcher (Mark as Completed / Cancelled).
   - Add new Doctor modal for clinical department expansion.
