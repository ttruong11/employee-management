// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'personal-app-db.cx6iaykek6fa.ca-central-1.rds.amazonaws.com', // Add your database host here
  database: 'employee_management_dev', // Add your database name here
  password: '', // Use environment variable for password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
