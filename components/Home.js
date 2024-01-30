import React, { useState, useEffect } from 'react';

const Home = () => {
  const [currentEmployeeCount, setCurrentEmployeeCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/api/employees')
      .then(response => response.json())
      .then(data => {
        setCurrentEmployeeCount(data.additionalData.currentEmployeeCount);
        console.log('Fetched employee count:', currentEmployeeCount); // For debugging
      })
      .catch(error => console.error('Error fetching employee count:', error));
  }, []);

  return (
    <div className="quickstart-container">
      <h1>Welcome to Employee Management</h1>
      <p>
        This is your all-in-one solution for managing your employees efficiently.
        Easily track employee information, schedules, and more.
      </p>
      <div className="dashboard-metrics">
        <h2>Current Employees</h2>
        <p>{currentEmployeeCount}</p>
      </div>
    </div>
  );
};

export default Home;
