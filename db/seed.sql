-- Insert initial info into the department table
INSERT INTO department (name) VALUES
('Engineering'),
('Sales'),
('Finance')
ON CONFLICT DO NOTHING;

-- Insert initial info into the role table
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('Sales Manager', 90000, 2),
('Accountant', 70000, 3)
ON CONFLICT DO NOTHING;

-- Insert initial info into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('City', 'Smith', 1, NULL),
('John', 'Doe', 2, NULL),
('Mike', 'Lowery', 3, NULL),
('Demion', 'Thyme', 1, 1),
('Yoda', 'Best', 2, 2),
('Imma', 'Tired', 3, 3)
ON CONFLICT DO NOTHING;