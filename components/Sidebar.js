import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Settings from '../components/Settings';
import EmployeeManagement from '../components/EmployeeManagement'; // Import the EmployeeDetails component
import EmployeeList from '../pages/api/viewEmployeeList';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false); // New state to control employee details display
  const router = useRouter();

  const getContentComponent = () => {
    switch (selectedOption) {
      case 'Employee Management':
        return <EmployeeManagement toggleEmployeeDetailsContainer={toggleEmployeeDetailsContainer} />;
      case 'Settings':
        return <Settings />;
      default:
        return null;
    }
  };

  // Function to toggle the visibility of the employee details container
  const toggleEmployeeDetailsContainer = (showEmployeeDetails) => {
    setShowEmployeeDetails(showEmployeeDetails);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowContent(true);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleBack = () => {
    setSelectedOption(null);
    setShowContent(false);
    setShowEmployeeDetails(false); // Hide employee details container
  };

  useEffect(() => {
    // Reset all relevant states when the sidebar is closed
    if (!sidebarOpen) {
      setSelectedOption(null);
      setShowContent(false);
      setShowEmployeeDetails(false);
    }
  }, [sidebarOpen]);

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? '' : ''}
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

      {/* Employee details container */}
      {showEmployeeDetails && (
        <div className="employee-details-container-1"> {/* Adjust the left position as needed */}
          <EmployeeList />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
