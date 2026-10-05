-- Database Schema for Student Academic Management System
-- Database: SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dept_name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0)
);

CREATE TABLE IF NOT EXISTS students (
    student_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    internal_mark INTEGER CHECK (internal_mark >= 0 AND internal_mark <= 40),
    external_mark INTEGER CHECK (external_mark >= 0 AND external_mark <= 60),
    total_mark INTEGER GENERATED ALWAYS AS (internal_mark + external_mark) STORED,
    attendance_percentage REAL CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
    FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY(subject_code) REFERENCES subjects(code) ON DELETE CASCADE,
    UNIQUE(student_id, subject_code)
);

-- Seed Data
INSERT OR IGNORE INTO subjects (code, name, credits) VALUES 
('CS3401', 'Web Technologies', 4),
('CS3491', 'Artificial Intelligence and Machine Learning', 4),
('CS3492', 'Database Management Systems', 3),
('CS3451', 'Design and Analysis of Algorithms', 4),
('GE3451', 'Environmental Sciences and Sustainability', 2);
