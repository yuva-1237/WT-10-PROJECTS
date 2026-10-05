-- Database Schema for College Complaint and Maintenance Portal
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('Classroom', 'Laboratory', 'Wi-Fi', 'Electricity', 'Water', 'Hostel', 'Cleanliness', 'Infrastructure', 'Other')),
    location TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    assigned_to TEXT,
    status TEXT NOT NULL CHECK(status IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Submitted',
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    feedback_rating INTEGER CHECK(feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT
);

CREATE TABLE IF NOT EXISTS maintenance_technicians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT
);
