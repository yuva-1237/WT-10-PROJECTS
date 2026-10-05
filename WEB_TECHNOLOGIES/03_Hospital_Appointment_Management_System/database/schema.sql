-- Database Schema for Hospital Appointment Management System
-- SQLite3 compatible DDL

CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    experience TEXT NOT NULL,
    available_days TEXT NOT NULL,
    available_time TEXT NOT NULL,
    room TEXT,
    consultation_fee INTEGER NOT NULL DEFAULT 500
);

CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_age INTEGER,
    patient_gender TEXT,
    doctor_id TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Booked', 'Completed', 'Cancelled')) DEFAULT 'Booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    -- Prevent double booking of the same doctor on same date and time slot
    UNIQUE(doctor_id, appointment_date, appointment_time, status)
);
