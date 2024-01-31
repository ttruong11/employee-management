import React, { useState, useEffect } from 'react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
      fetch(`http://localhost:3001/api/employees/${Id}`, {
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

  const handleUpdateEmployee = (employee) => {
    // Implement the logic to update an employee here
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
              <tr key={employee.employee_id}>
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
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
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
          <button className="employee-details-button" onClick={() => handleUpdateEmployee(selectedEmployee)}>Update</button>
          <button className="employee-details-button" onClick={() => handleDeleteEmployee(selectedEmployee)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
