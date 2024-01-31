const { Pool } = require('pg');
require('dotenv').config();


// Default configuration (can be development or a general fallback)
const defaultConfig = {
  user: 'postgres',
  host: process.env.DATABASE_HOST,
  database: 'employee_management_dev',
  password: process.env.DB_PASSWORD, // Always use environment variable for passwords
  port: 5432
};

// Configuration for development environment
const devConfig = {
  user: 'postgres',
  host: process.env.DATABASE_HOST, // Development database host
  database: 'employee_management_dev',
  password: process.env.DB_PASSWORD,
  port: 5432
};

// Configuration for production environment
const prodConfig = {
  user: 'postgres',
  host:  process.env.DATABASE_HOST, // Production database host
  database: 'employee_management_dev',
  password: process.env.DB_PASSWORD,
  port: 5432
};

// Configuration for staging environment
const stagingConfig = {
  user: 'ezmanage_stg',
  host: process.env.DATABASE_HOST, // Staging database host
  database: 'employee_management_stg',
  password: process.env.DB_PASSWORD,
  port: 5432
};

// Select the appropriate configuration based on NODE_ENV
const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : process.env.NODE_ENV === 'staging'
  ? stagingConfig
  : process.env.NODE_ENV === 'development'
  ? devConfig
  : defaultConfig;

const pool = new Pool(config);

module.exports = pool;
