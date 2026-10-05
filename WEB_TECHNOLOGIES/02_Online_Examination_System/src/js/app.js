/**
 * Online Examination System - Core Application Logic
 * Web Technologies Academic Project
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_exam_system_data';

  // State
  let examData = {
    examConfig: {
      title: "CS3401 - Web Technologies Mid-Semester Online Examination",
      durationMinutes: 10,
      passPercentage: 50,
      instructions: [
        "Each question carries equal marks (1 mark each).",
        "No negative marking for incorrect answers.",
        "The examination will submit automatically once the countdown timer reaches 00:00.",
        "Use the Question Palette on the right to navigate directly to any question.",
        "You can mark questions for review and return to them prior to final submission."
      ]
    },
    questions: []
  };

  let candidate = null;
  let currentQIndex = 0;
  let userAnswers = {}; // { qId: optionIndex }
  let flaggedQuestions = new Set();
  let timerInterval = null;
  let secondsRemaining = 600;

  // DOM Elements
  const roleSwitch = document.getElementById('roleSwitch');
  const loginStage = document.getElementById('loginStage');
  const examStage = document.getElementById('examStage');
  const resultStage = document.getElementById('resultStage');
  const adminStage = document.getElementById('adminStage');

  const examTitleHeader = document.getElementById('examTitleHeader');
  const examTimerBadge = document.getElementById('examTimerBadge');
  const timerDisplay = document.getElementById('timerDisplay');
  const instructionsList = document.getElementById('instructionsList');
  const candidateForm = document.getElementById('candidateForm');

  // Exam Arena Elements
  const qCurrentBadge = document.getElementById('qCurrentBadge');
  const qTotalCountBadge = document.getElementById('qTotalCountBadge');
  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const btnFlagReview = document.getElementById('btnFlagReview');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnClearAnswer = document.getElementById('btnClearAnswer');
  const btnSubmitExam = document.getElementById('btnSubmitExam');
  const paletteGrid = document.getElementById('paletteGrid');
  const examCandName = document.getElementById('examCandName');
  const examCandId = document.getElementById('examCandId');
  const summaryAnswered = document.getElementById('summaryAnswered');
  const summaryRemaining = document.getElementById('summaryRemaining');

  // Result Elements
  const resStatusBadge = document.getElementById('resStatusBadge');
  const resCandDetails = document.getElementById('resCandDetails');
  const resScore = document.getElementById('resScore');
  const resCorrect = document.getElementById('resCorrect');
  const resIncorrect = document.getElementById('resIncorrect');
  const resAttempted = document.getElementById('resAttempted');
  const reviewContainer = document.getElementById('reviewContainer');
  const btnRetake = document.getElementById('btnRetake');

  // Admin Elements
  const settingDuration = document.getElementById('settingDuration');
  const settingPassPercent = document.getElementById('settingPassPercent');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const btnAddQuestion = document.getElementById('btnAddQuestion');
  const adminQuestionsTbody = document.getElementById('adminQuestionsTbody');
  const questionModal = document.getElementById('questionModal');
  const questionForm = document.getElementById('questionForm');
  const modalQTitle = document.getElementById('modalQTitle');
  const formQId = document.getElementById('formQId');
  const formQText = document.getElementById('formQText');
  const formOpt0 = document.getElementById('formOpt0');
  const formOpt1 = document.getElementById('formOpt1');
  const formOpt2 = document.getElementById('formOpt2');
  const formOpt3 = document.getElementById('formOpt3');
  const formCorrect = document.getElementById('formCorrect');
  const formExplanation = document.getElementById('formExplanation');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    renderInstructions();
    renderAdminQuestionTable();
    updateAdminSettingsInputs();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        examData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        examData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(examData));
  }

  function renderInstructions() {
    examTitleHeader.textContent = examData.examConfig.title;
    instructionsList.innerHTML = '';
    examData.examConfig.instructions.forEach(ins => {
      const li = document.createElement('li');
      li.textContent = ins;
      instructionsList.appendChild(li);
    });
  }

  function updateAdminSettingsInputs() {
    settingDuration.value = examData.examConfig.durationMinutes;
    settingPassPercent.value = examData.examConfig.passPercentage;
  }

  // --- EXAM WORKFLOW ---
  function startExam() {
    userAnswers = {};
    flaggedQuestions.clear();
    currentQIndex = 0;
    secondsRemaining = examData.examConfig.durationMinutes * 60;

    loginStage.classList.add('hidden');
    resultStage.classList.add('hidden');
    examStage.classList.remove('hidden');
    examTimerBadge.classList.remove('hidden');

    examCandName.textContent = candidate.name;
    examCandId.textContent = candidate.regNo;

    renderCurrentQuestion();
    renderPalette();
    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      secondsRemaining--;
      updateTimerDisplay();

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        showToast('Time expired! Submitting examination automatically...', 'danger');
        setTimeout(submitExam, 1500);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(secondsRemaining / 60);
    const s = secondsRemaining % 60;
    timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function renderCurrentQuestion() {
    const q = examData.questions[currentQIndex];
    if (!q) return;

    qCurrentBadge.textContent = `Question ${currentQIndex + 1}`;
    qTotalCountBadge.textContent = `of ${examData.questions.length} Questions`;
    questionText.textContent = q.text;

    // Review flag status
    if (flaggedQuestions.has(q.id)) {
      btnFlagReview.textContent = '🏳️ Unmark Review';
      btnFlagReview.className = 'btn btn-secondary btn-sm';
    } else {
      btnFlagReview.textContent = '🚩 Mark for Review';
      btnFlagReview.className = 'btn btn-outline btn-sm';
    }

    // Render Options
    optionsContainer.innerHTML = '';
    const selectedOption = userAnswers[q.id];

    q.options.forEach((optText, idx) => {
      const label = document.createElement('label');
      label.className = `option-item ${selectedOption === idx ? 'selected' : ''}`;
      label.innerHTML = `
        <input type="radio" name="optChoice" value="${idx}" ${selectedOption === idx ? 'checked' : ''}>
        <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${optText}</span>
      `;

      label.addEventListener('click', () => {
        userAnswers[q.id] = idx;
        renderCurrentQuestion();
        renderPalette();
        updateSummaryStats();
      });

      optionsContainer.appendChild(label);
    });

    // Navigation Buttons State
    btnPrev.disabled = currentQIndex === 0;
    if (currentQIndex === examData.questions.length - 1) {
      btnNext.classList.add('hidden');
    } else {
      btnNext.classList.remove('hidden');
    }

    updateSummaryStats();
  }

  function renderPalette() {
    paletteGrid.innerHTML = '';
    examData.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.textContent = idx + 1;

      if (idx === currentQIndex) btn.classList.add('active');

      if (flaggedQuestions.has(q.id)) {
        btn.classList.add('flagged');
      } else if (userAnswers[q.id] !== undefined) {
        btn.classList.add('answered');
      } else {
        btn.classList.add('unanswered');
      }

      btn.addEventListener('click', () => {
        currentQIndex = idx;
        renderCurrentQuestion();
        renderPalette();
      });

      paletteGrid.appendChild(btn);
    });
  }

  function updateSummaryStats() {
    const answeredCount = Object.keys(userAnswers).length;
    const remainingCount = examData.questions.length - answeredCount;
    summaryAnswered.textContent = answeredCount;
    summaryRemaining.textContent = remainingCount;
  }

  // --- SUBMISSION & AUTOMATIC RESULT CALCULATION ---
  function submitExam() {
    clearInterval(timerInterval);
    examTimerBadge.classList.add('hidden');
    examStage.classList.add('hidden');

    let correctCount = 0;
    let incorrectCount = 0;
    const total = examData.questions.length;

    examData.questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        if (ans === q.correct) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    const attempted = Object.keys(userAnswers).length;
    const scorePct = total > 0 ? ((correctCount / total) * 100).toFixed(1) : 0;
    const isPass = parseFloat(scorePct) >= examData.examConfig.passPercentage;

    // Display Results
    resStatusBadge.textContent = isPass ? 'PASSED' : 'NEEDS IMPROVEMENT';
    resStatusBadge.className = `result-status-badge ${isPass ? 'pass' : 'fail'}`;

    resCandDetails.textContent = `${candidate.name} (${candidate.regNo}) | ${candidate.dept}`;
    resScore.textContent = `${scorePct}%`;
    resCorrect.textContent = correctCount;
    resIncorrect.textContent = incorrectCount;
    resAttempted.textContent = `${attempted} / ${total}`;

    // Render detailed review
    reviewContainer.innerHTML = '';
    examData.questions.forEach((q, idx) => {
      const userAns = userAnswers[q.id];
      const isCorrect = userAns === q.correct;
      const isUnanswered = userAns === undefined;

      let statusClass = 'unanswered';
      let statusLabel = '<span class="badge" style="background:#e2e8f0; color:#475569;">Not Answered</span>';

      if (!isUnanswered) {
        if (isCorrect) {
          statusClass = 'correct';
          statusLabel = '<span class="badge" style="background:#dcfce7; color:#15803d;">Correct (+1)</span>';
        } else {
          statusClass = 'incorrect';
          statusLabel = '<span class="badge" style="background:#fee2e2; color:#b91c1c;">Incorrect (0)</span>';
        }
      }

      const div = document.createElement('div');
      div.className = `review-item ${statusClass}`;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
          <strong>Question ${idx + 1}:</strong>
          ${statusLabel}
        </div>
        <p style="margin-bottom: 0.75rem;">${q.text}</p>
        <div style="font-size:0.875rem;">
          <p><strong>Your Answer:</strong> ${userAns !== undefined ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}` : '<em style="color:#64748b;">None</em>'}</p>
          <p style="color:var(--success);"><strong>Correct Answer:</strong> ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}</p>
        </div>
        ${q.explanation ? `<div class="review-explanation"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
      `;
      reviewContainer.appendChild(div);
    });

    resultStage.classList.remove('hidden');
    showToast(`Exam submitted! Score: ${scorePct}%`, isPass ? 'success' : 'info');
  }

  // --- ADMIN FUNCTIONS ---
  function renderAdminQuestionTable() {
    adminQuestionsTbody.innerHTML = '';
    examData.questions.forEach((q, idx) => {
      const tr = document.createElement('tr');
      const correctLetter = String.fromCharCode(65 + q.correct);
      tr.innerHTML = `
        <td><strong>${idx + 1}</strong></td>
        <td>${q.text}</td>
        <td>
          <ol type="A" style="padding-left:1.25rem; font-size:0.825rem;">
            ${q.options.map(o => `<li>${o}</li>`).join('')}
          </ol>
        </td>
        <td><span class="badge" style="background:#dcfce7; color:#166534;">Option ${correctLetter}</span></td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline btn-sm btn-edit-q" data-id="${q.id}">Edit</button>
            <button class="btn btn-danger btn-sm btn-del-q" data-id="${q.id}">Delete</button>
          </div>
        </td>
      `;
      adminQuestionsTbody.appendChild(tr);
    });
  }

  function openQuestionModal(editQ = null) {
    questionForm.reset();
    if (editQ) {
      modalQTitle.textContent = 'Edit Question';
      formQId.value = editQ.id;
      formQText.value = editQ.text;
      formOpt0.value = editQ.options[0] || '';
      formOpt1.value = editQ.options[1] || '';
      formOpt2.value = editQ.options[2] || '';
      formOpt3.value = editQ.options[3] || '';
      formCorrect.value = editQ.correct;
      formExplanation.value = editQ.explanation || '';
    } else {
      modalQTitle.textContent = 'Add New Question';
      formQId.value = '';
    }
    questionModal.classList.remove('hidden');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Role switcher
    roleSwitch.addEventListener('change', (e) => {
      clearInterval(timerInterval);
      examTimerBadge.classList.add('hidden');

      if (e.target.value === 'student') {
        adminStage.classList.add('hidden');
        loginStage.classList.remove('hidden');
        examStage.classList.add('hidden');
        resultStage.classList.add('hidden');
      } else {
        loginStage.classList.add('hidden');
        examStage.classList.add('hidden');
        resultStage.classList.add('hidden');
        adminStage.classList.remove('hidden');
        renderAdminQuestionTable();
      }
    });

    // Candidate registration & exam start
    candidateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const regNo = document.getElementById('candRegNo').value.trim();
      const name = document.getElementById('candName').value.trim();
      const dept = document.getElementById('candDept').value;

      if (!regNo || !name) {
        showToast('Please fill in candidate registration details.', 'danger');
        return;
      }

      candidate = { regNo, name, dept };
      startExam();
    });

    // Navigation
    btnNext.addEventListener('click', () => {
      if (currentQIndex < examData.questions.length - 1) {
        currentQIndex++;
        renderCurrentQuestion();
        renderPalette();
      }
    });

    btnPrev.addEventListener('click', () => {
      if (currentQIndex > 0) {
        currentQIndex--;
        renderCurrentQuestion();
        renderPalette();
      }
    });

    btnClearAnswer.addEventListener('click', () => {
      const q = examData.questions[currentQIndex];
      delete userAnswers[q.id];
      renderCurrentQuestion();
      renderPalette();
      updateSummaryStats();
      showToast('Response cleared for this question.', 'info');
    });

    btnFlagReview.addEventListener('click', () => {
      const q = examData.questions[currentQIndex];
      if (flaggedQuestions.has(q.id)) {
        flaggedQuestions.delete(q.id);
      } else {
        flaggedQuestions.add(q.id);
      }
      renderCurrentQuestion();
      renderPalette();
    });

    btnSubmitExam.addEventListener('click', () => {
      const answered = Object.keys(userAnswers).length;
      const total = examData.questions.length;
      if (confirm(`You have answered ${answered} of ${total} questions. Are you sure you want to finish and submit the exam?`)) {
        submitExam();
      }
    });

    btnRetake.addEventListener('click', () => {
      resultStage.classList.add('hidden');
      loginStage.classList.remove('hidden');
    });

    // Admin Controls
    btnAddQuestion.addEventListener('click', () => openQuestionModal(null));

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        questionModal.classList.add('hidden');
      });
    });

    questionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = formQId.value ? parseInt(formQId.value, 10) : Date.now();
      const text = formQText.value.trim();
      const options = [
        formOpt0.value.trim(),
        formOpt1.value.trim(),
        formOpt2.value.trim(),
        formOpt3.value.trim()
      ];
      const correct = parseInt(formCorrect.value, 10);
      const explanation = formExplanation.value.trim();

      if (formQId.value) {
        const idx = examData.questions.findIndex(q => q.id === id);
        if (idx !== -1) {
          examData.questions[idx] = { id, text, options, correct, explanation };
          showToast('Question updated successfully!', 'success');
        }
      } else {
        examData.questions.push({ id, text, options, correct, explanation });
        showToast('New question added to bank!', 'success');
      }

      saveData();
      questionModal.classList.add('hidden');
      renderAdminQuestionTable();
    });

    adminQuestionsTbody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-q');
      const delBtn = e.target.closest('.btn-del-q');

      if (editBtn) {
        const id = parseInt(editBtn.dataset.id, 10);
        const q = examData.questions.find(item => item.id === id);
        if (q) openQuestionModal(q);
      } else if (delBtn) {
        const id = parseInt(delBtn.dataset.id, 10);
        if (confirm('Are you sure you want to delete this question?')) {
          examData.questions = examData.questions.filter(q => q.id !== id);
          saveData();
          renderAdminQuestionTable();
          showToast('Question deleted.', 'info');
        }
      }
    });

    btnSaveSettings.addEventListener('click', () => {
      const duration = parseInt(settingDuration.value, 10);
      const passPct = parseInt(settingPassPercent.value, 10);

      if (duration >= 1 && duration <= 180 && passPct >= 10 && passPct <= 90) {
        examData.examConfig.durationMinutes = duration;
        examData.examConfig.passPercentage = passPct;
        saveData();
        showToast('Exam configuration updated!', 'success');
      } else {
        showToast('Please check duration (1-180 min) and pass threshold (10-90%).', 'danger');
      }
    });
  }

  function showToast(msg, type = 'info') {
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
