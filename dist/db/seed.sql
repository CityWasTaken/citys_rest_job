-- Insert random departments
INSERT INTO departments (name) VALUES 
('Sales'),
('Engineering'),
('Marketing'),
('Finance');

-- Insert random roles
INSERT INTO roles (title, salary, department_id) VALUES 
('Sales Manager', 80000, 1),
('Sales Representative', 50000, 1),
('Software Engineer', 90000, 2),
('DevOps Engineer', 85000, 2),
('Marketing Manager', 75000, 3),
('Content Strategist', 60000, 3),
('Financial Analyst', 70000, 4),
('Accountant', 65000, 4);

-- Insert random employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Johnson', 3, NULL),
('Bob', 'Brown', 4, 3),
('Charlie', 'Davis', 5, NULL),
('Diana', 'Miller', 6, 5),
('Eve', 'Wilson', 7, NULL),
('Frank', 'Moore', 8, 7),
('Grace', 'Taylor', 1, NULL),
('Hank', 'Anderson', 2, 1),
('Ivy', 'Thomas', 3, NULL),
('Jack', 'Jackson', 4, 3),
('Karen', 'White', 5, NULL),
('Leo', 'Harris', 6, 5),
('Mia', 'Martin', 7, NULL);