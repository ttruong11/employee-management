import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordFromInput, setCurrentPasswordFromInput] = useState('');
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

  useEffect(() => {
    // Fetch existing users here and set them in the users state
    // Example API call (replace with your actual API call):
    fetch(backendURL + '/api/users') // Make sure you have an appropriate API route for fetching users
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Assuming the API response is an array of user objects
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleUserButtonClick = (user) => {
    setSelectedUser(user);
    setNewUsername(''); // Clear the new username field
    setNewPassword(''); // Clear the new password field
  };

  const handleUpdateUsername = async () => {
    if (!selectedUser) {
      return; // Handle the case where no user is selected
    }
  
    // Check if the current password field is empty
    if (!currentPasswordFromInput) {
      console.error('Current password is required');
      // Display an error message to the user
      return;
    }
  
    try {
      // Hash the current password input on the client side
      const hashedCurrentPassword = await bcrypt.hash(currentPasswordFromInput, 10); // 10 is the salt rounds
  
      // Continue with the username update and send the hashed password to the backend
      const updateResponse = await fetch(`${backendURL}/api/users/update-username/${selectedUser.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername, hashedCurrentPassword }), // Send the hashed password
      });
  
      if (updateResponse.ok) {
        console.log('Username updated successfully!');
        // Handle success, maybe update the UI or show a success message
      } else {
        console.error('Error updating username:', updateResponse.statusText);
        // Handle error, display an error message to the user
      }
    } catch (error) {
      console.error('Error updating username:', error);
      // Handle error, display an error message to the user
    }
  };
  
      
  const handleUpdatePassword = async () => {
    if (!selectedUser) {
      return; // Handle the case where no user is selected
    }

    try {
      const response = await fetch(backendURL + `/api/users/update-username/${selectedUser.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        console.log('Password updated successfully!');
        // Handle success, maybe update the UI or show a success message
      } else {
        console.error('Error updating password:', response.statusText);
        // Handle error, display an error message to the user
      }
    } catch (error) {
      console.error('Error updating password:', error);
      // Handle error, display an error message to the user
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Users</h3>
        {users.length > 0 ? (
          <div>
            {users.map((user) => (
              <div key={user.id}>
                <button
                  className="settings-user-button"
                  onClick={() => handleUserButtonClick(user)}
                >
                  {user.username}
                </button>
                {selectedUser === user && (
                  <div className="user-update-fields">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPasswordFromInput}
                      className="settings-user-input"
                      onChange={(e) => setCurrentPasswordFromInput(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="New Username"
                      value={newUsername}
                      className="settings-user-input" 
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <button className="settings-user-input-confirm" onClick={handleUpdateUsername}>Update Username</button>
                    <input
                      type="password"
                      placeholder="New Password"
                      className="settings-user-input" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button className="settings-user-input-confirm" onClick={handleUpdatePassword}>Update Password</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
