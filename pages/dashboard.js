import React from 'react';
import Sidebar from '../components/Sidebar'; // Adjust the path as necessary

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Including the Sidebar component */}
      <div className="main-content">
        {/* Your main content goes here */}
        {/* You can add more content or components here as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
