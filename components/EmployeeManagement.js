import React, { useState, useEffect } from 'react';
import ViewEmployeeList from '../pages/api/viewEmployeeList'; // Ensure this path is correct
import ImageUpload from './ImageUpload'; // Ensure this path is correct

const EmployeeManagement = ({ toggleEmployeeDetailsContainer }) => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    email: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fetchEmployees, setFetchEmployees] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [employees, setEmployees] = useState([]);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (fetchEmployees) {
      fetch(backendURL + '/api/employees')
        .then(response => response.json())
        .then(data => {
          setEmployees(data);
          setFetchEmployees(false);
          setShowEmployeeList(true);
        })
        .catch(error => console.error('Error fetching employees:', error));
    }
  }, [fetchEmployees]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(backendURL + '/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please upload an image for the employee.');
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) {
      alert('Failed to upload image.');
      return;
    }

    const employeeData = { ...employee, imageUrl };
    try {
      const response = await fetch(`../api/addEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        setSuccessMessage('Employee added successfully');
        setEmployee({
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          phoneNumber: '',
          email: ''
        });
        setSelectedFile(null);
        setShowAddEmployeeForm(false);
        setFetchEmployees(true);
        setShowEmployeeList(false);
      } else {
        console.error('Error adding employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const toggleAddEmployeeForm = () => {
    setShowAddEmployeeForm(!showAddEmployeeForm);
    setSuccessMessage('');
    setShowEmployeeList(false);
  };

  const toggleEmployeeList = () => {
    setShowEmployeeList(!showEmployeeList);
    if (showAddEmployeeForm) {
      setShowAddEmployeeForm(false);
    }
  };

  const handleBackButton = () => {
    setShowAddEmployeeForm(false);
  };

  return (
    <div className="employee-management-container">
      <h2>Employee Management</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {!successMessage && (
        <>
          {showAddEmployeeForm ? (
            <form onSubmit={handleSubmit}>
              <ImageUpload
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                allowedTypes={['image/jpeg', 'image/png', 'image/gif']}
              />
              <input type="text" name="firstName" value={employee.firstName} onChange={handleInputChange} placeholder="First Name" className="employee-content-input" />
              <input type="text" name="lastName" value={employee.lastName} onChange={handleInputChange} placeholder="Last Name" className="employee-content-input" />
              <input type="date" name="dob" value={employee.dob} onChange={handleInputChange} placeholder="Date of Birth" className="employee-content-input" />
              <select name="gender" value={employee.gender} onChange={handleInputChange} className="employee-content-gender-input">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="tel" name="phoneNumber" value={employee.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className="employee-content-input" />
              <input type="email" name="email" value={employee.email} onChange={handleInputChange} placeholder="Email Address" className="employee-content-input" />
              <button type="submit" className="employee-management-button">Submit</button>
              <button className="employee-management-button" onClick={handleBackButton}>Back</button>
            </form>
          ) : (
            <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Add New Employee</button>
          )}
        </>
      )}
      {successMessage && <button className="employee-management-button" onClick={toggleAddEmployeeForm}>Add Another Employee</button>}
      <button className="employee-management-button" onClick={() => toggleEmployeeDetailsContainer(true)}>View Existing Employee</button>
      {showEmployeeList && <ViewEmployeeList />}
    </div>
  );
};

export default EmployeeManagement;
