import React from 'react';
import Sidebar from '../components/Sidebar'; // Adjust the path as necessary
import Home from '../components/Home'; // Adjust the path as necessary
import ChatBot from '../components/chatbot';


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Including the Sidebar component */}
      <div className="">
      </div>
      <div className="main-content">
        {/* Your main content goes here */}
        {/* You can add more content or components here as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
