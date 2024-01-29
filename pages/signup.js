import React from 'react';
import SignupForm from '../components/SignupForm';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <SignupForm /> {/* Including the Sidebar component */}
      <div className="main-content">
        {/* Your main content goes here */}
        {/* You can add more content or components here as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
