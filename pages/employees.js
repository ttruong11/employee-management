import React, { useState, useEffect } from 'react';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employees);
        console.log('Fetched employees:', data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  return (
    <div className="employees-page">
      <h1>Employees</h1>
      <div className="employee-card-container">
        {employees.map(employee => (
          <div className="employee-page-container" key={employee.employee_id}>
            <h3>Employee Details</h3>
            {employee.image_url && (
            <img src={employee.image_url} className="circular-image-2" alt={`${employee.first_name} ${employee.last_name}`} />
          )}
            <p>First Name: {employee.first_name}</p>
            <p>Last Name: {employee.last_name}</p>
            <p>Job: {employee.job_role}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
