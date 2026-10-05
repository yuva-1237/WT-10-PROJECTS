/**
 * Student Academic Management System - Core Application Logic
 * Prathyusha Engineering College - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_academic_system_data';

  // State
  let appData = {
    institution: 'Prathyusha Engineering College',
    departments: [
      'Computer Science and Engineering',
      'Information Technology',
      'Computer Science and Business Systems',
      'Electronics and Communication Engineering'
    ],
    subjects: [],
    students: []
  };

  let activeStudentForMarks = null;

  // DOM Elements
  const roleSwitch = document.getElementById('roleSwitch');
  const adminView = document.getElementById('adminView');
  const studentView = document.getElementById('studentView');

  // Admin View Elements
  const kpiTotalStudents = document.getElementById('kpiTotalStudents');
  const kpiTotalSubjects = document.getElementById('kpiTotalSubjects');
  const kpiAvgCgpa = document.getElementById('kpiAvgCgpa');
  const kpiPassRate = document.getElementById('kpiPassRate');
  const searchInput = document.getElementById('searchInput');
  const deptFilter = document.getElementById('deptFilter');
  const yearFilter = document.getElementById('yearFilter');
  const recordCountBadge = document.getElementById('recordCountBadge');
  const studentsTableBody = document.getElementById('studentsTableBody');

  // Modals & Forms
  const studentModal = document.getElementById('studentModal');
  const studentForm = document.getElementById('studentForm');
  const studentFormMode = document.getElementById('studentFormMode');
  const formStudentId = document.getElementById('formStudentId');
  const formStudentName = document.getElementById('formStudentName');
  const formDepartment = document.getElementById('formDepartment');
  const formYear = document.getElementById('formYear');
  const formEmail = document.getElementById('formEmail');
  const formPhone = document.getElementById('formPhone');

  const marksModal = document.getElementById('marksModal');
  const marksForm = document.getElementById('marksForm');
  const marksModalTitle = document.getElementById('marksModalTitle');
  const marksModalSubtitle = document.getElementById('marksModalSubtitle');
  const marksEntryTbody = document.getElementById('marksEntryTbody');

  const subjectModal = document.getElementById('subjectModal');
  const subjectForm = document.getElementById('subjectForm');
  const subjCode = document.getElementById('subjCode');
  const subjName = document.getElementById('subjName');
  const subjCredits = document.getElementById('subjCredits');

  // Student View Elements
  const studentSelect = document.getElementById('studentSelect');
  const btnLoadStudent = document.getElementById('btnLoadStudent');
  const studentProfileCard = document.getElementById('studentProfileCard');
  const spName = document.getElementById('spName');
  const spId = document.getElementById('spId');
  const spDept = document.getElementById('spDept');
  const spYear = document.getElementById('spYear');
  const spEmail = document.getElementById('spEmail');
  const spPhone = document.getElementById('spPhone');
  const spCgpa = document.getElementById('spCgpa');
  const studentMarksTableBody = document.getElementById('studentMarksTableBody');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION & STORAGE ---
  async function initApp() {
    setupEventListeners();
    await loadInitialData();
    populateDropdowns();
    renderAdminDashboard();
    renderStudentDropdown();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        appData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed, loading fresh seed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        appData = await res.json();
        saveData();
      }
    } catch (err) {
      console.log('Using default in-memory state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }

  // --- GRADE & CGPA CALCULATIONS ---
  function getGradeInfo(total) {
    if (total >= 90) return { grade: 'O', point: 10, class: 'badge-grade-o' };
    if (total >= 80) return { grade: 'A+', point: 9, class: 'badge-grade-ap' };
    if (total >= 70) return { grade: 'A', point: 8, class: 'badge-grade-a' };
    if (total >= 60) return { grade: 'B+', point: 7, class: 'badge-grade-bp' };
    if (total >= 50) return { grade: 'B', point: 6, class: 'badge-grade-b' };
    if (total >= 45) return { grade: 'C', point: 5, class: 'badge-grade-c' };
    return { grade: 'U', point: 0, class: 'badge-grade-u' };
  }

  function getSubjectsMap() {
    const map = {};
    appData.subjects.forEach(s => {
      map[s.code] = s;
    });
    return map;
  }

  function calculateStudentCGPA(student) {
    if (!student.records || student.records.length === 0) return '0.00';
    const subMap = getSubjectsMap();
    let totalPoints = 0;
    let totalCredits = 0;

    student.records.forEach(rec => {
      const total = Number(rec.internal || 0) + Number(rec.external || 0);
      const gradeInfo = getGradeInfo(total);
      const credits = subMap[rec.subjectCode]?.credits || 3;
      totalPoints += gradeInfo.point * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  }

  function isStudentPassed(student) {
    if (!student.records || student.records.length === 0) return false;
    return student.records.every(rec => {
      const total = Number(rec.internal || 0) + Number(rec.external || 0);
      return total >= 45;
    });
  }

  // --- RENDERING & UI UPDATES ---
  function populateDropdowns() {
    deptFilter.innerHTML = '<option value="">All Departments</option>';
    formDepartment.innerHTML = '';

    appData.departments.forEach(dept => {
      const opt1 = document.createElement('option');
      opt1.value = dept;
      opt1.textContent = dept;
      deptFilter.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = dept;
      opt2.textContent = dept;
      formDepartment.appendChild(opt2);
    });
  }

  function renderAdminDashboard() {
    // Calculate KPIs dynamically
    const totalStudents = appData.students.length;
    kpiTotalStudents.textContent = totalStudents;
    kpiTotalSubjects.textContent = appData.subjects.length;

    if (totalStudents > 0) {
      let cgpaSum = 0;
      let passCount = 0;
      appData.students.forEach(s => {
        cgpaSum += parseFloat(calculateStudentCGPA(s));
        if (isStudentPassed(s)) passCount++;
      });
      kpiAvgCgpa.textContent = (cgpaSum / totalStudents).toFixed(2);
      kpiPassRate.textContent = `${Math.round((passCount / totalStudents) * 100)}%`;
    } else {
      kpiAvgCgpa.textContent = '0.00';
      kpiPassRate.textContent = '0%';
    }

    // Filter Students
    const query = searchInput.value.trim().toLowerCase();
    const selDept = deptFilter.value;
    const selYear = yearFilter.value;

    const filtered = appData.students.filter(s => {
      const matchesSearch = !query || 
        s.name.toLowerCase().includes(query) || 
        s.id.toLowerCase().includes(query);
      const matchesDept = !selDept || s.department === selDept;
      const matchesYear = !selYear || s.year === selYear;
      return matchesSearch && matchesDept && matchesYear;
    });

    recordCountBadge.textContent = `${filtered.length} of ${totalStudents} Records`;
    studentsTableBody.innerHTML = '';

    if (filtered.length === 0) {
      studentsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No student records matching current filters.
          </td>
        </tr>`;
      return;
    }

    filtered.forEach(student => {
      const cgpa = calculateStudentCGPA(student);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${student.id}</strong></td>
        <td>${student.name}</td>
        <td>${student.department}</td>
        <td><span class="badge" style="background:#f1f5f9; color:#334155;">${student.year}</span></td>
        <td>
          <div style="font-size:0.825rem;">${student.email}</div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${student.phone}</div>
        </td>
        <td><span class="badge badge-grade-o">${cgpa}</span></td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline btn-sm btn-marks" data-id="${student.id}" title="Evaluation & Marks">📝 Marks</button>
            <button class="btn btn-outline btn-sm btn-edit" data-id="${student.id}" title="Edit Profile">✏️ Edit</button>
            <button class="btn btn-danger btn-sm btn-del" data-id="${student.id}" title="Delete Record">🗑️</button>
          </div>
        </td>
      `;
      studentsTableBody.appendChild(tr);
    });
  }

  function renderStudentDropdown() {
    studentSelect.innerHTML = '';
    if (appData.students.length === 0) {
      studentSelect.innerHTML = '<option value="">No students available</option>';
      return;
    }
    appData.students.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.id} - ${s.name} (${s.department})`;
      studentSelect.appendChild(opt);
    });
  }

  function displayStudentPortal(studentId) {
    const student = appData.students.find(s => s.id === studentId);
    if (!student) {
      showToast('Student not found.', 'danger');
      return;
    }

    spName.textContent = student.name;
    spId.textContent = student.id;
    spDept.textContent = student.department;
    spYear.textContent = student.year;
    spEmail.textContent = student.email;
    spPhone.textContent = student.phone;

    const cgpa = calculateStudentCGPA(student);
    spCgpa.textContent = cgpa;

    studentMarksTableBody.innerHTML = '';
    const subMap = getSubjectsMap();

    if (!student.records || student.records.length === 0) {
      studentMarksTableBody.innerHTML = `
        <tr><td colspan="10" style="text-align: center; color: var(--text-muted);">No marks recorded for this student yet.</td></tr>`;
      studentProfileCard.classList.remove('hidden');
      return;
    }

    student.records.forEach(rec => {
      const sub = subMap[rec.subjectCode] || { name: rec.subjectCode, credits: 3 };
      const internal = Number(rec.internal || 0);
      const external = Number(rec.external || 0);
      const total = internal + external;
      const gradeInfo = getGradeInfo(total);
      const att = Number(rec.attendance || 0);
      const pass = total >= 45;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${rec.subjectCode}</strong></td>
        <td>${sub.name}</td>
        <td>${sub.credits}</td>
        <td>${internal}</td>
        <td>${external}</td>
        <td><strong>${total}</strong></td>
        <td><span class="badge ${gradeInfo.class}">${gradeInfo.grade}</span></td>
        <td>${gradeInfo.point}</td>
        <td>
          <span class="badge ${att >= 75 ? 'badge-success' : 'badge-danger'}">${att}%</span>
        </td>
        <td>
          <span class="badge ${pass ? 'badge-success' : 'badge-danger'}">${pass ? 'PASS' : 'FAIL / RA'}</span>
        </td>
      `;
      studentMarksTableBody.appendChild(tr);
    });

    studentProfileCard.classList.remove('hidden');
  }

  // --- MODAL CONTROLS ---
  function openAddStudentModal() {
    studentForm.reset();
    studentFormMode.value = 'create';
    formStudentId.disabled = false;
    document.getElementById('studentModalTitle').textContent = 'Add New Student';
    clearValidationErrors();
    studentModal.classList.remove('hidden');
  }

  function openEditStudentModal(id) {
    const student = appData.students.find(s => s.id === id);
    if (!student) return;

    studentForm.reset();
    clearValidationErrors();
    studentFormMode.value = 'edit';
    formStudentId.value = student.id;
    formStudentId.disabled = true; // Primary Key
    formStudentName.value = student.name;
    formDepartment.value = student.department;
    formYear.value = student.year;
    formEmail.value = student.email;
    formPhone.value = student.phone;

    document.getElementById('studentModalTitle').textContent = `Edit Student: ${student.id}`;
    studentModal.classList.remove('hidden');
  }

  function openMarksModal(id) {
    const student = appData.students.find(s => s.id === id);
    if (!student) return;
    activeStudentForMarks = student;

    marksModalTitle.textContent = `Academic Evaluation: ${student.name}`;
    marksModalSubtitle.textContent = `Registration ID: ${student.id} | Department: ${student.department}`;

    const subMap = getSubjectsMap();
    marksEntryTbody.innerHTML = '';

    // Ensure all registered subjects have a slot
    appData.subjects.forEach(sub => {
      const existing = (student.records || []).find(r => r.subjectCode === sub.code) || {
        subjectCode: sub.code,
        internal: 0,
        external: 0,
        attendance: 85
      };

      const total = Number(existing.internal) + Number(existing.external);
      const gradeInfo = getGradeInfo(total);

      const tr = document.createElement('tr');
      tr.dataset.subCode = sub.code;
      tr.innerHTML = `
        <td><strong>${sub.code}</strong> - ${sub.name}</td>
        <td>${sub.credits}</td>
        <td>
          <input type="number" class="form-input mark-internal" min="0" max="40" value="${existing.internal}" style="width: 85px;" required>
        </td>
        <td>
          <input type="number" class="form-input mark-external" min="0" max="60" value="${existing.external}" style="width: 85px;" required>
        </td>
        <td class="total-cell"><strong>${total}</strong></td>
        <td><span class="badge ${gradeInfo.class} grade-badge">${gradeInfo.grade} (${gradeInfo.point})</span></td>
        <td>
          <input type="number" class="form-input mark-att" min="0" max="100" value="${existing.attendance}" style="width: 85px;" required>
        </td>
      `;
      marksEntryTbody.appendChild(tr);
    });

    marksModal.classList.remove('hidden');
  }

  function clearValidationErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Portal View Toggle
    roleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'admin') {
        adminView.classList.remove('hidden');
        studentView.classList.add('hidden');
        renderAdminDashboard();
      } else {
        adminView.classList.add('hidden');
        studentView.classList.remove('hidden');
        renderStudentDropdown();
        if (studentSelect.value) displayStudentPortal(studentSelect.value);
      }
    });

    // Admin Filters
    searchInput.addEventListener('input', renderAdminDashboard);
    deptFilter.addEventListener('change', renderAdminDashboard);
    yearFilter.addEventListener('change', renderAdminDashboard);

    // Modal Triggers
    document.getElementById('btnAddStudent').addEventListener('click', openAddStudentModal);
    document.getElementById('btnAddSubject').addEventListener('click', () => {
      subjectForm.reset();
      clearValidationErrors();
      subjectModal.classList.remove('hidden');
    });

    // Close Modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // Student Form Submit (Add / Edit)
    studentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearValidationErrors();

      const mode = studentFormMode.value;
      const id = formStudentId.value.trim().toUpperCase();
      const name = formStudentName.value.trim();
      const dept = formDepartment.value;
      const year = formYear.value;
      const email = formEmail.value.trim();
      const phone = formPhone.value.trim();

      let hasError = false;

      // Validation
      if (!id || id.length < 3) {
        document.getElementById('errStudentId').textContent = 'Student ID must be at least 3 characters.';
        hasError = true;
      }
      if (mode === 'create' && appData.students.some(s => s.id.toUpperCase() === id)) {
        document.getElementById('errStudentId').textContent = 'This Student ID already exists.';
        hasError = true;
      }
      if (!name || name.length < 2) {
        document.getElementById('errStudentName').textContent = 'Please enter a valid full name.';
        hasError = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('errEmail').textContent = 'Please enter a valid email address.';
        hasError = true;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        document.getElementById('errPhone').textContent = 'Phone number must be a 10-digit number starting with 6-9.';
        hasError = true;
      }

      if (hasError) return;

      if (mode === 'create') {
        const defaultRecords = appData.subjects.map(s => ({
          subjectCode: s.code,
          internal: 30,
          external: 45,
          attendance: 90
        }));

        appData.students.unshift({
          id,
          name,
          department: dept,
          year,
          email,
          phone,
          records: defaultRecords
        });
        showToast(`Student ${name} successfully enrolled!`, 'success');
      } else {
        const idx = appData.students.findIndex(s => s.id === id);
        if (idx !== -1) {
          appData.students[idx] = {
            ...appData.students[idx],
            name,
            department: dept,
            year,
            email,
            phone
          };
          showToast(`Student ${name} updated successfully!`, 'success');
        }
      }

      saveData();
      studentModal.classList.add('hidden');
      renderAdminDashboard();
      renderStudentDropdown();
    });

    // Subject Form Submit
    subjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = subjCode.value.trim().toUpperCase();
      const name = subjName.value.trim();
      const credits = parseInt(subjCredits.value, 10);

      if (appData.subjects.some(s => s.code === code)) {
        document.getElementById('errSubjCode').textContent = 'Subject Code already exists.';
        return;
      }

      appData.subjects.push({ code, name, credits });
      saveData();
      subjectModal.classList.add('hidden');
      renderAdminDashboard();
      showToast(`Subject ${code} - ${name} added!`, 'success');
    });

    // Marks Input Live Calculation
    marksEntryTbody.addEventListener('input', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const intInput = row.querySelector('.mark-internal');
      const extInput = row.querySelector('.mark-external');
      const totalCell = row.querySelector('.total-cell');
      const gradeBadge = row.querySelector('.grade-badge');

      let internal = Math.max(0, Math.min(40, parseInt(intInput.value, 10) || 0));
      let external = Math.max(0, Math.min(60, parseInt(extInput.value, 10) || 0));
      intInput.value = internal;
      extInput.value = external;

      const total = internal + external;
      totalCell.innerHTML = `<strong>${total}</strong>`;

      const gradeInfo = getGradeInfo(total);
      gradeBadge.className = `badge ${gradeInfo.class} grade-badge`;
      gradeBadge.textContent = `${gradeInfo.grade} (${gradeInfo.point})`;
    });

    // Marks Form Submit
    marksForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeStudentForMarks) return;

      const newRecords = [];
      const rows = marksEntryTbody.querySelectorAll('tr');

      rows.forEach(row => {
        const subCode = row.dataset.subCode;
        const internal = parseInt(row.querySelector('.mark-internal').value, 10) || 0;
        const external = parseInt(row.querySelector('.mark-external').value, 10) || 0;
        const attendance = parseInt(row.querySelector('.mark-att').value, 10) || 0;

        newRecords.push({
          subjectCode: subCode,
          internal,
          external,
          attendance
        });
      });

      activeStudentForMarks.records = newRecords;
      saveData();
      marksModal.classList.add('hidden');
      renderAdminDashboard();
      showToast(`Marks and attendance saved for ${activeStudentForMarks.name}!`, 'success');
    });

    // Table Actions (Delegate click)
    studentsTableBody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit');
      const marksBtn = e.target.closest('.btn-marks');
      const delBtn = e.target.closest('.btn-del');

      if (editBtn) {
        openEditStudentModal(editBtn.dataset.id);
      } else if (marksBtn) {
        openMarksModal(marksBtn.dataset.id);
      } else if (delBtn) {
        const id = delBtn.dataset.id;
        const student = appData.students.find(s => s.id === id);
        if (confirm(`Are you sure you want to delete student ${student.name} (${id})?`)) {
          appData.students = appData.students.filter(s => s.id !== id);
          saveData();
          renderAdminDashboard();
          renderStudentDropdown();
          showToast(`Student record ${id} deleted.`, 'info');
        }
      }
    });

    // Reset Data to Default
    document.getElementById('btnResetData').addEventListener('click', async () => {
      if (confirm('Reset academic records to initial sample state? Any new additions will be replaced.')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        populateDropdowns();
        renderAdminDashboard();
        renderStudentDropdown();
        showToast('All records restored to initial academic seed.', 'success');
      }
    });

    // Student View Lookup
    btnLoadStudent.addEventListener('click', () => {
      if (studentSelect.value) {
        displayStudentPortal(studentSelect.value);
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

  // Self-start
  document.addEventListener('DOMContentLoaded', initApp);
})();
