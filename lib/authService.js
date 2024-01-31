// lib/authService.js
const pool = require('../db/db'); // Update the path to your database connection file
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT handling

async function findUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error querying the database:', error);
      throw error;
    }
  }
  
  const hashPassword = (password) => {
    // Implement password hashing
    // For example, using bcrypt:
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
  };
  
  export async function yourUserValidationFunction(username, hashPassword) {
    console.log('Input:', username, hashPassword);
  
    const user = await findUserByUsername(username);
    console.log('User from the database:', user);
  
    if (user && bcrypt.compareSync(hashPassword, user.password)) {
      // If the username and password are valid, generate a JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
      });
  
      return {
        user,
        token, // Include the generated JWT token in the response
      };
    } else {
      return null;
    }
  }
  
  