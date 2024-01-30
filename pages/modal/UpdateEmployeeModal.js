// UpdateEmployeeModal.js

import React, { useState } from 'react';

const UpdateEmployeeModal = ({ employee, onUpdate, onClose }) => {
  const [updatedEmployee, setUpdatedEmployee] = useState(employee);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee({ ...updatedEmployee, [name]: value });
  };

  const handleSubmit = () => {
    // Call the update function passed from the parent component
    onUpdate(updatedEmployee);
  };

  return (
    <div className="update-employee-modal">
      <h2>Update Employee Information</h2>
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={updatedEmployee.first_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={updatedEmployee.last_name}
            onChange={handleChange}
          />
        </label>
        {/* Add other input fields for updating employee information */}
        <button type="button" onClick={handleSubmit}>
          Update
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployeeModal;
