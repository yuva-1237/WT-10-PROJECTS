-- Database Schema for Online Examination System
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS exam_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 10,
    pass_percentage INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option INTEGER NOT NULL CHECK (correct_option >= 0 AND correct_option <= 3),
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS exam_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    attempted INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    incorrect_count INTEGER NOT NULL,
    score_percentage REAL NOT NULL,
    result_status TEXT CHECK (result_status IN ('PASS', 'FAIL')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
