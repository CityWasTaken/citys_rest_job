import client from '../db/connection.js';

type Employee = {
  first_name: string;
  last_name: string;
  role_id: string;
  manager_id: string;
}

type Role = {
  title: string;
  salary: number;
  department_id: number;
}

class DB {
  // EMPLOYEES
  static async getEmployees() {
    const {rows} = await client.query(`
      SELECT
        d.name AS department,
        e.id AS employee_id, 
        CONCAT(e.first_name, ' ', e.last_name) AS full_name,
        title,
        r.salary,
        COALESCE(NULLIF(CONCAT(COALESCE(m.first_name, ''), ' ', COALESCE(m.last_name, '')), ' '), 'N/A') AS manager
      FROM employees e
      JOIN roles r ON e.role_id = r.id
      JOIN departments d ON r.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ORDER BY d.name
    `);

    return rows;
  }

  static async getEmployeesByDepartment(dep_id: number) {
    const { rows } = await client.query(`
      SELECT
        e.id,
        CONCAT(first_name, ' ', last_name) AS employee_name,
        name
      FROM employees e
      JOIN roles r
        ON r.id = e.role_id
      JOIN departments d
       ON d.id = r.department_id
      WHERE d.id = $1
    `, [dep_id]);

    return rows;
  }

  static async addEmployee({
    first_name,
    last_name,
    role_id,
    manager_id
  }: Employee) {
    await client.query(`
      INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)
    `, [first_name, last_name, role_id, manager_id]);

    return true;
  }

  // DEPARTMENTS
  static async getDepartments() {
    const {rows} = await client.query('SELECT * FROM departments');

    return rows;
  }

  static async addDepartment(name: string) {
    const {rows} = await client.query('SELECT * FROM departments');
    if (rows.find(d => d.name.toLowerCase() === name.toLowerCase())) {
      return false;
    }

    await client.query('INSERT INTO departments (name) VALUES ($1)', [name]);

    return true;
  }

  // ROLES
  static async getRoles() {
    const { rows } = await client.query(`
      SELECT
        r.id,
        title,
        salary,
        d.name AS department
      FROM roles r
      JOIN departments d
        ON r.department_id = d.id
      ORDER BY d.id
    `);

    return rows;
  }

  static async getRolesByDepartment(dep_id: number) {
    const {rows} = await client.query(`
      SELECT
        id,
        title
      FROM roles
      WHERE department_id = $1
    `, [dep_id]);

    return rows;
  }

  static async updateEmployeeRole(employee_id: number, role_id: number) {
    await client.query(`UPDATE employees SET role_id = $2 WHERE id = $1`, [employee_id, role_id]);

    return true;
  }

  static async addRole({
    title,
    salary,
    department_id
  }: Role) {
    const roles = await this.getRolesByDepartment(department_id);

    if (roles.find(r => r.title.toLowerCase() === title.toLowerCase())) {
      return false;
    }

    await client.query(`
      INSERT INTO roles (
        title,
        salary,
        department_id
      ) VALUES ($1, $2, $3)
    `, [title, salary, department_id]);

    return true;
  }
}

export default DB;



// static async getRolesByEmployee(employee_id: number) {
//   const {rows: roles} = await client.query(`
//     SELECT
//       r.id,
//       r.title,
//       d.name AS department
//     FROM roles r
//     JOIN departments d
//       ON r.department_id = d.id
//     WHERE d.id = (
//       SELECT
//         department_id
//       FROM roles r
//       JOIN employees e
//       ON e.role_id = r.id
//       WHERE e.id = $1
//     )
//   `, [employee_id]);

//   return roles;
// }