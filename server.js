const express = require('express');
const pool = require('./db/db'); // Import the database connection pool from db.js
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = process.env.PORT || 3001; // Set the port for your server

app.use(cors());

// API endpoint to retrieve existing employees
app.get('/api/employees', async (req, res) => {
  try {
    const query = 'SELECT * FROM employees';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello, world!'); // You can customize this response
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
