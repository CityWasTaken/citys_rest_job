\c city_employee_tracker_db;

SELECT 
    e.id AS employee_id,
    e.first_name,
    e.last_name,
    r.title AS role_title,
    d.name AS department_name,
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employee AS e
JOIN role AS r ON e.role_id = r.id
JOIN department AS d ON r.department_id = d.id
LEFT JOIN employee AS m ON e.manager_id = m.id;