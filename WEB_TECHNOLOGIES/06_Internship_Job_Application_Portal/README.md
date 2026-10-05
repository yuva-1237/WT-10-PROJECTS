# Internship and Job Application Portal

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop a responsive, full-featured web-based Internship and Job Application Portal that allows students to search openings, filter by location and employment type, submit applications with resume verification, track multi-stage hiring progress, and enables placement recruiters to manage listings and candidate evaluation pipelines.

## Problem Statement
Campus placement drives and internship coordination commonly suffer from disorganized email threads, lack of application status visibility for students, untracked resume submissions, and difficulty in filtering candidates based on technical skill alignments.

## Proposed Solution
A dual-portal web application featuring:
1. Searchable job directory with company profiles, required skill tags, eligibility criteria, stipends, and deadlines.
2. Real multi-parameter filtering across Job Type (Full-Time, Internship, Remote) and Location.
3. Client-side resume file validation ensuring proper document format (`.pdf` / `.docx`).
4. Duplicate application prevention ensuring students cannot submit redundant applications for the same opening.
5. Visual multi-stage candidate hiring pipeline: `Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected` / `Rejected`.
6. Recruiter administration suite with live placement KPI metrics and candidate status transition controls.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (Professional Corporate Violet Palette, CSS Grid, Flexbox, Status Badges, Visual Progress Pipelines)
- **Programming & DOM**: Vanilla JavaScript (ES6+, File API checks, Regex Validation, Array Filtering, LocalStorage State Sync)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3006
- **Database Architecture**: SQLite3 DDL with unique compound constraints (`database/schema.sql`)

## Features
- **Student Candidate Portal**:
  - Profile switcher for simulating different academic profiles and CGPAs.
  - Explore job and internship vacancies with required skills chips.
  - Real-time search across job titles, corporate sponsors, and technical skills (e.g. "JavaScript", "SQL", "Python").
  - Filter opportunities by Job Type and Location.
  - Interactive Application Modal with pre-filled student details and resume file format verification.
  - Duplicate application prevention guard.
  - "My Applications" view with an interactive visual step pipeline tracking hiring progress.
- **Placement Cell / Recruiter Portal**:
  - Live metric cards: Active Openings, Total Applications Received, Shortlisted Candidates, Selected Offers.
  - Candidate review roster with filters by job and status.
  - Action buttons to update candidate statuses: `Shortlist`, `Interview`, `Select`, `Reject`.
  - Post new job opening modal.

## Web Technologies Concepts Demonstrated
- **Multi-Stage Visual State Pipelines**: Visualizing sequential workflow stages using CSS Flexbox step bubbles and status indicators.
- **Client-Side File Validation**: Inspecting `HTMLInputElement.files` to verify file presence and enforce valid extension restrictions (`.pdf`, `.docx`).
- **Dynamic Multi-Parameter Filtering**: Chaining search text, job type, and location filters using `Array.prototype.filter()`.
- **Duplicate Prevention Logic**: Verifying that a `(jobId + studentId)` combination does not exist prior to application registration.
- **Persistent State Synchronization**: Storing job listings and applicant records in `localStorage` with initial JSON fallback.

## Project Structure
```text
06_Internship_Job_Application_Portal/
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
Runs directly using native Node.js without third-party npm packages:
```bash
cd WEB_TECHNOLOGIES/06_Internship_Job_Application_Portal
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then navigate to:
```text
http://localhost:3006
```

### Option 2: Direct Browser Execution
Open `index.html` directly in any web browser.

## Usage
1. **Browse Vacancies**: In the Student Candidate Portal, search for opportunities (e.g. "JavaScript") or filter by Job Type (`Internship`).
2. **Apply for a Job**: Click `Apply Now →` on an open position. Select a resume file (`.pdf` or `.docx`) and click `Submit Application`.
3. **Verify Status Tracking**: Open the `📋 My Applications & Status` tab to see your new application in the `Applied` stage.
4. **Recruiter Evaluation**: Switch active portal to **Placement Cell / Recruiter**. Locate the candidate in the applications roster and click `⭐ Shortlist` or `🎙️ Interview`.
5. **Observe Real-Time Update**: Switch back to the Student Portal to see the visual step pipeline advance to the new stage.

## Sample Test Cases
### Test Case 1: Successful Job Application
- **Input**: Student: `Yuvathilagan M`, Position: `Associate Frontend Software Engineer (Freshworks)`, Resume: `Resume.pdf`
- **Expected Outcome**: Application registered, status initialized to `Applied`, card button updates to `✓ Already Applied`.

### Test Case 2: Prevention of Duplicate Application
- **Input**: Attempting to apply again for the same Freshworks position with the same student ID.
- **Expected Outcome**: Submission rejected, Apply button disabled.

### Test Case 3: Resume File Extension Validation
- **Input**: Attaching an invalid file type `document.exe` or `image.png`.
- **Expected Outcome**: Validation error: "Resume must be in PDF or DOCX format." Submission prevented.

### Test Case 4: Deadline Expiration Enforcement
- **Input**: Position with deadline in the past (`2026-09-30`).
- **Expected Outcome**: Badge renders `Application Closed`, and Apply button is disabled (`Closed`).

### Test Case 5: Recruiter Status Pipeline Update
- **Input**: Recruiter clicks `⭐ Shortlist` on application `APP-5001`.
- **Expected Outcome**: Application status updates to `Shortlisted`, KPI metric increments, and student progress pipeline highlights the shortlisted stage.

## Limitations
- Actual binary file upload is handled client-side using JavaScript File API metadata; full cloud object storage (e.g. AWS S3) is simulated.
- Automated resume parsing (ATS keyword extraction) requires server-side Python/NLP services.

## Future Enhancements
- Integration of an automated AI resume-to-job matching score algorithm.
- Direct video interview scheduling calendar integration via Google Meet / Zoom API.
- Automated SMS and email interview call-letter generation.

## Viva Questions
1. **Q: How does the application validate resume file uploads on the client side?**
   *A:* Using the `files` property of the file input element (`appResume.files[0]`), extracting the file name extension using `file.name.split('.').pop().toLowerCase()`, and asserting inclusion within an allowed array `['pdf', 'docx', 'doc']`.

2. **Q: How does the visual application pipeline work in CSS and JavaScript?**
   *A:* The application defines an ordered array of hiring stages `['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']`. When rendering, it compares the current application stage index against each pipeline node, applying `.completed` or `.active` styling classes.

3. **Q: How does the system prevent duplicate job applications?**
   *A:* The application checks the `applications` array for any record matching both `jobId` and `studentId`. If a match is detected, the submission is rejected and the "Apply Now" button is replaced with "Already Applied".

4. **Q: How is deadline expiration enforced?**
   *A:* The application compares the job's ISO deadline string (`YYYY-MM-DD`) with the current system date. If `today > deadline`, the position is flagged as expired and user applications are blocked.

5. **Q: What is the purpose of the `accept` attribute on file inputs?**
   *A:* The `accept=".pdf,.doc,.docx"` attribute instructs the native OS file picker dialog to filter and only display files with those extensions, improving user experience.

6. **Q: How are recruiter actions delegated efficiently across large application tables?**
   *A:* Event delegation is employed on `adminAppsTbody` using `e.target.closest('.btn-status-change')`, reading `data-id` and `data-status` attributes to perform instantaneous status transitions.

7. **Q: What database constraint prevents duplicate job applications in SQL?**
   *A:* A composite unique constraint: `UNIQUE(job_id, student_id)` on the `applications` table.

8. **Q: How does the application ensure accurate KPI metrics for the recruiter dashboard?**
   *A:* Metrics are calculated dynamically using `portalData.applications.filter(a => a.status === 'Shortlisted').length` rather than hardcoding static counters.
