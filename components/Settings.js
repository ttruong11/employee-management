import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

  const handleUpdateUsername = () => {
    // Add logic to update the username for the selected user
    // Make an API call to update the username
  };

  const handleUpdatePassword = () => {
    // Add logic to update the password for the selected user
    // Make an API call to update the password
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
