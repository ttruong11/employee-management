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
    } = req.body;

    try {
      // Insert the employee data into the database
      const query = `
        INSERT INTO employees (first_name, last_name, dob, gender, phone_number, email)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await db.query(query, [
        firstName,
        lastName,
        dob,
        gender,
        phoneNumber,
        email,
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
