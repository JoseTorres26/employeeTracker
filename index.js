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
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        name: 'choice',
        type: 'list',
        message: 'what would you like to do',
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
      const choice = answers.choice;

      switch (choice) {
        case 'View all departments':
          viewDepartments(mainMenu);
          break;
        case 'View all roles':
          viewRoles(mainMenu);
          break;
        case 'View all employees':
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


function viewDepartments(callback) {
  db.query('SELECT * FROM departments', (err, rows) => {
    if (err) {
      console.error('Error viewing departments:', err);
      return;
    }
    console.table('Departments:', rows);
    callback();
  });
}

function viewRoles(callback) {
  db.query('SELECT * FROM roles', (err, rows) => {
    if (err) {
      console.error('Error viewing roles:', err);
      return;
    }
    console.table('Roles:', rows);
    callback();
  });
}

function viewEmployees(callback) {
    const query = `SELECT 
                      e.id, 
                      e.first_name, 
                      e.last_name, 
                      r.title AS role,
                      r.salary,
                      d.department_name AS department,
                      CONCAT(m.first_name, ' ', m.last_name) AS manager
                  FROM 
                      employees e
                  INNER JOIN
                      roles r ON e.role_id = r.id
                  INNER JOIN
                      departments d ON r.department_id = d.id
                  LEFT JOIN
                      employees m ON e.manager_id = m.id`;
  
    db.query(query, (err, rows) => {
      if (err) {
        console.error('Error viewing employees:', err);
        return;
      }
      console.table('Employees:', rows);
      callback();
    });
  }
