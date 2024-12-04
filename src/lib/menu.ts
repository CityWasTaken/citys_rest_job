import inquirer from 'inquirer';
import 'console.table';

import { getAllRoles, getAllEmployees, createEmployee } from './query.js';

let showMessage = false;

export async function addEmployee() {
    const rolesArray = await getAllRoles();
    const { role_id, first_name, last_name } = await inquirer.prompt([
        {
            message: 'Please select the role',
            name: 'role_id',
            type: 'list',
            choices: rolesArray.map((roleObj) => {
                return {
                    name: `${roleObj.title} (${roleObj.department_name})`,
                    value: roleObj.id
                }
            })
        },
        {
            message: 'Enter the first name',
            name: 'first_name',
            type: 'input'
        },
        {
            message: 'Enter the last name',
            name: 'last_name',
            type: 'input'
        }
    ]);

    await createEmployee(role_id, first_name, last_name);
    console.log('Employee added successfully!');
    await showAllEmployees();
}

export async function showAllEmployees() {
    const employeeRowsArray = await getAllEmployees();
    console.table(employeeRowsArray);
}

export async function showMenu() {
    if (!showMessage) {
        console.log('\n -*-*-*-*- Welcome to City\'s Employee Database Tracker! -*-*-*-*-\n');
        showMessage = true;
    }

    const { optionFunction } = await inquirer.prompt({
        message: 'Please select an option',
        name: 'optionFunction',
        type: 'list',
        choices: [
            {
                name: 'Show All Employees',
                value: showAllEmployees
            },
            {
                name: 'Add Employee',
                value: addEmployee
            },
            {
                name: 'Quit',
                value: 0
            }
        ]
    });

    if (optionFunction !== 0) {
        await optionFunction();
        showMenu();
    } else {
        console.log('As you were!');
        process.exit(0); 
    }
}