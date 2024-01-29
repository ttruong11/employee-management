import React, { useState } from 'react';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Hash the password using bcrypt before sending it to the server
      const hashedPassword = bcrypt.hashSync(password, 10);

      const response = await fetch(backendURL + '/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword, email }), // Send the hashed password
      });

      if (response.status === 201 || response.status === 204) {
        console.log('Registration successful!');
        setUsername(''); // Clear the input fields
        setPassword('');
        setEmail('');
        setErrorMessage(''); // Clear any previous error message
        router.push('/'); // Redirect to the root page after successful registration
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData.error);
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('An error occurred during registration.');
    }
  };

  return (
    <div className="login-container">
      <div className="background-banner-container">
        {/* Content for your background banner */}
      </div>
      <div className="login-form-overlay">
        <div className="login-form-container">
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default SignupForm;
