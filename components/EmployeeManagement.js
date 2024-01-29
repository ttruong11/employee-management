import React, { useState } from 'react';

// Existing Employee Form Component
const ExistingEmployeeForm = () => {
  return (
    <div>
      {/* ... (existing employee form content) ... */}
    </div>
  );
};

const EmployeeManagement = () => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    email: ''
  });

  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false); // State for form visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('../api/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });
  
      if (response.ok) {
        console.log('Employee added successfully');
        // Reset the form or handle success as needed
      } else {
        console.error('Error adding employee');
        // Handle error as needed
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      // Handle error as needed
    }
  };

    // Function to toggle the visibility of the add employee form
  const toggleAddEmployeeForm = () => {
    setShowAddEmployeeForm(!showAddEmployeeForm);
  };

  return (
    <div className="employee-management-container">
      <h2>Employee Management</h2>
      {/* Buttons to toggle form visibility */}
      {showAddEmployeeForm ? (
        <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Hide Add Employee Form</button>
      ) : (
        <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Add New Employee</button>
      )}
      <button className="employee-management-button">View Existing Employee</button>

      {/* Conditional rendering of the form based on showAddEmployeeForm state */}
      {showAddEmployeeForm && (
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="firstName" 
            value={employee.firstName} 
            onChange={handleInputChange} 
            placeholder="First Name"
            className="employee-content-input"
          />
          <input 
            type="text" 
            name="lastName" 
            value={employee.lastName} 
            onChange={handleInputChange} 
            placeholder="Last Name"
            className="employee-content-input"
          />
          <input 
            type="date" 
            name="dob" 
            value={employee.dob} 
            onChange={handleInputChange} 
            placeholder="Date of Birth"
            className="employee-content-input"
          />
          <select 
            name="gender" 
            value={employee.gender} 
            onChange={handleInputChange}
            className="employee-content-gender-input"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input 
            type="tel" 
            name="phoneNumber" 
            value={employee.phoneNumber} 
            onChange={handleInputChange} 
            placeholder="Phone Number"
            className="employee-content-input"
          />
          <input 
            type="email" 
            name="email" 
            value={employee.email} 
            onChange={handleInputChange} 
            placeholder="Email Address"
            className="employee-content-input"
          />
          <button type="submit" className="employee-management-button">Submit</button>
        </form>
      )}
    </div>
  );
};

export default EmployeeManagement;
