import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employees); // Update to access employees array in the response
        setCurrentEmployeeCount(data.additionalData.currentEmployeeCount); // Access additional data
        console.log('Fetched employees:', data); // Add this line for debugging
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const toggleEmployeeDetails = (employee) => {
    setSelectedEmployee(selectedEmployee === employee ? null : employee);
  };

  const handleDeleteEmployee = (employee) => {
    const employeeId = employee.id; // Get the employee_id from the employee object
    if (employeeId) {
      // Make a DELETE request to your server to delete the employee
      fetch(`http://localhost:3001/api/employees/${employeeId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 200) {
            // If the deletion was successful, update the employees list
            setEmployees(employees.filter(e => e.id !== employeeId)); // Use 'id' property here
            setSelectedEmployee(null); // Clear selected employee details
          } else {
            console.error('Error deleting employee:', response.statusText);
          }
        })
        .catch(error => console.error('Error deleting employee:', error));
    } else {
      console.error('Invalid employee ID:', employeeId);
    }
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
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.employee_id}>
                <td>{employee.first_name} {employee.last_name} {employee.employee_id}</td>
                <td>
                  <button className="employee-details-button" onClick={() => toggleEmployeeDetails(employee)}>
                    {selectedEmployee === employee ? 'Hide Details' : 'Details'}
                  </button>
                </td>
                <td>
                  <button className="employee-details-button" onClick={() => handleDeleteEmployee(employee)}>
                    Delete
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
            <img src={selectedEmployee.image_url} className="circular-image" alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`} />
          )}
          <p>First Name: {selectedEmployee.first_name}</p>
          <p>Last Name: {selectedEmployee.last_name}</p>
          <p>Date of Birth: {formatDate(selectedEmployee.dob)}</p>
          <p>Email: {selectedEmployee.email}</p>
          <p>Job: {selectedEmployee.job_role}</p>
          <p>Salary: {selectedEmployee.salary}</p>
          <button className="employee-details-button" onClick={() => toggleEmployeeDetails(selectedEmployee)}>Hide Details</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
