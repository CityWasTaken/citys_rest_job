import inquirer from 'inquirer';
import 'console.table';

import DB from './DB.js';

class MenuSystem {
  static started = false;

  static async showMainMenu() {
    if (!this.started) {
      const message = '-------- Welcome to the Employee Tracker! ---------';
      const line = '*-'.repeat(message.length / 2) + '*';

      console.log(`\n${line}\n${message}\n${line}\n`);
      this.started = true;
    }

    const {choice} = await inquirer.prompt({
      name: 'choice',
      message: 'Please choose an option',
      type: 'list',
      choices: [
        {
          name: 'View All Employees',
          value: this.showEmployees
        },
        {
          name: 'Add Employee',
          value: this.showAddEmployeeMenu
        },
        {
          name: 'Update Employee Role',
          value: this.showUpdateEmployeeRoleMenu
        },
        {
          name: 'View All Roles',
          value: this.showRoles
        },
        {
          name: 'Add Role',
          value: this.showAddRoleMenu
        },
        {
          name: 'View All Departments',
          value: this.showDepartments
        },
        {
          name: 'Add Department',
          value: this.showAddDepartmentMenu
        },
        {
          name: 'Quit',
          value: 0
        }
      ]
    });

    if (!choice) {
      console.log('\n----- Thanks for using the Employee Tracker! ------\n');

      process.exit();
    }

    await choice();

    this.showMainMenu();
  }

  static async showEmployees() {
    const employees = await DB.getEmployees();
    const addedDepartments: any = [];
    const prepared = employees.reduce((o, emp, i) => {
      if (!addedDepartments.includes(emp.department) && i) {
        console.log(i);
        o.push({
          department: '\n',
          employee_id: '',
          full_name: '',
          title: '',
          salary: '',
          manager: ''
        });
        addedDepartments.push(emp.department);
      }

      o.push(emp);

      return o;
    }, [])

    console.log('\n');
    console.table(prepared);
  }

  static async showAddEmployeeMenu() {
    const { first_name, last_name } = await inquirer.prompt([
      {
        name: 'first_name',
        message: 'Enter employee\'s first name',
        type: 'input'
      },
      {
        name: 'last_name',
        message: 'Enter employee\'s last name',
        type: 'input'
      }
    ]);
    const departments = await DB.getDepartments();
    const {department_id} = await inquirer.prompt({
      name: 'department_id',
      message: 'Please select the employee\'s department',
      type: 'list',
      choices: departments.map(dep => ({
        name: dep.name,
        value: dep.id
      }))
    });
    const roles = await DB.getRolesByDepartment(department_id);

    if (!roles.length) {
      console.log('\n No roles have been added for this department. Please add a role before adding an employee.\n');
      return MenuSystem.showAddRoleMenu();
    }

    const {role_id} = await inquirer.prompt({
      name: 'role_id',
      message: 'Please select the employee\'s role',
      type: 'list',
      choices: roles.map(r => ({
        name: r.title,
        value: r.id
      }))
    });

    const employees = await DB.getEmployeesByDepartment(department_id);
    const {manager_id} = await inquirer.prompt({
      name: 'manager_id',
      message: 'Please select the employee\'s manager',
      type: 'list',
      choices: [{
        name: 'NO MANAGER',
        value: null
      }, ...employees.map(e => ({
        name: e.employee_name,
        value: e.id
      }))]
    });

    await DB.addEmployee({
      first_name,
      last_name,
      role_id,
      manager_id
    });

    console.log('Employee added successfully!\n');
  }

  static async showUpdateEmployeeRoleMenu() {
    const employees = await DB.getEmployees();
    const {employee_id} = await inquirer.prompt({
      name: 'employee_id',
      message: 'Please select the employee to update',
      type: 'list',
      choices: employees.map(e => ({
        name: e.full_name,
        value: e.id
      }))
    });
    const departments = await DB.getDepartments();
    const { department_id } = await inquirer.prompt({
      name: 'department_id',
      message: 'Please select the department',
      type: 'list',
      choices: departments.map(d => ({
        name: d.name,
        value: d.id
      }))
    });
    const roles = await DB.getRolesByDepartment(department_id);

    if (!roles.length) {
      console.log('\nNo roles have been added for that department. Please create at least one role first\n');
      return MenuSystem.showAddRoleMenu();
    }

    const {role_id} = await inquirer.prompt({
      name: 'role_id',
      message: 'Please select the employee\'s new role',
      type: 'list',
      choices: roles.map(r => ({
        name: r.title,
        value: r.id
      }))
    });

    await DB.updateEmployeeRole(employee_id, role_id);

    console.log('Employee role updated successfully!\n');
  }

  static async showRoles() {
    const roles = await DB.getRoles();

    console.log('\n');
    console.table(roles);
  }

  static async showAddRoleMenu(): Promise<any> {
    const departments = await DB.getDepartments();
    const {department_id} = await inquirer.prompt({
      name: 'department_id',
      message: 'Please select the department you would like to add a role for',
      type: 'list',
      choices: departments.map(d => ({
        name: d.name,
        value: d.id
      }))
    });
    const {
      title,
      salary
    } = await inquirer.prompt([
      {
        name: 'title',
        message: 'Enter the new role title',
        type: 'input'
      },
      {
        name: 'salary',
        message: 'Enter the new role salary',
        type: 'input'
      }
    ]);
    
    const added = await DB.addRole({
      title,
      salary,
      department_id
    });

    if (!added) {
      console.log('\nThat role already exists. Please try again.\n');
      return MenuSystem.showAddRoleMenu();
    }

    console.log('New role added successfully!\n');
  }

  static async showDepartments() {
    const departments = await DB.getDepartments();

    console.log('\n');
    console.table(departments);
  }

  static async showAddDepartmentMenu(): Promise<any> {
    const {
      name
    } = await inquirer.prompt([
      {
        name: 'name',
        message: 'Enter the new department name',
        type: 'input'
      }
    ]);

    const added = await DB.addDepartment(name);

    if (!added) {
      console.log('\nThat department already exists. Please try again.\n');
      return MenuSystem.showAddDepartmentMenu();
    }

    console.log('New department added successfully!\n');
  }
}

export default MenuSystem;