import React, { useState, useEffect } from 'react';
import ViewEmployeeList from '../pages/api/viewEmployeeList'; // Import the ViewEmployeeList component

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
  const [successMessage, setSuccessMessage] = useState('');
  const [fetchEmployees, setFetchEmployees] = useState(false); // State to trigger fetching employees
  const [showEmployeeList, setShowEmployeeList] = useState(false); // State to show/hide employee list
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (fetchEmployees) {
      // Fetch existing employees when the fetchEmployees state is true
      fetch(backendURL + '/api/employees') // Replace with your actual API endpoint
        .then((response) => response.json())
        .then((data) => {
          setEmployees(data);
          setFetchEmployees(false); // Reset the state to prevent continuous fetching
          setShowEmployeeList(true); // Show the employee list after fetching
        })
        .catch((error) => console.error('Error fetching employees:', error));
    }
  }, [fetchEmployees]); // Add fetchEmployees as a dependency

  const [employees, setEmployees] = useState([]);

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
        setSuccessMessage('Employee added successfully'); // Set success message
        setEmployee({
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          phoneNumber: '',
          email: ''
        }); // Clear the form fields
        setShowAddEmployeeForm(false); // Hide the form
        setFetchEmployees(true); // Trigger fetching employees
        setShowEmployeeList(false); // Hide the employee list
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
    setSuccessMessage(''); // Clear the success message when toggling the form
    setShowEmployeeList(false); // Hide the employee list when toggling the form
  };

  // Function to toggle the visibility of the employee list
  const toggleEmployeeList = () => {
    setShowEmployeeList(!showEmployeeList);
    if (showAddEmployeeForm) {
      setShowAddEmployeeForm(false); // Hide the add employee form if it's open
    }
  };

  return (
    <div className="employee-management-container">
      <h2>Employee Management</h2>
      {/* Buttons to toggle form visibility and display success message */}
      {successMessage ? (
        <div className="success-message">
          {successMessage}
        </div>
      ) : (
        <>
          {showAddEmployeeForm ? (
            <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Back</button>
          ) : (
            <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Add New Employee</button>
          )}
        </>
      )}

      {/* Conditional rendering of the form based on showAddEmployeeForm state */}
      {showAddEmployeeForm && (
        <form onSubmit={handleSubmit}>
          {/* Form input fields here */}
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
          {/* Add a submit button here */}
          <button type="submit" className="employee-management-button">Submit</button>
        </form>
      )}

      {/* Include the "Add Another Employee" button after an employee has been added */}
      {successMessage && (
        <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Add Another Employee</button>
      )}

      {/* Include the "View Existing Employee" button that fetches data */}
      <button className="employee-management-button" onClick={toggleEmployeeList}>View Existing Employee</button>
      {/* Conditional rendering of the ViewEmployeeList component */}
      {showEmployeeList && <ViewEmployeeList />}
    </div>
  );
};

export default EmployeeManagement;
