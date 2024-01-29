import React, { useState } from 'react';
import { useRouter } from 'next/router';
import EmployeeManagement from '../components/EmployeeManagement'; // Adjust the path as needed


const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showContent, setShowContent] = useState(false); // New state to control content display
  const router = useRouter();

  
  const getContentComponent = () => {
    switch (selectedOption) {
      case 'Employee Management':
        return <EmployeeManagement />;
      // Add cases for other options as you create more components
      default:
        return null;
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowContent(true); // Show content container
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleBack = () => {
    setSelectedOption(null);
    setShowContent(false); // Hide content container
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>

        {sidebarOpen && (
          <div className="side-container-1">
            {selectedOption ? (
              <>
                <button className="sidebar-button">{selectedOption}</button>
                <button className="sidebar-button" onClick={handleBack}>Back</button>
              </>
            ) : (
              <>
                <button className="sidebar-button" onClick={() => handleOptionSelect('Home')}>Home</button>
                <button className="sidebar-button" onClick={() => handleOptionSelect('Employee Management')}>Employee Management</button>
                <button className="sidebar-button" onClick={() => handleOptionSelect('Settings')}>Settings</button>
                <button className="sidebar-button" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content container */}
      {showContent && (
        <div className="side-content-container"> {/* Adjust the left position as needed */}
          {getContentComponent()}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
