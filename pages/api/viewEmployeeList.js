import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch existing employees when the component mounts
    fetch('http://localhost:3001/api/employees') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);
  return (
    <div>
      <h2>Existing Employees</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>dob</th>
            <th>email</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.first_name}</td>
              <td>{employee.last_name}</td>
              <td>{employee.dob}</td>
              <td>{employee.email}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
