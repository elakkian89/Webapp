-- Insert sample data

-- Insert clients
INSERT INTO clients (name, email, phone, company, status) VALUES
('Acme Corporation', 'contact@acme.com', '+1-555-0101', 'Acme Corp', 'Active'),
('TechStart Inc.', 'hello@techstart.com', '+1-555-0102', 'TechStart', 'Active'),
('Global Solutions', 'info@globalsolutions.com', '+1-555-0103', 'Global Solutions Ltd', 'Active');

-- Insert employees
INSERT INTO employees (emp_id, name, email, department, position, salary, hire_date) VALUES
('GIS578', 'Aarthi R', 'aarthi.r@company.com', 'Business Intelligence', 'BI Analyst', 75000.00, '2023-01-15'),
('ENG001', 'John Smith', 'john.smith@company.com', 'Engineering', 'Senior Developer', 95000.00, '2022-03-10'),
('SAL001', 'Sarah Johnson', 'sarah.johnson@company.com', 'Sales', 'Sales Manager', 85000.00, '2021-06-20');

-- Insert projects
INSERT INTO projects (name, client_id, status, start_date, end_date, budget) VALUES
('Website Redesign', 1, 'Active', '2024-01-01', '2024-06-30', 50000.00),
('Mobile App Development', 2, 'Active', '2024-02-01', '2024-08-31', 120000.00),
('Data Analytics Platform', 3, 'Planning', '2024-04-01', '2024-12-31', 200000.00);

-- Insert billing data
INSERT INTO billing (account_type, client_id, sales_rep, practice, month_year, amount) VALUES
('Enterprise Accounts', 1, 'John Smith', 'Software Development', '2024-04', 125000.00),
('Enterprise Accounts', 1, 'John Smith', 'Software Development', '2024-05', 130000.00),
('SMB Accounts', 2, 'Sarah Johnson', 'Cloud Solutions', '2024-04', 85000.00),
('SMB Accounts', 2, 'Sarah Johnson', 'Cloud Solutions', '2024-05', 90000.00);

-- Insert budget data
INSERT INTO budget (category, client_id, sales_rep, practice, month_year, budgeted_amount, actual_amount) VALUES
('Development', 1, 'John Smith', 'Software Development', '2024-04', 120000.00, 125000.00),
('Development', 1, 'John Smith', 'Software Development', '2024-05', 125000.00, 130000.00),
('Infrastructure', 2, 'Sarah Johnson', 'Cloud Solutions', '2024-04', 80000.00, 85000.00),
('Infrastructure', 2, 'Sarah Johnson', 'Cloud Solutions', '2024-05', 85000.00, 90000.00);

-- Insert employee utilization data
INSERT INTO employee_utilization (employee_id, month_year, utilization, actual_utilization, project_type, demand_category, project_name, department) VALUES
(1, '2024-04', 1.00, 0.25, 'FTE', 'Signed', 'BI Support 2025; Fromm Electric – Support 2025', 'Business Intelligence'),
(1, '2024-05', 1.00, 0.25, 'FTE', 'Signed', 'BI Support 2025; Fromm Electric – Support 2025', 'Business Intelligence'),
(1, '2024-06', 1.00, 0.25, 'FTE', 'Signed', 'BI Support 2025; Fromm Electric – Support 2025', 'Business Intelligence');
