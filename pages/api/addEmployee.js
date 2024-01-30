import db from '../../db/db'; // Import the database connection pool

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      firstName,
      lastName,
      dob,
      gender,
      phoneNumber,
      email,
      imageUrl,
      salary,
      job_role
    } = req.body;

    try {
      // Check if an employee with the same email already exists
      const checkQuery = `
        SELECT email FROM employees WHERE email = $1
      `;

      const existingEmployee = await db.query(checkQuery, [email]);

      if (existingEmployee.rows.length > 0) {
        return res.status(400).json({ error: 'Employee with the same email already exists' });
      }

      // Insert the employee data into the database
      const insertQuery = `
        INSERT INTO employees (first_name, last_name, dob, gender, phone_number, email, image_url, salary, job_role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      await db.query(insertQuery, [
        firstName,
        lastName,
        dob,
        gender,
        phoneNumber,
        email,
        imageUrl,
        salary,
        job_role,
      ]);

      return res.status(200).json({ message: 'Employee added successfully' });
    } catch (error) {
      console.error('Error adding employee:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle other HTTP methods if needed
  return res.status(405).json({ error: 'Method not allowed' });
}
