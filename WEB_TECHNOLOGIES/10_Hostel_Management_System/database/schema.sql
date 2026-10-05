-- ============================================================================
-- Database Schema: Project 10 - Hostel Management System
-- Database Engine: SQLite3
-- Student: Yuvathilagan | Web Technologies
-- ============================================================================

CREATE TABLE IF NOT EXISTS rooms (
  room_no TEXT PRIMARY KEY,
  block TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  occupied INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL,
  amenities TEXT
);

CREATE TABLE IF NOT EXISTS students (
  student_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  gender TEXT NOT NULL,
  room_no TEXT,
  block TEXT,
  bed_no TEXT,
  phone TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  email TEXT NOT NULL,
  fee_status TEXT NOT NULL CHECK (fee_status IN ('Paid', 'Partial', 'Pending')),
  fee_amount REAL NOT NULL DEFAULT 65000.0,
  fee_paid REAL NOT NULL DEFAULT 0.0,
  FOREIGN KEY (room_no) REFERENCES rooms(room_no)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  room_no TEXT NOT NULL,
  reason TEXT NOT NULL,
  from_date TEXT NOT NULL,
  to_date TEXT NOT NULL,
  parent_approved INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  submitted_on TEXT NOT NULL,
  remarks TEXT,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  room_no TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Electricity', 'Plumbing', 'Wi-Fi', 'Cleanliness', 'Carpentry', 'Other')),
  description TEXT NOT NULL,
  submitted_on TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Submitted', 'In Progress', 'Resolved')),
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);
