# Screenshots & UI Layout Guide - College Bus Tracking and Pass System

This directory documents the transit management interfaces:

1. **Student Transit Portal & Interactive Bus Route Visualizer**:
   - Route and stop search bar with instant search across intermediate stages (e.g. "Chromepet", "Guindy", "Tambaram").
   - Bus schedule cards showing Bus Number, Driver contact, start time, and current transit status badge (`On Route`, `At College`, `Not Started`, `Completed`).
   - Interactive Route Visualizer: Visual step progression timeline showing intermediate stops, highlighting the bus's live current location and next destination.

2. **Digital Bus Pass Generator & Verified Pass Card**:
   - Pass generation form linking student profile, chosen route, and designated boarding stop.
   - High-fidelity **COLLEGE BUS PASS** visual card containing student photo placeholder, student name, route, boarding point, validity expiry date, status badge (`Valid` / `Expired`), and generated QR code pattern.
   - One-click "Print / Save Digital Pass" action.

3. **Transport Admin Dashboard**:
   - Live fleet metrics: Total Buses, Active Fleet on Route, Buses at College, and Total Issued Passes.
   - Master Fleet Table with direct status progression buttons (`Simulate Next Stop`, `Set At College`, `Mark Completed`).
   - Add new bus route modal.
