// routes.js
const express = require('express');
const router = express.Router();
const pool = require('./db/db'); // Import the database connection pool
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Define your routes here

// API endpoint to retrieve existing employees
router.get('/api/employees', async (req, res) => {
  try {
    const query = 'SELECT * FROM employees';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration endpoint
router.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
      // Check if the username or email already exists in the database
      const checkQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
      const checkValues = [username, email];
      const existingUser = await pool.query(checkQuery, checkValues);
  
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      // Hash the user's password using bcrypt before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the user's information into the users table
      const insertQuery = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)';
      const insertValues = [username, hashedPassword, email];
      await pool.query(insertQuery, insertValues);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// User login endpoint
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const query = 'SELECT password FROM users WHERE username = $1';
      const { rows } = await pool.query(query, [username]);
  
      if (rows.length === 0) {
        // User not found
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }
  
      const hashedPassword = rows[0].password;
  
      // Compare the entered password with the hashed password
      const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  
      if (passwordsMatch) {
        // Passwords match, authentication successful
        res.status(200).json({ message: 'Authentication successful' });
      } else {
        // Passwords don't match, authentication failed
        res.status(401).json({ error: 'Authentication failed' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
