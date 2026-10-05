-- Database Schema for Internship and Job Application Portal
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL CHECK(job_type IN ('Full-Time', 'Internship', 'Remote / Hybrid')),
    required_skills TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    deadline DATE NOT NULL,
    stipend TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cgpa TEXT,
    resume_filename TEXT,
    applied_date DATE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected')) DEFAULT 'Applied',
    FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE(job_id, student_id)
);
