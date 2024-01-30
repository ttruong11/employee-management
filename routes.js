// routes.js
const express = require('express');
const router = express.Router();
const pool = require('./db/db'); // Import the database connection pool
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// Define your routes here

// Define the DELETE route for deleting an employee by ID
router.delete('/api/employees/:id', async (req, res) => {
  const employeeId = req.params.id; // Get the employee ID from the URL parameter

  try {
    // Check if the employee with the given ID exists in the database
    const queryCheck = 'SELECT * FROM employees WHERE id = $1';
    const { rows } = await pool.query(queryCheck, [employeeId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // If the employee exists, perform the DELETE operation
    const deleteQuery = 'DELETE FROM employees WHERE id = $1';
    await pool.query(deleteQuery, [employeeId]);

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint to retrieve existing employees
router.get('/api/employees', async (req, res) => {
  try {
    // Retrieve all employees
    const query = 'SELECT * FROM employees';
    const { rows } = await pool.query(query);

    // Calculate the sum of salaries
    const sumQuery = 'SELECT SUM(salary) FROM employees'; // Adjust the table and column names as needed
    const sumResult = await pool.query(sumQuery);
    const totalSalarySum = parseFloat(sumResult.rows[0].sum);

    // Include additional data (e.g., currentEmployeeCount)
    const additionalData = {
      currentEmployeeCount: rows.length, // This example assumes the count is the length of the 'rows' array
      totalSalarySum: totalSalarySum, // Include the sum of salaries

      // Add other additional data here
    };

    // Combine employee data and additional data in the response
    const responseData = {
      employees: rows,
      additionalData: additionalData,
    };

    res.status(200).json(responseData);
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

router.get('/api/users', async (req, res) => {
    try {
      const query = 'SELECT username FROM users'; // Adjust the query to retrieve usernames
      const { rows } = await pool.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/api/users/get-password/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const query = 'SELECT password FROM users WHERE username = $1';
      const { rows } = await pool.query(query, [username]);
  
      if (rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const hashedPassword = rows[0].password;
      res.status(200).json({ currentPassword: hashedPassword });
    } catch (error) {
      console.error('Error fetching user password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // API endpoint to update the username for a user
  router.put('/api/users/update-username/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const { newUsername } = req.body;
      const query = 'UPDATE users SET username = $1 WHERE username = $2';
      await pool.query(query, [newUsername, username]);
      res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
      console.error('Error updating username:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  const upload = multer({ dest: 'uploads/' });

  // Configure AWS
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  
  const s3 = new AWS.S3();
  
  // Add a new route for image uploads
  router.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    const fileName = Date.now() + path.extname(file.originalname); // Create a unique file name
  
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        return res.status(500).send('Error uploading to S3');
      }
  
      // Delete the file from local storage after uploading to S3
      fs.unlink(file.path, () => {
        console.log('Temp file deleted');
      });
  
      res.json({ imageUrl: data.Location }); // Send the URL of the uploaded file
    });
  });  

  

module.exports = router;
