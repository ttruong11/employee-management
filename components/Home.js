import React, { useState, useEffect } from 'react';

const Home = () => {
  const [currentEmployeeCount, setCurrentEmployeeCount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(backendURL + '/api/employee-metrics')
      .then(response => response.json())
      .then(data => {
        setCurrentEmployeeCount(data.currentEmployeeCount);
        setTotalSalary(data.totalSalarySum);
        console.log('Fetched employee metrics:', data);
      })
      .catch(error => console.error('Error fetching employee metrics:', error));
  }, []);
  

  return (
    <div className="quickstart-container">
      <h1>Welcome to Employee Management</h1>
      <p>
        This is your all-in-one solution for managing your employees efficiently.
        Easily track employee information, schedules, and more.
      </p>
      <div className="dashboard-metrics">
        <h2>Employees</h2>
        <p className="dashboard-employee-stats">{currentEmployeeCount}</p>
      </div>
      
      <div className="dashboard-metrics"> {/* Add a new section for Total Salary */}
        <h2>Total Salary</h2>
        <p className="dashboard-employee-stats">{totalSalary}</p>
      </div>
    </div>
  );
};

export default Home;
