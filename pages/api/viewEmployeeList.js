import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const toggleEmployeeDetails = (employee) => {
    setSelectedEmployee(selectedEmployee === employee ? null : employee);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.employee_id}>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>
                  <button className="employee-details-button"onClick={() => toggleEmployeeDetails(employee)}>
                    {selectedEmployee === employee ? 'Hide Details' : 'Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <div className="employee-details-container">
          <h3>Employee Details</h3>
          {selectedEmployee.image_url && (
            <img src={selectedEmployee.image_url} className="circular-image" alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`} 
            />
          )}
          <p>First Name: {selectedEmployee.first_name}</p>
          <p>Last Name: {selectedEmployee.last_name}</p>
          <p>Date of Birth: {formatDate(selectedEmployee.dob)}</p>
          <p>Email: {selectedEmployee.email}</p>
          <button className="employee-details-button" onClick={() => toggleEmployeeDetails(selectedEmployee)}>Hide Details</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
