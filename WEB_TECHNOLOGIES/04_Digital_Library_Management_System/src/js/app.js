/**
 * Digital Library Management System - Application Logic
 * Prathyusha Central Library - Web Technologies
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wt_library_system_data';

  // State
  let libData = {
    libraryName: "Prathyusha Central Digital Library",
    dailyFineRate: 5,
    standardLoanDays: 14,
    categories: [
      "Computer Science",
      "Information Technology",
      "Electronics & Communication",
      "Mechanical Engineering",
      "Mathematics",
      "General Literature"
    ],
    books: [],
    issues: []
  };

  let activeBookForIssue = null;
  let activeIssueForReturn = null;

  // DOM Elements
  const portalRoleSwitch = document.getElementById('portalRoleSwitch');
  const studentView = document.getElementById('studentView');
  const librarianView = document.getElementById('librarianView');
  const studentUserSelect = document.getElementById('studentUserSelect');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabCatalog = document.getElementById('tabCatalog');
  const tabIssued = document.getElementById('tabIssued');

  // Search & Filters
  const bookSearchInput = document.getElementById('bookSearchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const catalogCountBadge = document.getElementById('catalogCountBadge');
  const booksGrid = document.getElementById('booksGrid');
  const myIssuedBadge = document.getElementById('myIssuedBadge');
  const myLoansTbody = document.getElementById('myLoansTbody');

  // Admin KPI & Elements
  const kpiTotalTitles = document.getElementById('kpiTotalTitles');
  const kpiTotalCopies = document.getElementById('kpiTotalCopies');
  const kpiActiveLoans = document.getElementById('kpiActiveLoans');
  const kpiFinesCollected = document.getElementById('kpiFinesCollected');
  const adminBooksTbody = document.getElementById('adminBooksTbody');
  const adminCirculationTbody = document.getElementById('adminCirculationTbody');
  const btnAddBook = document.getElementById('btnAddBook');
  const btnResetLibrary = document.getElementById('btnResetLibrary');

  // Issue Modal
  const issueModal = document.getElementById('issueModal');
  const issueForm = document.getElementById('issueForm');
  const issueBookTitleSub = document.getElementById('issueBookTitleSub');
  const issueBookId = document.getElementById('issueBookId');
  const issueStudentName = document.getElementById('issueStudentName');
  const issueStudentId = document.getElementById('issueStudentId');
  const issueDate = document.getElementById('issueDate');
  const dueDate = document.getElementById('dueDate');

  // Return & Fine Modal
  const returnModal = document.getElementById('returnModal');
  const returnForm = document.getElementById('returnForm');
  const returnBookTitleSub = document.getElementById('returnBookTitleSub');
  const returnIssueId = document.getElementById('returnIssueId');
  const calcDueDate = document.getElementById('calcDueDate');
  const calcReturnDate = document.getElementById('calcReturnDate');
  const calcLateDays = document.getElementById('calcLateDays');
  const calcTotalFine = document.getElementById('calcTotalFine');

  // Book Add/Edit Modal
  const bookModal = document.getElementById('bookModal');
  const bookForm = document.getElementById('bookForm');
  const bookModalTitle = document.getElementById('bookModalTitle');
  const formBookMode = document.getElementById('formBookMode');
  const formBookId = document.getElementById('formBookId');
  const formTitle = document.getElementById('formTitle');
  const formAuthor = document.getElementById('formAuthor');
  const formCategory = document.getElementById('formCategory');
  const formIsbn = document.getElementById('formIsbn');
  const formQuantity = document.getElementById('formQuantity');
  const formShelf = document.getElementById('formShelf');

  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  async function init() {
    await loadInitialData();
    setupEventListeners();
    populateCategories();
    renderCatalog();
    renderMyLoans();
    renderLibrarianDashboard();
  }

  async function loadInitialData() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        libData = JSON.parse(cached);
        return;
      } catch (e) {
        console.warn('Storage parsing failed.');
      }
    }

    try {
      const res = await fetch('data/initial_data.json');
      if (res.ok) {
        libData = await res.json();
        saveData();
      }
    } catch (e) {
      console.warn('Using default seed state.');
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(libData));
  }

  function populateCategories() {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    formCategory.innerHTML = '';

    libData.categories.forEach(cat => {
      const opt1 = document.createElement('option');
      opt1.value = cat;
      opt1.textContent = cat;
      categoryFilter.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = cat;
      opt2.textContent = cat;
      formCategory.appendChild(opt2);
    });
  }

  // --- DYNAMIC FINE CALCULATION ---
  function computeFineDetails(dueDateStr, returnDateStr) {
    const due = new Date(dueDateStr);
    const ret = new Date(returnDateStr);
    // Reset times to midnight
    due.setHours(0, 0, 0, 0);
    ret.setHours(0, 0, 0, 0);

    const diffTime = ret.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        lateDays: diffDays,
        fine: diffDays * libData.dailyFineRate
      };
    }
    return { lateDays: 0, fine: 0 };
  }

  // --- RENDERING ---
  function renderCatalog() {
    const query = bookSearchInput.value.trim().toLowerCase();
    const selCat = categoryFilter.value;

    const filtered = libData.books.filter(b => {
      const matchesSearch = !query || 
        b.title.toLowerCase().includes(query) || 
        b.author.toLowerCase().includes(query) || 
        b.isbn.toLowerCase().includes(query);
      const matchesCat = !selCat || b.category === selCat;
      return matchesSearch && matchesCat;
    });

    catalogCountBadge.textContent = `${filtered.length} Titles Found`;
    booksGrid.innerHTML = '';

    if (filtered.length === 0) {
      booksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No catalog items match your search query.</div>`;
      return;
    }

    filtered.forEach(book => {
      const isAvailable = book.availableCopies > 0;
      const card = document.createElement('article');
      card.className = 'book-card';
      card.innerHTML = `
        <div>
          <div class="book-title">${book.title}</div>
          <div class="book-author">By ${book.author}</div>
          <div class="book-meta">
            <div class="book-meta-row">
              <span style="color:var(--text-muted);">Category:</span>
              <strong>${book.category}</strong>
            </div>
            <div class="book-meta-row">
              <span style="color:var(--text-muted);">ISBN:</span>
              <code>${book.isbn}</code>
            </div>
            <div class="book-meta-row">
              <span style="color:var(--text-muted);">Shelf Location:</span>
              <span>${book.shelf || 'Main Stacks'}</span>
            </div>
          </div>
        </div>
        <div class="book-footer">
          <div>
            <span class="badge ${isAvailable ? 'badge-available' : 'badge-out-of-stock'}">
              ${isAvailable ? `${book.availableCopies} of ${book.quantity} Available` : 'Out of Stock'}
            </span>
          </div>
          <button class="btn btn-primary btn-sm btn-issue-book" data-id="${book.id}" ${!isAvailable ? 'disabled' : ''}>
            ${isAvailable ? '📖 Issue Book' : 'Unavailable'}
          </button>
        </div>
      `;
      booksGrid.appendChild(card);
    });
  }

  function getActiveStudentInfo() {
    const text = studentUserSelect.options[studentUserSelect.selectedIndex].text;
    const parts = text.split(' - ');
    const id = parts[0];
    const name = parts[1].split(' (')[0];
    return { id, name };
  }

  function renderMyLoans() {
    const student = getActiveStudentInfo();
    const myIssues = libData.issues.filter(i => i.studentId === student.id);
    const activeLoans = myIssues.filter(i => i.status === 'Issued');

    myIssuedBadge.textContent = `${activeLoans.length} Active Loans`;
    myLoansTbody.innerHTML = '';

    if (myIssues.length === 0) {
      myLoansTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No library issue records for this student.</td></tr>`;
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    myIssues.forEach(issue => {
      const tr = document.createElement('tr');
      const isIssued = issue.status === 'Issued';
      
      let overdueBadge = '<span class="badge badge-ontime">Returned</span>';
      let fineDisplay = `₹${issue.finePaid || 0}`;

      if (isIssued) {
        const { lateDays, fine } = computeFineDetails(issue.dueDate, todayStr);
        if (lateDays > 0) {
          overdueBadge = `<span class="badge badge-overdue">${lateDays} Days Overdue</span>`;
          fineDisplay = `<strong style="color:var(--danger);">₹${fine} (Pending)</strong>`;
        } else {
          overdueBadge = `<span class="badge badge-ontime">Active Loan</span>`;
          fineDisplay = `₹0`;
        }
      }

      tr.innerHTML = `
        <td><strong>${issue.id}</strong></td>
        <td>${issue.bookTitle}</td>
        <td>${issue.issueDate}</td>
        <td><strong>${issue.dueDate}</strong></td>
        <td>${overdueBadge}</td>
        <td>${fineDisplay}</td>
        <td>
          ${isIssued ? `<button class="btn btn-secondary btn-sm btn-return-trigger" data-id="${issue.id}">🔄 Return Book</button>` : `<span style="font-size:0.8rem; color:var(--text-muted);">Completed</span>`}
        </td>
      `;
      myLoansTbody.appendChild(tr);
    });
  }

  function renderLibrarianDashboard() {
    // Dynamic KPIs
    const totalTitles = libData.books.length;
    let totalCopies = 0;
    let totalAvailable = 0;
    libData.books.forEach(b => {
      totalCopies += b.quantity;
      totalAvailable += b.availableCopies;
    });

    const activeLoans = libData.issues.filter(i => i.status === 'Issued').length;
    let totalFines = 0;
    libData.issues.forEach(i => {
      totalFines += (i.finePaid || 0);
    });

    kpiTotalTitles.textContent = totalTitles;
    kpiTotalCopies.textContent = totalCopies;
    kpiActiveLoans.textContent = activeLoans;
    kpiFinesCollected.textContent = `₹${totalFines}`;

    // Master Catalog Table
    adminBooksTbody.innerHTML = '';
    libData.books.forEach(book => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${book.id}</strong></td>
        <td>
          <div><strong>${book.title}</strong></div>
          <div style="font-size:0.775rem; color:var(--text-muted);">${book.author}</div>
        </td>
        <td><span class="badge" style="background:#fef3c7; color:#92400e;">${book.category}</span></td>
        <td><code>${book.isbn}</code></td>
        <td>${book.shelf || '-'}</td>
        <td>${book.quantity}</td>
        <td><strong style="color:${book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)'};">${book.availableCopies}</strong></td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline btn-sm btn-edit-book" data-id="${book.id}">Edit</button>
            <button class="btn btn-danger btn-sm btn-del-book" data-id="${book.id}">Delete</button>
          </div>
        </td>
      `;
      adminBooksTbody.appendChild(tr);
    });

    // Circulation Ledger Table
    adminCirculationTbody.innerHTML = '';
    libData.issues.forEach(iss => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${iss.id}</strong></td>
        <td>${iss.bookTitle}</td>
        <td>${iss.studentId} - ${iss.studentName}</td>
        <td>${iss.issueDate}</td>
        <td>${iss.dueDate}</td>
        <td>${iss.returnDate || '<em style="color:#64748b;">Not returned</em>'}</td>
        <td><strong>₹${iss.finePaid || 0}</strong></td>
        <td>
          <span class="badge ${iss.status === 'Issued' ? 'badge-primary' : 'badge-ontime'}">${iss.status}</span>
        </td>
      `;
      adminCirculationTbody.appendChild(tr);
    });
  }

  // --- MODAL TRIGGERS ---
  function openIssueModal(bookId) {
    const book = libData.books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      showToast('No copies available to issue.', 'danger');
      return;
    }

    activeBookForIssue = book;
    const student = getActiveStudentInfo();

    issueBookId.value = book.id;
    issueBookTitleSub.textContent = `${book.title} (ISBN: ${book.isbn})`;
    issueStudentName.value = student.name;
    issueStudentId.value = student.id;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    issueDate.value = todayStr;

    const due = new Date(today);
    due.setDate(due.getDate() + libData.standardLoanDays);
    dueDate.value = due.toISOString().split('T')[0];

    issueModal.classList.remove('hidden');
  }

  function openReturnModal(issueId) {
    const issue = libData.issues.find(i => i.id === issueId);
    if (!issue) return;
    activeIssueForReturn = issue;

    returnIssueId.value = issue.id;
    returnBookTitleSub.textContent = `${issue.bookTitle} | Borrowed by ${issue.studentName}`;
    calcDueDate.textContent = issue.dueDate;

    const todayStr = new Date().toISOString().split('T')[0];
    calcReturnDate.value = todayStr;

    updateDynamicFineDisplay();
    returnModal.classList.remove('hidden');
  }

  function updateDynamicFineDisplay() {
    if (!activeIssueForReturn) return;
    const retDateStr = calcReturnDate.value;
    if (!retDateStr) return;

    const { lateDays, fine } = computeFineDetails(activeIssueForReturn.dueDate, retDateStr);
    calcLateDays.textContent = `${lateDays} Day${lateDays === 1 ? '' : 's'}`;
    calcTotalFine.textContent = `₹${fine}`;
  }

  function openBookModal(editBook = null) {
    bookForm.reset();
    if (editBook) {
      bookModalTitle.textContent = 'Edit Book Details';
      formBookMode.value = 'edit';
      formBookId.value = editBook.id;
      formTitle.value = editBook.title;
      formAuthor.value = editBook.author;
      formCategory.value = editBook.category;
      formIsbn.value = editBook.isbn;
      formQuantity.value = editBook.quantity;
      formShelf.value = editBook.shelf || '';
    } else {
      bookModalTitle.textContent = 'Add New Book to Catalog';
      formBookMode.value = 'create';
      formBookId.value = '';
    }
    bookModal.classList.remove('hidden');
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Portal switch
    portalRoleSwitch.addEventListener('change', (e) => {
      if (e.target.value === 'student') {
        librarianView.classList.add('hidden');
        studentView.classList.remove('hidden');
        renderCatalog();
        renderMyLoans();
      } else {
        studentView.classList.add('hidden');
        librarianView.classList.remove('hidden');
        renderLibrarianDashboard();
      }
    });

    studentUserSelect.addEventListener('change', renderMyLoans);

    // Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.tab === 'tabCatalog') {
          tabCatalog.classList.remove('hidden');
          tabIssued.classList.add('hidden');
          renderCatalog();
        } else {
          tabCatalog.classList.add('hidden');
          tabIssued.classList.remove('hidden');
          renderMyLoans();
        }
      });
    });

    // Search & Filter
    bookSearchInput.addEventListener('input', renderCatalog);
    categoryFilter.addEventListener('change', renderCatalog);

    // Issue book button on card
    booksGrid.addEventListener('click', (e) => {
      const issueBtn = e.target.closest('.btn-issue-book');
      if (issueBtn) {
        openIssueModal(issueBtn.dataset.id);
      }
    });

    // Issue Date change adjusts Due Date automatically
    issueDate.addEventListener('change', () => {
      const iss = new Date(issueDate.value);
      if (!isNaN(iss)) {
        const due = new Date(iss);
        due.setDate(due.getDate() + libData.standardLoanDays);
        dueDate.value = due.toISOString().split('T')[0];
      }
    });

    // Issue Form Submit
    issueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeBookForIssue || activeBookForIssue.availableCopies <= 0) return;

      const student = getActiveStudentInfo();

      // Decrement available copies
      activeBookForIssue.availableCopies -= 1;

      const newIssue = {
        id: `ISS-${Date.now().toString().slice(-4)}`,
        bookId: activeBookForIssue.id,
        bookTitle: activeBookForIssue.title,
        studentId: student.id,
        studentName: student.name,
        issueDate: issueDate.value,
        dueDate: dueDate.value,
        returnDate: null,
        lateDays: 0,
        finePaid: 0,
        status: 'Issued'
      };

      libData.issues.unshift(newIssue);
      saveData();
      issueModal.classList.add('hidden');
      renderCatalog();
      renderMyLoans();
      renderLibrarianDashboard();
      showToast(`Book "${activeBookForIssue.title}" issued! Return by ${dueDate.value}.`, 'success');

      // Switch to issued tab
      tabBtns[1].click();
    });

    // My loans table return button
    myLoansTbody.addEventListener('click', (e) => {
      const retBtn = e.target.closest('.btn-return-trigger');
      if (retBtn) {
        openReturnModal(retBtn.dataset.id);
      }
    });

    // Dynamic Fine Update on Return Date picker change
    calcReturnDate.addEventListener('input', updateDynamicFineDisplay);
    calcReturnDate.addEventListener('change', updateDynamicFineDisplay);

    // Return Form Submit
    returnForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeIssueForReturn) return;

      const retDateStr = calcReturnDate.value;
      const { lateDays, fine } = computeFineDetails(activeIssueForReturn.dueDate, retDateStr);

      activeIssueForReturn.returnDate = retDateStr;
      activeIssueForReturn.lateDays = lateDays;
      activeIssueForReturn.finePaid = fine;
      activeIssueForReturn.status = 'Returned';

      // Restore book available copy
      const book = libData.books.find(b => b.id === activeIssueForReturn.bookId);
      if (book && book.availableCopies < book.quantity) {
        book.availableCopies += 1;
      }

      saveData();
      returnModal.classList.add('hidden');
      renderCatalog();
      renderMyLoans();
      renderLibrarianDashboard();

      if (fine > 0) {
        showToast(`Book returned with ${lateDays} days delay. Fine of ₹${fine} recorded.`, 'info');
      } else {
        showToast(`Book returned on time! No fine incurred.`, 'success');
      }
    });

    // Admin Book CRUD
    btnAddBook.addEventListener('click', () => openBookModal(null));

    adminBooksTbody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-book');
      const delBtn = e.target.closest('.btn-del-book');

      if (editBtn) {
        const book = libData.books.find(b => b.id === editBtn.dataset.id);
        if (book) openBookModal(book);
      } else if (delBtn) {
        const id = delBtn.dataset.id;
        const book = libData.books.find(b => b.id === id);
        if (confirm(`Delete book "${book.title}" from library inventory?`)) {
          libData.books = libData.books.filter(b => b.id !== id);
          saveData();
          renderCatalog();
          renderLibrarianDashboard();
          showToast(`Book ${id} removed.`, 'info');
        }
      }
    });

    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = formBookMode.value;
      const title = formTitle.value.trim();
      const author = formAuthor.value.trim();
      const category = formCategory.value;
      const isbn = formIsbn.value.trim();
      const qty = parseInt(formQuantity.value, 10);
      const shelf = formShelf.value.trim();

      if (mode === 'create') {
        const newBook = {
          id: `BK-${Date.now().toString().slice(-3)}`,
          title,
          author,
          category,
          isbn,
          quantity: qty,
          availableCopies: qty,
          shelf
        };
        libData.books.unshift(newBook);
        showToast(`Book "${title}" added to catalog.`, 'success');
      } else {
        const id = formBookId.value;
        const b = libData.books.find(item => item.id === id);
        if (b) {
          const diff = qty - b.quantity;
          b.title = title;
          b.author = author;
          b.category = category;
          b.isbn = isbn;
          b.quantity = qty;
          b.availableCopies = Math.max(0, b.availableCopies + diff);
          b.shelf = shelf;
          showToast(`Book "${title}" updated.`, 'success');
        }
      }

      saveData();
      bookModal.classList.add('hidden');
      renderCatalog();
      renderLibrarianDashboard();
    });

    // Close Modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close');
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // Reset Sample Data
    btnResetLibrary.addEventListener('click', async () => {
      if (confirm('Reset digital library catalog and issues to initial state?')) {
        localStorage.removeItem(STORAGE_KEY);
        await loadInitialData();
        populateCategories();
        renderCatalog();
        renderMyLoans();
        renderLibrarianDashboard();
        showToast('Library records reset to academic default.', 'success');
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
