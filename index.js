const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');

// Create database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'employee_db'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the employee_db database.');

  // Start the CLI
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: 'Choose an action:',
        choices: [
          'View departments',
          'View roles',
          'View employees',
          'Add an employee',
          'Add a department',
          'Add a role',
          'Update a role',
          'Exit'
        ]
      }
    ])
    .then(answers => {
      const action = answers.action;

      // Perform actions based on user selection
      switch (action) {
        case 'View departments':
          viewDepartments(mainMenu);
          break;
        case 'View roles':
          viewRoles(mainMenu);
          break;
        case 'View employees':
          viewEmployees(mainMenu);
          break;
        case 'Add an employee':
          addEmployee(mainMenu);
          break;
        case 'Add a department':
          addDepartment(mainMenu);
          break;
        case 'Add a role':
          addRole(mainMenu);
          break;
        case 'Update a role':
          updateRole(mainMenu);
          break;
        case 'Exit':
          db.end();
          return;
      }
    });
}
