// routes.js
const express = require('express');
const router = express.Router();
const pool = require('./db/db'); // Import the database connection pool
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const { body, param, query, validationResult } = require('express-validator');


// Define your routes here

// Define the DELETE route for deleting an employee by ID
router.delete('/api/employees/:id', [
  // Validate that 'id' is a number
  param('id').isNumeric()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const employeeId = req.params.id;

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

// Define the PUT route for updating an employee by ID
router.put('/api/employees/:id', [
  // Validation and sanitization rules
  body('first_name').trim().escape(),
  body('last_name').trim().escape(),
  body('dob').isISO8601().toDate(),
  body('email').isEmail().normalizeEmail(),
  body('job_role').trim().escape(),
  body('salary').isNumeric(),
  body('gender').trim().escape(),
  body('phone_number').trim().escape()
], async (req, res) => {
  const employeeId = req.params.id; // Get the employee ID from the URL parameter

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, dob, email, job_role, salary, gender, phone_number } = req.body;

  try {
    // Check if the employee with the given ID exists in the database
    const queryCheck = 'SELECT * FROM employees WHERE id = $1';
    const checkResult = await pool.query(queryCheck, [employeeId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // If the employee exists, perform the UPDATE operation
    const updateQuery = `
      UPDATE employees 
      SET first_name = $1, last_name = $2, dob = $3, email = $4, job_role = $5, salary = $6, gender = $7, phone_number = $8
      WHERE id = $9
    `;
    await pool.query(updateQuery, [first_name, last_name, dob, email, job_role, salary, gender, phone_number, employeeId]);

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Define the GET route for determining existing
router.get('/api/employees', [
  // Validate 'page' and 'limit' query parameters
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log(`Page: ${page}, Limit: ${limit}, Offset: ${offset}`); // Log the pagination parameters

    const query = 'SELECT * FROM employees ORDER BY id LIMIT $1 OFFSET $2';
    const { rows } = await pool.query(query, [limit, offset]);

    console.log(`Fetched Rows: `, rows); // Log the fetched rows

    const countQuery = 'SELECT COUNT(*) FROM employees';
    const countResult = await pool.query(countQuery);
    const totalEmployees = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalEmployees / limit);

    const responseData = {
      employees: rows,
      totalPages: totalPages,
      currentPage: page,
      totalEmployees: totalEmployees,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Define the GET route for determining total number of employees
router.get('/api/employee-metrics', async (req, res) => {
  try {
    const employeeCountQuery = 'SELECT COUNT(*) FROM employees';
    const salarySumQuery = 'SELECT SUM(salary) FROM employees';

    const employeeCountResult = await pool.query(employeeCountQuery);
    const salarySumResult = await pool.query(salarySumQuery);

    const totalEmployees = parseInt(employeeCountResult.rows[0].count);
    const totalSalary = parseFloat(salarySumResult.rows[0].sum);

    res.status(200).json({
      currentEmployeeCount: totalEmployees,
      totalSalarySum: totalSalary,
    });
  } catch (error) {
    console.error('Error fetching employee metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// User registration endpoint with input validation and sanitization
router.post('/api/register', [
  // Validate and sanitize each field
  body('username').trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim().escape()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
router.post('/api/login', [
  // Validate and sanitize the username
  body('username').trim().escape(),
  // Validate the password (sanitization is not required for passwords as they will be hashed)
  body('password').exists()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

    // API endpoint to update the password for a user in users table

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
  
  // API endpoint to update the username for a users in users table
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
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
    region: process.env.AWS_DEFAULT_REGION
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

// routes.js

router.post('/api/chatbot', async (req, res) => {
  try {
    const { responses, task } = req.body; // Destructure 'responses' and 'task' from the request body

    // Assuming you want to process the responses and task here
    // You can access 'responses' and 'task' like this:
    // responses is an object containing user responses to questions
    // task is a string representing the selected task

    if (task === '1') {
      // Example: If the selected task is 'Add An Employee', you can access responses like this:
      const firstName = responses['First Name'];
      const lastName = responses['Last Name'];
      const dob = responses['Date of Birth (DOB)'];
      const gender = responses['Gender'];
      const phoneNumber = responses['Phone Number'];
      const email = responses['Email'];
      const imageURL = responses['Image URL'];
      const salary = responses['Salary'];
      const jobRole = responses['Job Role'];


      // Your logic to process the employee data can go here
      // For example, inserting the employee data into a database

      // Respond to the client with a success message
      res.status(200).json({ response: 'Employee data received and processed successfully' });
    } else {
      // Handle other tasks or responses here

      // Respond to the client accordingly
      res.status(200).json({ response: 'Task completed successfully' });
    }
  } catch (error) {
    console.error('Error in chatbot route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  

module.exports = router;
