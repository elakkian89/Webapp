-- Create database schema for business management app

-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    salary DECIMAL(15,2),
    hire_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing table
CREATE TABLE billing (
    id SERIAL PRIMARY KEY,
    account_type VARCHAR(255) NOT NULL,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    sales_rep VARCHAR(255),
    practice VARCHAR(255),
    month_year VARCHAR(10) NOT NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget table
CREATE TABLE budget (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    sales_rep VARCHAR(255),
    practice VARCHAR(255),
    month_year VARCHAR(10) NOT NULL,
    budgeted_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    actual_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Utilization table
CREATE TABLE employee_utilization (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    month_year VARCHAR(10) NOT NULL,
    utilization DECIMAL(5,2) DEFAULT 0,
    actual_utilization DECIMAL(5,2) DEFAULT 0,
    project_type VARCHAR(255),
    demand_category VARCHAR(255),
    project_name VARCHAR(255),
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_billing_month_year ON billing(month_year);
CREATE INDEX idx_budget_month_year ON budget(month_year);
CREATE INDEX idx_utilization_month_year ON employee_utilization(month_year);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_billing_client_id ON billing(client_id);
CREATE INDEX idx_budget_client_id ON budget(client_id);
CREATE INDEX idx_utilization_employee_id ON employee_utilization(employee_id);
