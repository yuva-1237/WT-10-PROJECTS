-- Database Schema for Digital Library Management System
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    available_copies INTEGER NOT NULL CHECK (available_copies >= 0 AND available_copies <= quantity),
    shelf TEXT
);

CREATE TABLE IF NOT EXISTS book_issues (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    late_days INTEGER DEFAULT 0,
    fine_amount INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('Issued', 'Returned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
