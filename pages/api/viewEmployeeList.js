import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Fetch existing employees when the component mounts
    fetch('http://localhost:3001/api/employees') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  const toggleEmployeeDetails = (employee) => {
    setSelectedEmployee(selectedEmployee === employee ? null : employee);
  };

  return (
    <div className="employee-list-container">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.first_name}</td>
              <td>{employee.last_name}</td>
              <td>
                <button onClick={() => toggleEmployeeDetails(employee)}>
                  {selectedEmployee === employee ? 'Hide Details' : 'Show Details'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEmployee && (
        <div className="employee-details-container">
          <h3>Employee Details</h3>
          <p>First Name: {selectedEmployee.first_name}</p>
          <p>Last Name: {selectedEmployee.last_name}</p>
          <p>Date of Birth: {selectedEmployee.dob}</p>
          <p>Email: {selectedEmployee.email}</p>
          {/* Add more details as needed */}
          <button onClick={() => toggleEmployeeDetails(selectedEmployee)}>Hide Details</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
