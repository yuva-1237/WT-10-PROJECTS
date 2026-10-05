/**
 * Project 10: Hostel Management System
 * Student: Yuvathilagan
 * Subject: Web Technologies
 * Client Logic: Dual-role workflow, room allocation/transfers, leave & complaint processing, dynamic statistics
 */

(function () {
  'use strict';

  // Storage keys
  const STORAGE_ROOMS = 'pec_hostel_rooms';
  const STORAGE_STUDENTS = 'pec_hostel_students';
  const STORAGE_LEAVES = 'pec_hostel_leaves';
  const STORAGE_COMPLAINTS = 'pec_hostel_complaints';

  // Default seed data
  const DEFAULT_ROOMS = [
    { roomNo: '101', block: 'Block A (Boys)', floor: '1st Floor', capacity: 3, occupied: 3, available: 0, amenities: 'Attached Bath, Wi-Fi, Balcony' },
    { roomNo: '102', block: 'Block A (Boys)', floor: '1st Floor', capacity: 3, occupied: 2, available: 1, amenities: 'Attached Bath, Wi-Fi, Study Table' },
    { roomNo: '201', block: 'Block A (Boys)', floor: '2nd Floor', capacity: 4, occupied: 2, available: 2, amenities: 'Balcony, Air Cooler, Wi-Fi' },
    { roomNo: '202', block: 'Block A (Boys)', floor: '2nd Floor', capacity: 2, occupied: 0, available: 2, amenities: 'Study Table, Wardrobes, Wi-Fi' },
    { roomNo: '105', block: 'Block B (Girls)', floor: '1st Floor', capacity: 3, occupied: 1, available: 2, amenities: 'Attached Bath, Security Intercom, Wi-Fi' }
  ];

  const DEFAULT_STUDENTS = [
    {
      studentId: 'PEC2023CS001',
      name: 'Yuvathilagan M',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      gender: 'Male',
      roomNo: '101',
      block: 'Block A (Boys)',
      bedNo: 'Bed 1',
      phone: '9876543210',
      parentPhone: '9876543299',
      email: 'yuva.pec@gmail.com',
      feeStatus: 'Paid',
      feeAmount: 65000,
      feePaid: 65000
    },
    {
      studentId: 'PEC2023CS004',
      name: 'Rajesh K',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      gender: 'Male',
      roomNo: '101',
      block: 'Block A (Boys)',
      bedNo: 'Bed 2',
      phone: '9876543214',
      parentPhone: '9876543298',
      email: 'rajesh.k@gmail.com',
      feeStatus: 'Paid',
      feeAmount: 65000,
      feePaid: 65000
    },
    {
      studentId: 'PEC2023IT012',
      name: 'Sanjay Kumar',
      department: 'Information Technology',
      year: '3rd Year',
      gender: 'Male',
      roomNo: '101',
      block: 'Block A (Boys)',
      bedNo: 'Bed 3',
      phone: '9876543212',
      parentPhone: '9876543297',
      email: 'sanjay.it@gmail.com',
      feeStatus: 'Partial',
      feeAmount: 65000,
      feePaid: 40000
    },
    {
      studentId: 'PEC2023CS019',
      name: 'Arun V',
      department: 'Computer Science and Engineering',
      year: '3rd Year',
      gender: 'Male',
      roomNo: '102',
      block: 'Block A (Boys)',
      bedNo: 'Bed 1',
      phone: '9876543219',
      parentPhone: '9876543296',
      email: 'arun.v@gmail.com',
      feeStatus: 'Paid',
      feeAmount: 65000,
      feePaid: 65000
    },
    {
      studentId: 'PEC2023EC008',
      name: 'Dinesh M',
      department: 'Electronics and Communication Engineering',
      year: '2nd Year',
      gender: 'Male',
      roomNo: '102',
      block: 'Block A (Boys)',
      bedNo: 'Bed 2',
      phone: '9876543208',
      parentPhone: '9876543295',
      email: 'dinesh.ec@gmail.com',
      feeStatus: 'Pending',
      feeAmount: 65000,
      feePaid: 0
    },
    {
      studentId: 'PEC2024CS033',
      name: 'Karthik S',
      department: 'Computer Science and Engineering',
      year: '2nd Year',
      gender: 'Male',
      roomNo: 'Unallocated',
      block: 'None',
      bedNo: 'None',
      phone: '9876543233',
      parentPhone: '9876543294',
      email: 'karthik.s@gmail.com',
      feeStatus: 'Pending',
      feeAmount: 65000,
      feePaid: 0
    }
  ];

  const DEFAULT_LEAVES = [
    {
      id: 'LEV-501',
      studentId: 'PEC2023CS001',
      studentName: 'Yuvathilagan M',
      roomNo: '101',
      reason: 'Home visit for family festival and ancestral rituals',
      fromDate: '2026-10-12',
      toDate: '2026-10-16',
      parentApproved: true,
      status: 'Pending',
      submittedOn: '2026-10-04T10:00:00.000Z',
      remarks: ''
    },
    {
      id: 'LEV-502',
      studentId: 'PEC2023CS019',
      studentName: 'Arun V',
      roomNo: '102',
      reason: 'Orthopedic consultation and medical review',
      fromDate: '2026-10-06',
      toDate: '2026-10-08',
      parentApproved: true,
      status: 'Approved',
      submittedOn: '2026-10-03T15:20:00.000Z',
      remarks: 'Approved with parental consent verification'
    },
    {
      id: 'LEV-503',
      studentId: 'PEC2023IT012',
      studentName: 'Sanjay Kumar',
      roomNo: '101',
      reason: 'Weekend outing with classmates',
      fromDate: '2026-10-05',
      toDate: '2026-10-05',
      parentApproved: false,
      status: 'Rejected',
      submittedOn: '2026-10-03T18:00:00.000Z',
      remarks: 'Day outing rejected due to upcoming mid-semester examinations'
    }
  ];

  const DEFAULT_COMPLAINTS = [
    {
      id: 'CMP-701',
      studentId: 'PEC2023CS001',
      studentName: 'Yuvathilagan M',
      roomNo: '101',
      category: 'Electricity',
      description: 'Ceiling fan regulator stuck at low speed in Room 101.',
      submittedOn: '2026-10-03T09:15:00.000Z',
      status: 'In Progress'
    },
    {
      id: 'CMP-702',
      studentId: 'PEC2023EC008',
      studentName: 'Dinesh M',
      roomNo: '102',
      category: 'Plumbing',
      description: 'Bathroom washbasin drain pipe is leaking water onto floor.',
      submittedOn: '2026-10-04T11:45:00.000Z',
      status: 'Submitted'
    },
    {
      id: 'CMP-703',
      studentId: 'PEC2023CS004',
      studentName: 'Rajesh K',
      roomNo: '101',
      category: 'Wi-Fi',
      description: 'Wi-Fi access point in 1st floor corridor unstable during evening hours.',
      submittedOn: '2026-10-01T16:00:00.000Z',
      status: 'Resolved'
    }
  ];

  // In-memory data store
  let rooms = [];
  let students = [];
  let leaveRequests = [];
  let complaints = [];

  // Active state
  let currentRole = 'student'; // 'student' | 'admin'
  let currentStudentId = 'PEC2023CS001';
  let activeStudentSubTab = 'profile'; // 'profile' | 'leave' | 'complaints'
  let activeWardenSubTab = 'rooms'; // 'rooms' | 'allocations' | 'leaves' | 'complaints'

  // Application initialization
  function init() {
    loadData();
    bindEvents();
    renderAll();
  }

  function loadData() {
    const r = localStorage.getItem(STORAGE_ROOMS);
    rooms = r ? JSON.parse(r) : [...DEFAULT_ROOMS];

    const s = localStorage.getItem(STORAGE_STUDENTS);
    students = s ? JSON.parse(s) : [...DEFAULT_STUDENTS];

    const l = localStorage.getItem(STORAGE_LEAVES);
    leaveRequests = l ? JSON.parse(l) : [...DEFAULT_LEAVES];

    const c = localStorage.getItem(STORAGE_COMPLAINTS);
    complaints = c ? JSON.parse(c) : [...DEFAULT_COMPLAINTS];
  }

  function saveData() {
    localStorage.setItem(STORAGE_ROOMS, JSON.stringify(rooms));
    localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(students));
    localStorage.setItem(STORAGE_LEAVES, JSON.stringify(leaveRequests));
    localStorage.setItem(STORAGE_COMPLAINTS, JSON.stringify(complaints));
    renderStats();
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('alertToast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `alert-toast show ${type}`;
    setTimeout(() => {
      toast.className = 'alert-toast';
    }, 3500);
  }

  // Calculate and render the 5 mandatory metrics
  function renderStats() {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.occupied > 0).length;
    const availableRooms = rooms.filter(r => r.available > 0).length;
    const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
    const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

    const elTotal = document.getElementById('statTotalRooms');
    const elOcc = document.getElementById('statOccupiedRooms');
    const elAvail = document.getElementById('statAvailableRooms');
    const elLeaves = document.getElementById('statPendingLeaves');
    const elComplaints = document.getElementById('statPendingComplaints');

    if (elTotal) elTotal.textContent = totalRooms;
    if (elOcc) elOcc.textContent = occupiedRooms;
    if (elAvail) elAvail.textContent = availableRooms;
    if (elLeaves) elLeaves.textContent = pendingLeaves;
    if (elComplaints) elComplaints.textContent = pendingComplaints;
  }

  // RENDER MASTER
  function renderAll() {
    renderStats();
    if (currentRole === 'student') {
      renderStudentView();
    } else {
      renderWardenView();
    }
  }

  // ==========================================
  // STUDENT PORTAL RENDERING
  // ==========================================
  function renderStudentView() {
    const student = students.find(s => s.studentId === currentStudentId) || students[0];
    if (!student) return;

    // Student profile details
    const avatar = document.getElementById('studentAvatar');
    if (avatar) avatar.textContent = student.name.charAt(0);

    const nameEl = document.getElementById('studentName');
    if (nameEl) nameEl.textContent = student.name;

    const subEl = document.getElementById('studentSub');
    if (subEl) subEl.textContent = `${student.studentId} • ${student.department} (${student.year})`;

    const roomVal = document.getElementById('studentRoomVal');
    if (roomVal) roomVal.textContent = student.roomNo === 'Unallocated' ? 'Not Allocated' : `${student.roomNo} (${student.block})`;

    const bedVal = document.getElementById('studentBedVal');
    if (bedVal) bedVal.textContent = student.bedNo;

    const phoneVal = document.getElementById('studentPhoneVal');
    if (phoneVal) phoneVal.textContent = student.phone;

    const parentVal = document.getElementById('studentParentVal');
    if (parentVal) parentVal.textContent = student.parentPhone;

    // Fee card
    const feeStatusBadge = document.getElementById('studentFeeStatusBadge');
    if (feeStatusBadge) {
      feeStatusBadge.textContent = student.feeStatus;
      feeStatusBadge.className = `badge ${student.feeStatus === 'Paid' ? 'badge-paid' : student.feeStatus === 'Partial' ? 'badge-partial-fee' : 'badge-pending'}`;
    }

    const feeAmountVal = document.getElementById('studentFeeAmountVal');
    if (feeAmountVal) feeAmountVal.textContent = `₹${student.feeAmount.toLocaleString()}`;

    const feePaidVal = document.getElementById('studentFeePaidVal');
    if (feePaidVal) feePaidVal.textContent = `₹${student.feePaid.toLocaleString()}`;

    const feeDueVal = document.getElementById('studentFeeDueVal');
    if (feeDueVal) feeDueVal.textContent = `₹${(student.feeAmount - student.feePaid).toLocaleString()}`;

    // Room & Roommates
    const roomInfo = rooms.find(r => r.roomNo === student.roomNo);
    const roomAmenitiesEl = document.getElementById('studentRoomAmenities');
    if (roomAmenitiesEl) roomAmenitiesEl.textContent = roomInfo ? roomInfo.amenities : 'Standard Bed & Desk';

    const roommatesList = document.getElementById('studentRoommatesList');
    if (roommatesList) {
      if (!student.roomNo || student.roomNo === 'Unallocated') {
        roommatesList.innerHTML = `<p style="color: #64748b; font-size: 0.88rem;">No roommates assigned yet.</p>`;
      } else {
        const mates = students.filter(s => s.roomNo === student.roomNo && s.studentId !== student.studentId);
        if (mates.length === 0) {
          roommatesList.innerHTML = `<p style="color: #64748b; font-size: 0.88rem;">No other roommates currently allocated to this room.</p>`;
        } else {
          roommatesList.innerHTML = mates.map(m => `
            <div class="roommate-item">
              <div class="roommate-info">
                <span style="font-size: 1.2rem;">🧑‍🎓</span>
                <div>
                  <strong>${m.name}</strong>
                  <div style="font-size: 0.78rem; color: #64748b;">${m.studentId} • ${m.department}</div>
                </div>
              </div>
              <span class="roommate-badge">${m.bedNo}</span>
            </div>
          `).join('');
        }
      }
    }

    // Leave history
    const leaveTbody = document.getElementById('studentLeavesTbody');
    if (leaveTbody) {
      const myLeaves = leaveRequests.filter(l => l.studentId === student.studentId);
      if (myLeaves.length === 0) {
        leaveTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 1.5rem;">No leave requests filed yet.</td></tr>`;
      } else {
        leaveTbody.innerHTML = myLeaves.map(l => {
          let badgeClass = 'badge-partial';
          if (l.status === 'Approved') badgeClass = 'badge-vacant';
          if (l.status === 'Rejected') badgeClass = 'badge-occupied';
          return `
            <tr>
              <td><code>${l.id}</code></td>
              <td>${l.fromDate} to ${l.toDate}</td>
              <td>${l.reason}</td>
              <td>${new Date(l.submittedOn).toLocaleDateString()}</td>
              <td><span class="badge ${badgeClass}">${l.status}</span></td>
              <td>${l.remarks || '-'}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // Complaints history
    const complaintsTbody = document.getElementById('studentComplaintsTbody');
    if (complaintsTbody) {
      const myComplaints = complaints.filter(c => c.studentId === student.studentId);
      if (myComplaints.length === 0) {
        complaintsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 1.5rem;">No maintenance grievances filed yet.</td></tr>`;
      } else {
        complaintsTbody.innerHTML = myComplaints.map(c => {
          let badgeClass = 'badge-partial';
          if (c.status === 'Resolved') badgeClass = 'badge-vacant';
          if (c.status === 'Submitted') badgeClass = 'badge-occupied';
          return `
            <tr>
              <td><code>${c.id}</code></td>
              <td><strong>${c.category}</strong></td>
              <td>${c.description}</td>
              <td>${new Date(c.submittedOn).toLocaleDateString()}</td>
              <td><span class="badge ${badgeClass}">${c.status}</span></td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // ==========================================
  // WARDEN / ADMIN PORTAL RENDERING
  // ==========================================
  function renderWardenView() {
    renderWardenRooms();
    renderWardenStudents();
    renderWardenLeaves();
    renderWardenComplaints();
  }

  function renderWardenRooms() {
    const grid = document.getElementById('wardenRoomsGrid');
    if (!grid) return;

    grid.innerHTML = rooms.map(r => {
      const percent = Math.min(100, Math.round((r.occupied / r.capacity) * 100));
      const isFull = r.available === 0;
      return `
        <div class="room-card">
          <div class="room-card-header">
            <div>
              <span class="room-number">Room ${r.roomNo}</span>
              <div class="room-block">${r.block} • ${r.floor}</div>
            </div>
            <span class="badge ${isFull ? 'badge-occupied' : 'badge-vacant'}">
              ${isFull ? 'Full' : `${r.available} Vacant`}
            </span>
          </div>
          <div class="room-specs">
            <div><strong>Capacity:</strong> ${r.capacity} Beds</div>
            <div><strong>Occupied:</strong> ${r.occupied} Beds</div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">✨ ${r.amenities}</div>
          </div>
          <div class="progress-container">
            <div class="progress-meta">
              <span>Occupancy</span>
              <span>${percent}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${isFull ? 'full' : ''}" style="width: ${percent}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderWardenStudents() {
    const tbody = document.getElementById('wardenStudentsTbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(s => {
      return `
        <tr>
          <td><code>${s.studentId}</code></td>
          <td><strong>${s.name}</strong></td>
          <td>${s.department} (${s.year})</td>
          <td>
            ${s.roomNo === 'Unallocated' 
              ? `<span class="badge badge-occupied">Unallocated</span>` 
              : `<strong>Room ${s.roomNo}</strong> (${s.bedNo})`}
          </td>
          <td>
            <span class="badge ${s.feeStatus === 'Paid' ? 'badge-paid' : s.feeStatus === 'Partial' ? 'badge-partial-fee' : 'badge-pending'}">${s.feeStatus}</span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.HostelApp.openAllocateModal('${s.studentId}')">
              ${s.roomNo === 'Unallocated' ? 'Allocate Room' : 'Change Room'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderWardenLeaves() {
    const tbody = document.getElementById('wardenLeavesTbody');
    if (!tbody) return;

    tbody.innerHTML = leaveRequests.map(l => {
      let badgeClass = 'badge-partial';
      if (l.status === 'Approved') badgeClass = 'badge-vacant';
      if (l.status === 'Rejected') badgeClass = 'badge-occupied';

      return `
        <tr>
          <td><code>${l.id}</code></td>
          <td><strong>${l.studentName}</strong> (${l.studentId})</td>
          <td>Room ${l.roomNo}</td>
          <td>${l.fromDate} to ${l.toDate}</td>
          <td>${l.reason}</td>
          <td><span class="badge ${badgeClass}">${l.status}</span></td>
          <td>
            ${l.status === 'Pending' ? `
              <button class="btn btn-success btn-sm" onclick="window.HostelApp.processLeave('${l.id}', 'Approved')">Approve</button>
              <button class="btn btn-danger btn-sm" onclick="window.HostelApp.processLeave('${l.id}', 'Rejected')">Reject</button>
            ` : `<span style="font-size: 0.8rem; color: #64748b;">${l.remarks || 'Processed'}</span>`}
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderWardenComplaints() {
    const tbody = document.getElementById('wardenComplaintsTbody');
    if (!tbody) return;

    tbody.innerHTML = complaints.map(c => {
      let badgeClass = 'badge-partial';
      if (c.status === 'Resolved') badgeClass = 'badge-vacant';
      if (c.status === 'Submitted') badgeClass = 'badge-occupied';

      return `
        <tr>
          <td><code>${c.id}</code></td>
          <td><strong>${c.category}</strong></td>
          <td>${c.studentName} (Room ${c.roomNo})</td>
          <td>${c.description}</td>
          <td>${new Date(c.submittedOn).toLocaleDateString()}</td>
          <td><span class="badge ${badgeClass}">${c.status}</span></td>
          <td>
            <select class="form-control" style="font-size: 0.8rem; padding: 0.3rem 0.5rem;" onchange="window.HostelApp.updateComplaintStatus('${c.id}', this.value)">
              <option value="Submitted" ${c.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
              <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================
  // STUDENT ACTIONS
  // ==========================================
  function handleLeaveSubmit(e) {
    e.preventDefault();
    const student = students.find(s => s.studentId === currentStudentId);
    if (!student) return;

    const reason = document.getElementById('leaveReason').value.trim();
    const fromDate = document.getElementById('leaveFromDate').value;
    const toDate = document.getElementById('leaveToDate').value;
    const parentConsent = document.getElementById('leaveParentConsent').checked;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to.getTime() < from.getTime()) {
      alert('Validation Error: Return date cannot precede departure date.');
      return;
    }
    if (!reason || reason.length < 5) {
      alert('Validation Error: Please provide a clear, valid reason for leave.');
      return;
    }

    const newLeave = {
      id: `LEV-${Math.floor(500 + Math.random() * 500)}`,
      studentId: student.studentId,
      studentName: student.name,
      roomNo: student.roomNo,
      reason,
      fromDate,
      toDate,
      parentApproved: parentConsent,
      status: 'Pending',
      submittedOn: new Date().toISOString(),
      remarks: ''
    };

    leaveRequests.unshift(newLeave);
    saveData();
    document.getElementById('leaveRequestForm').reset();
    renderStudentView();
    showToast(`Leave request ${newLeave.id} submitted for Warden approval.`, 'success');
  }

  function handleComplaintSubmit(e) {
    e.preventDefault();
    const student = students.find(s => s.studentId === currentStudentId);
    if (!student) return;

    const category = document.getElementById('complaintCategory').value;
    const desc = document.getElementById('complaintDesc').value.trim();

    if (!desc || desc.length < 5) {
      alert('Validation Error: Please describe the issue in detail.');
      return;
    }

    const newComplaint = {
      id: `CMP-${Math.floor(700 + Math.random() * 300)}`,
      studentId: student.studentId,
      studentName: student.name,
      roomNo: student.roomNo,
      category,
      description: desc,
      submittedOn: new Date().toISOString(),
      status: 'Submitted'
    };

    complaints.unshift(newComplaint);
    saveData();
    document.getElementById('complaintForm').reset();
    renderStudentView();
    showToast(`Grievance ${newComplaint.id} registered successfully.`, 'success');
  }

  // ==========================================
  // WARDEN ACTIONS
  // ==========================================
  function openAllocateModal(studentId) {
    const student = students.find(s => s.studentId === studentId);
    if (!student) return;

    document.getElementById('allocStudentId').value = student.studentId;
    document.getElementById('allocStudentName').textContent = student.name;
    document.getElementById('allocCurrentRoom').textContent = student.roomNo === 'Unallocated' ? 'None' : `Room ${student.roomNo} (${student.bedNo})`;

    const select = document.getElementById('allocTargetRoom');
    select.innerHTML = '<option value="">-- Choose Target Room --</option>' + rooms.map(r => `
      <option value="${r.roomNo}" ${r.available <= 0 && r.roomNo !== student.roomNo ? 'disabled' : ''}>
        Room ${r.roomNo} (${r.block} - ${r.available} Vacant / ${r.capacity} Max)
      </option>
    `).join('');

    openModal('allocateModal');
  }

  function handleRoomAllocationSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('allocStudentId').value;
    const targetRoomNo = document.getElementById('allocTargetRoom').value;

    const student = students.find(s => s.studentId === studentId);
    const targetRoom = rooms.find(r => r.roomNo === targetRoomNo);

    if (!student || !targetRoom) {
      alert('Please select a valid target room.');
      return;
    }

    if (student.roomNo === targetRoomNo) {
      alert('Student is already allocated to this room.');
      return;
    }

    if (targetRoom.available <= 0) {
      alert(`Cannot allocate: Room ${targetRoom.roomNo} has reached full capacity.`);
      return;
    }

    // Decrement previous room occupancy if student was in another room
    if (student.roomNo && student.roomNo !== 'Unallocated') {
      const prevRoom = rooms.find(r => r.roomNo === student.roomNo);
      if (prevRoom) {
        prevRoom.occupied = Math.max(0, prevRoom.occupied - 1);
        prevRoom.available = prevRoom.capacity - prevRoom.occupied;
      }
    }

    // Increment target room
    targetRoom.occupied += 1;
    targetRoom.available = targetRoom.capacity - targetRoom.occupied;

    // Update student
    student.roomNo = targetRoom.roomNo;
    student.block = targetRoom.block;
    student.bedNo = `Bed ${targetRoom.occupied}`;

    saveData();
    closeModal('allocateModal');
    renderWardenRooms();
    renderWardenStudents();
    showToast(`Room ${targetRoom.roomNo} successfully allocated to ${student.name}.`, 'success');
  }

  function processLeave(leaveId, status) {
    const leave = leaveRequests.find(l => l.id === leaveId);
    if (!leave) return;

    const remarks = prompt(`Enter remarks for ${status.toLowerCase()} leave ${leaveId}:`, status === 'Approved' ? 'Approved by Warden' : 'Rejected due to academic schedule');
    if (remarks === null) return; // cancelled

    leave.status = status;
    leave.remarks = remarks.trim();
    saveData();
    renderWardenLeaves();
    showToast(`Leave ${leaveId} marked as ${status}.`, status === 'Approved' ? 'success' : 'danger');
  }

  function updateComplaintStatus(complaintId, newStatus) {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;

    complaint.status = newStatus;
    saveData();
    renderWardenComplaints();
    showToast(`Complaint ${complaintId} status updated to ${newStatus}.`, 'success');
  }

  function handleAddStudentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('newStudentId').value.trim();
    const name = document.getElementById('newStudentName').value.trim();
    const dept = document.getElementById('newStudentDept').value;
    const year = document.getElementById('newStudentYear').value;
    const phone = document.getElementById('newStudentPhone').value.trim();
    const parentPhone = document.getElementById('newStudentParentPhone').value.trim();
    const email = document.getElementById('newStudentEmail').value.trim();

    if (!id || !name || !phone || !parentPhone || !email) {
      alert('Please fill in all mandatory student information fields.');
      return;
    }

    if (students.some(s => s.studentId.toUpperCase() === id.toUpperCase())) {
      alert(`Error: Student ID ${id} already exists in hostel registry.`);
      return;
    }

    const newStudent = {
      studentId: id.toUpperCase(),
      name,
      department: dept,
      year,
      gender: 'Male',
      roomNo: 'Unallocated',
      block: 'None',
      bedNo: 'None',
      phone,
      parentPhone,
      email,
      feeStatus: 'Pending',
      feeAmount: 65000,
      feePaid: 0
    };

    students.push(newStudent);
    saveData();
    closeModal('addStudentModal');
    renderWardenStudents();
    document.getElementById('addStudentForm').reset();
    showToast(`Student ${newStudent.name} registered. Proceed to allocate room.`, 'success');
  }

  // Modal helpers
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  }

  // Bind Event Listeners
  function bindEvents() {
    // Role switcher
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        currentRole = role;

        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.getElementById('studentPortalSection').style.display = role === 'student' ? 'block' : 'none';
        document.getElementById('wardenPortalSection').style.display = role === 'admin' ? 'block' : 'none';

        renderAll();
      });
    });

    // Student profile switch dropdown (for testing different students)
    const studentSelect = document.getElementById('activeStudentSelector');
    if (studentSelect) {
      studentSelect.innerHTML = students.map(s => `
        <option value="${s.studentId}" ${s.studentId === currentStudentId ? 'selected' : ''}>
          ${s.name} (${s.studentId} - ${s.roomNo === 'Unallocated' ? 'No Room' : `Room ${s.roomNo}`})
        </option>
      `).join('');

      studentSelect.addEventListener('change', (e) => {
        currentStudentId = e.target.value;
        renderStudentView();
      });
    }

    // Student Sub-tabs
    document.querySelectorAll('.student-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        activeStudentSubTab = target;

        document.querySelectorAll('.student-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.getElementById('studentProfileTab').style.display = target === 'profile' ? 'block' : 'none';
        document.getElementById('studentLeaveTab').style.display = target === 'leave' ? 'block' : 'none';
        document.getElementById('studentComplaintsTab').style.display = target === 'complaints' ? 'block' : 'none';
      });
    });

    // Warden Sub-tabs
    document.querySelectorAll('.warden-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        activeWardenSubTab = target;

        document.querySelectorAll('.warden-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.getElementById('wardenRoomsTab').style.display = target === 'rooms' ? 'block' : 'none';
        document.getElementById('wardenStudentsTab').style.display = target === 'allocations' ? 'block' : 'none';
        document.getElementById('wardenLeavesTab').style.display = target === 'leaves' ? 'block' : 'none';
        document.getElementById('wardenComplaintsTab').style.display = target === 'complaints' ? 'block' : 'none';
      });
    });

    // Forms
    const leaveForm = document.getElementById('leaveRequestForm');
    if (leaveForm) leaveForm.addEventListener('submit', handleLeaveSubmit);

    const compForm = document.getElementById('complaintForm');
    if (compForm) compForm.addEventListener('submit', handleComplaintSubmit);

    const allocForm = document.getElementById('roomAllocationForm');
    if (allocForm) allocForm.addEventListener('submit', handleRoomAllocationSubmit);

    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) addStudentForm.addEventListener('submit', handleAddStudentSubmit);

    // Modal triggers & close
    const addStudentBtn = document.getElementById('openAddStudentModalBtn');
    if (addStudentBtn) addStudentBtn.addEventListener('click', () => openModal('addStudentModal'));

    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) modal.classList.remove('open');
      });
    });
  }

  // Window API for inline button handlers
  window.HostelApp = {
    openAllocateModal,
    processLeave,
    updateComplaintStatus
  };

  document.addEventListener('DOMContentLoaded', init);
})();
