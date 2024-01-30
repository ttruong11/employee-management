import React, { useState, useEffect } from 'react';

const UsersSection = ({ backendURL }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch existing users and set them in the users state
    fetch(backendURL + '/api/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [backendURL]);

  return (
    <div>
      {users.length > 0 ? (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              {user.username}
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UsersSection;
