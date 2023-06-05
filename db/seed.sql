INSERT INTO departments (department_name)
VALUES ("sales"),
       ("tech"),
       ("engineering"),
       ("finance");

INSERT INTO roles ( department_id, title, salary)
VALUES (1, "salesperson", 50000),
       (1, "sales manager", 80000),
       (2, "technician", 85000),
       (2, "technician manager", 100000),
       (3, "engineer",85000),
       (3, "lead engineer",100000),
       (4, "accountant", 70000),
       (4, "account manager", 90000);

INSERT INTO employees (role_id, manager_id, first_name, last_name)
VALUES (1,"","mista", "globtrot")
       (1, 1, "luke", "groundflyer")
       (2, "",  "billy", "mandel")
       (2, 2, "nile", "krytox")
       (3, "", "steven", "bills")
       (3, 3, "harry", "styles")
       (4, "", "rob", "hart")
       (4, 4, "reed", "shelter")