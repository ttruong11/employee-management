// lib/authService.js
const pool = require('../db/db'); // Update the path to your database connection file
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

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

export async function yourUserValidationFunction(username, plainTextPassword) {
    console.log('Input:', username);

    const user = await findUserByUsername(username);
    console.log('User from the database:', user);

    if (user && bcrypt.compareSync(plainTextPassword, user.password)) {
        // If the username and password are valid, return the user object
        return { id: user.id, username: user.username };
    } else {
        return null;
    }
}
