import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    job_role: '',
    salary: '',
    phone_number: '', // Added phone_number to the state
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/api/employees?page=${currentPage}&limit=5`)
      .then(response => response.json())
      .then(data => {
        setEmployees(data.employees);
        setTotalPages(data.totalPages);
        console.log('Fetched employees:', data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, [currentPage]);

  const toggleEmployeeDetails = (employee) => {
    setSelectedEmployee(selectedEmployee === employee ? null : employee);
  };

  const handleDeleteEmployee = (employee) => {
    const employeeId = employee.id;
    if (employeeId) {
      fetch(`http://localhost:3001/api/employees/${employeeId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 200) {
            setEmployees(employees.filter(e => e.id !== employeeId));
            setSelectedEmployee(null);
          } else {
            console.error('Error deleting employee:', response.statusText);
          }
        })
        .catch(error => console.error('Error deleting employee:', error));
    } else {
      console.error('Invalid employee ID:', employeeId);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditFormData({
        first_name: selectedEmployee.first_name,
        last_name: selectedEmployee.last_name,
        dob: selectedEmployee.dob,
        email: selectedEmployee.email,
        job_role: selectedEmployee.job_role,
        salary: selectedEmployee.salary,
        phone_number: selectedEmployee.phone_number, // Set the phone_number when editing
      });
    }
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleUpdateEmployee = (event) => {
    event.preventDefault();
    const updatedEmployee = { ...selectedEmployee, ...editFormData };

    fetch(`http://localhost:3001/api/employees/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Employee updated:', data);
        setIsEditing(false);
        setSelectedEmployee(null);
        // Refetch the employee list to reflect the changes
        fetch(`http://localhost:3001/api/employees?page=${currentPage}&limit=5`)
          .then(response => response.json())
          .then(data => {
            setEmployees(data.employees);
          });
      })
      .catch(error => console.error('Error updating employee:', error));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="employee-list-container">
      <div className="employee-list-scroll">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.first_name} {employee.last_name} {employee.employee_id}</td>
                <td>
                  <button className="employee-details-button" onClick={() => toggleEmployeeDetails(employee)}>
                    {selectedEmployee === employee ? 'Hide Details' : 'Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls">
        <button className="pagination-button" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="pagination-button" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {selectedEmployee && (
        <div className="employee-details-container">
          <h3>Employee Details</h3>
          {selectedEmployee.image_url && (
            <img src={selectedEmployee.image_url} className="circular-image" alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`} />
          )}
          {isEditing ? (
            <form onSubmit={handleUpdateEmployee}>
              <input type="text" name="first_name" value={editFormData.first_name} onChange={handleEditFormChange} />
              <input type="text" name="last_name" value={editFormData.last_name} onChange={handleEditFormChange} />
              <input type="text" name="dob" value={editFormData.dob} onChange={handleEditFormChange} />
              <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} />
              <input type="text" name="job_role" value={editFormData.job_role} onChange={handleEditFormChange} />
              <input type="text" name="salary" value={editFormData.salary} onChange={handleEditFormChange} />
              <input type="text" name="phone_number" value={editFormData.phone_number} onChange={handleEditFormChange} />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={toggleEdit}>Cancel</button>
            </form>
          ) : (
            <>
              <p>First Name: {selectedEmployee.first_name}</p>
              <p>Last Name: {selectedEmployee.last_name}</p>
              <p>Date of Birth: {formatDate(selectedEmployee.dob)}</p>
              <p>Email: {selectedEmployee.email}</p>
              <p>Job: {selectedEmployee.job_role}</p>
              <p>Salary: {selectedEmployee.salary}</p>
              <p>Phone Number: {selectedEmployee.phone_number}</p>
              <button className="employee-details-button" onClick={toggleEdit}>Edit</button>
              <button className="employee-details-button" onClick={() => handleDeleteEmployee(selectedEmployee)}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
