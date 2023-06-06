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


function viewDepartments(callback) {
  db.query('SELECT * FROM departments', (err, rows) => {
    if (err) {
      console.error('Error viewing departments', err);
      return;
    }
    console.table('View departments', rows);
    callback();
  });
}

function viewRoles(callback) {
  db.query('SELECT * FROM roles', (err, rows) => {
    if (err) {
      console.error('Error viewing roles', err);
      return;
    }
    console.table('View roles', rows);
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
        console.error('Error viewing employees', err);
        return;
      }
      console.table('View employees', rows);
      callback();
    });
  }

  function addEmployee(callback) {
    
    inquirer
      .prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'What is the employees first name?',
        },
        {
          name: 'last_name',
          type: 'input',
          message: 'What is the employees last name?',
        },
        {
          name: 'role_name',
          type: 'input',
          message: 'What is the employees role?',
        },
        {
          name: 'manager_name',
          type: 'input',
          message: "What is the manager's name? (leave blank if none)",
        },
      ])
      .then(answers => {
        const { first_name, last_name, role_name, manager_name } = answers;
  
        const roleQuery = 'SELECT id FROM roles WHERE title = ?';
        db.query(roleQuery, [role_name], (error, roleResults) => {
          if (error) {
            console.error('Error', error);
            callback();
            return;
          }
  
          const roleId = roleResults[0].id;
  
          if (manager_name.trim() === '') {
            const insertQuery = 'INSERT INTO employees (first_name, last_name, role_id) VALUES (?, ?, ?)';
            db.query(insertQuery, [first_name, last_name, roleId], (error, insertResults) => {
              if (error) {
                console.error('Error', error);
              } else {
                console.log('Employee added successfully!');
              }
              callback();
            });
          } else {
            const managerQuery = 'SELECT id FROM employees WHERE CONCAT(first_name, " ", last_name) = ?';
            db.query(managerQuery, [manager_name], (error, managerResults) => {
              if (error) {
                console.error('Error', error);
                callback();
                return;
              }
              if (managerResults.length === 0) {
                console.error('Manager not found.');
                callback();
                return;
              }
              const managerId = managerResults[0].id;
  
              const insertQuery =
                'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
              db.query(insertQuery, [first_name, last_name, roleId, managerId], (error, insertResults) => {
                if (error) {
                  console.error('Error', error);
                } else {
                  console.log('Employee added successfully!');
                }
                callback();
              });
            });
          }
        });
      });
  }

  function addDepartment(callback) {
    inquirer
      .prompt([
        {
          name: 'department_name',
          type: 'input',
          message: 'What is the name of the department?',
        },
      ])
      .then(answers => {
        const { department_name } = answers;
        const query = 'INSERT INTO departments (department_name) VALUES (?)';
        db.query(query, [department_name], (error, results) => {
          if (error) {
            console.error('Error', error);
          } else {
            console.log('Department added successfully!');
          }
          callback();
        });
      });
  }
  
  function addRole(callback) {
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'what is the role?'
        },
        {
          name: 'salary',
          type: 'input',
          message: 'How much money we talkin?'
        },
        {
          name: 'department_name',
          type: 'input',
          message: 'What is the name of the department?'
        }
      ])
      .then(answers => {
        const { title, salary, department_name } = answers;
        const query = `INSERT INTO roles (title, salary, department_id)
                       SELECT ?, ?, d.id FROM departments d
                       WHERE d.department_name = ?`;
        db.query(query, [title, salary, department_name], (error, results) => {
          if (error) {
            console.error('Error', error);
          } else {
            console.log('Role added successfully!');
          }
          callback();
        });
      });
  }

  function updateRole(callback) {
    const query = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.title AS current_role
                   FROM employees e
                   INNER JOIN roles r ON e.role_id = r.id`;
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error', error);
        callback();
        return;
      }
  
      const employeeChoices = results.map(result => ({
        name: result.employee_name,
        value: { id: result.id, name: result.employee_name, currentRole: result.current_role }
      }));
  
      inquirer
        .prompt([
          {
            name: 'employee',
            type: 'list',
            message: 'Select employee',
            choices: employeeChoices
          },
          {
            name: 'new_role',
            type: 'input',
            message: 'What is their new role?'
          }
        ])
        .then(answers => {
          const { employee, new_role } = answers;
          const query = `UPDATE employees e
                         SET e.role_id = (SELECT id FROM roles WHERE title = ? LIMIT 1)
                         WHERE e.id = ?`;
  
          db.query(query, [new_role, employee.id], (error, results) => {
            if (error) {
              console.error('Error', error);
            } else {
              console.log('Role updated successfully!');
            }
            callback();
          });
        });
    });
  }

