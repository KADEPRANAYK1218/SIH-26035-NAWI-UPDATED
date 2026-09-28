-- NAWI Test Report System
-- PostgreSQL Database Schema
-- Non-Automatic Weighing Instruments - OIML R 76 / Legal Metrology Act 2009

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'LABORATORY_OFFICER', 'TEST_ENGINEER', 'REVIEWER', 'VIEWER')),
    department VARCHAR(255) DEFAULT 'Legal Metrology Laboratory',
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSTRUMENTS TABLE
CREATE TABLE IF NOT EXISTS instruments (
    id VARCHAR(64) PRIMARY KEY,
    manufacturer VARCHAR(255) NOT NULL,
    manufacturer_address TEXT,
    applicant_name VARCHAR(255),
    applicant_address TEXT,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    instrument_type VARCHAR(100) NOT NULL,
    accuracy_class VARCHAR(20) NOT NULL CHECK (accuracy_class IN ('I', 'II', 'III', 'IIII')),
    max_capacity NUMERIC(12, 4) NOT NULL,
    min_capacity NUMERIC(12, 4),
    verification_scale_interval NUMERIC(12, 4) NOT NULL, -- e
    actual_scale_interval NUMERIC(12, 4),               -- d
    number_of_verification_intervals INTEGER,          -- n = Max / e
    display_type VARCHAR(50) DEFAULT 'Electronic Digital (LED/LCD)',
    weighing_range VARCHAR(50) DEFAULT 'Single-interval',
    unit VARCHAR(10) DEFAULT 'kg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TEST REPORTS TABLE
CREATE TABLE IF NOT EXISTS test_reports (
    id VARCHAR(64) PRIMARY KEY,
    report_number VARCHAR(64) UNIQUE NOT NULL,
    instrument_id VARCHAR(64) REFERENCES instruments(id) ON DELETE CASCADE,
    laboratory_id VARCHAR(64) NOT NULL,
    laboratory_name VARCHAR(255) NOT NULL,
    test_engineer_id VARCHAR(64) REFERENCES users(id),
    test_engineer_name VARCHAR(255) NOT NULL,
    reviewer_id VARCHAR(64) REFERENCES users(id),
    reviewer_name VARCHAR(255),
    test_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED', 'PENDING_REVIEW')),
    overall_result VARCHAR(30) DEFAULT 'PENDING' CHECK (overall_result IN ('PASS', 'FAIL', 'PENDING', 'NOT_APPLICABLE')),
    standard_applied VARCHAR(100) DEFAULT 'OIML R 76-1 (2006) / Legal Metrology (General) Rules 2011',
    remarks TEXT,
    signed_by_engineer BOOLEAN DEFAULT FALSE,
    engineer_signed_at TIMESTAMP WITH TIME ZONE,
    signed_by_reviewer BOOLEAN DEFAULT FALSE,
    reviewer_signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. LABORATORY CONDITIONS TABLE
CREATE TABLE IF NOT EXISTS laboratory_conditions (
    id VARCHAR(64) PRIMARY KEY,
    report_id VARCHAR(64) REFERENCES test_reports(id) ON DELETE CASCADE,
    temperature NUMERIC(5, 2), -- deg C
    humidity NUMERIC(5, 2),    -- % RH
    pressure NUMERIC(7, 2),    -- hPa
    voltage NUMERIC(6, 2),     -- V AC
    frequency NUMERIC(5, 2),   -- Hz
    location VARCHAR(255),
    standard_weights_id VARCHAR(255),
    cal_cert_number VARCHAR(255),
    cal_valid_until DATE
);

-- 5. TEST OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS test_observations (
    id VARCHAR(64) PRIMARY KEY,
    report_id VARCHAR(64) REFERENCES test_reports(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL,
    test_point VARCHAR(100) NOT NULL,
    reference_value NUMERIC(12, 4) NOT NULL,
    indicated_value NUMERIC(12, 4) NOT NULL,
    calculated_error NUMERIC(12, 4) NOT NULL,
    applicable_requirement VARCHAR(255) NOT NULL,
    result VARCHAR(30) NOT NULL CHECK (result IN ('PASS', 'FAIL', 'NOT_APPLICABLE', 'PENDING_REVIEW')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS attachments (
    id VARCHAR(64) PRIMARY KEY,
    report_id VARCHAR(64) REFERENCES test_reports(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    uploaded_by VARCHAR(64) REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. REGULATORY REFERENCES TABLE
CREATE TABLE IF NOT EXISTS regulatory_references (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    source_link TEXT,
    effective_date DATE,
    description TEXT
);

-- 8. RULE CONFIGURATIONS TABLE
CREATE TABLE IF NOT EXISTS rule_configurations (
    id VARCHAR(64) PRIMARY KEY,
    rule_id VARCHAR(100) UNIQUE NOT NULL,
    standard VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    instrument_class VARCHAR(20) NOT NULL,
    parameter VARCHAR(100) NOT NULL,
    requirement TEXT NOT NULL,
    effective_date DATE,
    source_reference VARCHAR(255) NOT NULL
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(64),
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
