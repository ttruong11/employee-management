import React, { useState } from 'react';

const UpdateEmployee = ({ employee, onEmployeeUpdated }) => {
  const [formData, setFormData] = useState({
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    job_role: employee.job_role,
    salary: employee.salary
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the API to update the employee
    fetch(`http://localhost:3001/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Employee updated:', data);
      onEmployeeUpdated(); // Callback to inform the parent component that an update has occurred
    })
    .catch(error => console.error('Error updating employee:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
      />
      {/* Repeat above input for last_name, email, job_role, and salary */}
      <button type="submit">Update Employee</button>
    </form>
  );
};

export default UpdateEmployee;
