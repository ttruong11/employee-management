-- employees.sql

-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE,
    gender VARCHAR(10),
    phone_number VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Create an index on the email column for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
