# Online Examination System

## Student Name
Yuvathilagan

## Subject
Web Technologies

## Project Type
Application-Based Academic Project

## Objective
To develop an automated, web-based Online Examination System featuring a countdown timer, dynamic question navigation, instant automatic score computation, question review with detailed solutions, and an administrative question bank management module.

## Problem Statement
Traditional pen-and-paper examinations suffer from logistical delays in grading, potential human evaluation errors, paper wastage, and an inability to provide instant explanatory feedback to students upon exam completion.

## Proposed Solution
A secure, client-side single-page online examination portal that:
1. Presents comprehensive instructions and registers candidate information.
2. Implements an accurate JavaScript countdown timer with automatic test submission on timeout.
3. Provides an interactive Question Palette displaying real-time status (Answered, Flagged for Review, Unattempted).
4. Calculates final scores and percentages dynamically without hardcoding.
5. Displays an instant diagnostic scorecard accompanied by question-by-question explanations.
6. Equips administrators with CRUD controls over the question bank and timer settings.

## Technologies Used
- **Frontend Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<form>`, `<table>`)
- **Styling**: Vanilla CSS3 (CSS Grid, Flexbox, Animation Keyframes, Sticky Headers, Responsive Palettes)
- **Programming & DOM**: Vanilla JavaScript (ES6+, `setInterval`, `clearInterval`, Object/Array manipulation, State Management, LocalStorage)
- **Local Server**: Node.js HTTP server (`server.js`) on dedicated port 3002
- **Database Architecture**: SQLite3 DDL (`database/schema.sql`)

## Features
- **Student Examination Arena**:
  - Candidate registration with registration number and department selection.
  - Interactive multiple-choice questions with customized selectable option cards.
  - Synchronized countdown timer with visual pulse indicator.
  - Dynamic Question Palette allowing direct jump to any question.
  - Previous, Next, Clear Response, and Flag for Review functionality.
  - Automatic submission upon timer expiry or candidate manual submission.
  - Dynamic score breakdown: Correct, Incorrect, Unattempted, Percentage Score, and Pass/Fail status.
  - Detailed diagnostic solution review showing candidate choice vs. correct answer with rationale.
- **Admin & Controller Portal**:
  - Add, edit, and delete questions with full support for 4 options and answer keys.
  - Configure exam duration (in minutes) and passing score percentage.
  - Real-time persistent state synced via browser storage.

## Web Technologies Concepts Demonstrated
- **JavaScript Timers**: Utilization of `setInterval` and `clearInterval` to construct a real-time countdown timer that triggers state transitions.
- **Dynamic DOM Rendering**: Dynamic generation of option lists, radio bindings, question palette badges, and review cards.
- **State Management**: Managing client-side examination state including candidate answers dictionary `{ [qId]: optionIndex }`, review flags `Set()`, and navigation indices.
- **Event Handling**: Listening to radio clicks, modal dismissals, keyboard triggers, and browser print events.
- **Form Handling & Validation**: Validating candidate identity fields and admin question form inputs.

## Project Structure
```text
02_Online_Examination_System/
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
The project runs with zero external npm dependencies using native Node.js:
```bash
cd WEB_TECHNOLOGIES/02_Online_Examination_System
```

## How to Run
### Option 1: Development Server
```bash
npm start
```
Then navigate to:
```text
http://localhost:3002
```

### Option 2: Direct Browser Execution
Open `index.html` directly in any web browser.

## Usage
1. **Candidate Registration**: Fill in registration number and name on the initial screen, then click `Start Examination Now →`.
2. **Taking the Exam**:
   - Select an answer for each question by clicking any option card.
   - Use `Next →` or `← Previous` to move across questions, or click any number on the **Question Palette** on the right.
   - Click `🚩 Mark for Review` if you wish to revisit the question later.
   - Click `Clear Response` if you wish to deselect your answer.
3. **Submit**: Click `Finish & Submit Exam` or allow the timer to expire.
4. **View Scorecard**: Analyze your dynamic percentage score and scroll through the detailed explanations.
5. **Admin Access**: Switch the portal dropdown in the header to **Exam Controller / Admin** to create or modify questions.

## Sample Test Cases
### Test Case 1: Start Exam & Timer Initiation
- **Input**: Enter Reg: `PEC2023CS001`, Name: `Yuvathilagan`, click `Start Examination Now`.
- **Expected Outcome**: Exam arena appears, Question 1 renders, Question Palette displays all questions, timer begins countdown from `10:00`.

### Test Case 2: Option Selection and Palette Color Synchronization
- **Input**: Select Option A for Question 1.
- **Expected Outcome**: Option card is highlighted in primary theme color, button 1 on Question Palette turns green (Answered), summary counter increments.

### Test Case 3: Flag for Review Toggle
- **Input**: Click `🚩 Mark for Review` on Question 2.
- **Expected Outcome**: Palette button 2 turns amber/yellow, button text updates to `🏳️ Unmark Review`.

### Test Case 4: Automatic Score Calculation
- **Input**: 8 questions total; candidate answers 6 correctly and 2 incorrectly.
- **Expected Outcome**: Score percentage calculates dynamically as `(6 / 8) * 100 = 75.0%`. Pass badge is displayed, and breakdown accurately lists 6 correct, 2 incorrect.

### Test Case 5: Automatic Timeout Submission
- **Input**: Countdown reaches `00:00`.
- **Expected Outcome**: Countdown stops, notification triggers: "Time expired! Submitting examination automatically...", and candidate is redirected to the results page without data loss.

## Limitations
- Full screen lockdown and tab-switching monitoring (proctoring) are simulated in basic browser scope and require browser permissions or dedicated Electron wrapper for full lockdown.
- Questions currently support single-choice MCQs; multi-select checkboxes or descriptive text answers require server-side NLP evaluation.

## Future Enhancements
- Integration of webcam-based AI proctoring to detect suspicious behavior.
- Support for negative marking algorithms and question randomization (Fisher-Yates shuffle).
- Dynamic CSV/Excel export of exam results for faculty grading registers.

## Viva Questions
1. **Q: How is the countdown timer implemented in JavaScript?**
   *A:* The timer is created using `setInterval()`, which decrements a `secondsRemaining` counter every 1000 milliseconds, recalculates minutes and seconds using integer division and modulo (`Math.floor(sec / 60)` and `sec % 60`), updates the DOM, and invokes `clearInterval()` and auto-submission when reaching 0.

2. **Q: How does the application ensure that submitted scores are not hardcoded?**
   *A:* The application compares each candidate response in the `userAnswers` object with the `correct` index property of the question definition in memory, sums up correct counts, and dynamically calculates: `percentage = (correctCount / totalQuestions) * 100`.

3. **Q: What is the benefit of using a `Set` for flagged review questions?**
   *A:* A `Set` stores unique values and provides $O(1)$ constant time complexity for adding, checking (`has`), and removing (`delete`) flagged question IDs.

4. **Q: How do you format numbers with leading zeroes (e.g. "09" instead of "9") in modern JavaScript?**
   *A:* Using the `String.prototype.padStart(2, '0')` method, which pads the current string with a specified character until it reaches the desired length.

5. **Q: What is the purpose of the `novalidate` attribute in HTML5 forms?**
   *A:* It disables default browser validation popups so that custom, styled JavaScript-driven validation logic and error messages can be rendered consistently across browsers.

6. **Q: How does the Question Palette navigate directly to a question?**
   *A:* Each palette button has an event listener bound to its question index. When clicked, it updates `currentQIndex` to that index and re-executes `renderCurrentQuestion()` and `renderPalette()`.

7. **Q: How does the application prevent answer loss on page refresh if enabled?**
   *A:* By synchronizing candidate responses and question states to `localStorage` using `JSON.stringify()` on every answer change.

8. **Q: Why is CSS `position: sticky` used for the navigation header?**
   *A:* `position: sticky` keeps the timer and exam identity visible at the top of the viewport even when long questions or answer reviews are scrolled vertically.
