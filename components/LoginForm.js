import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import SignupForm from './SignupForm'; // Import the SignupForm component
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

const LoginForm = () => {
  const [username, setUsername] = useState(''); // State for entered username
  const [password, setPassword] = useState(''); // State for entered password
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup
  const router = useRouter(); // Initialize the router
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Hash the password using bcrypt before sending it to the server
      const hashedPassword = bcrypt.hashSync(password, 10);

      const response = await fetch(backendURL + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: password }), // Send the hashed password
      });

      if (response.ok) {
        console.log('Login successful!');
        router.push('/dashboard'); // Redirect to /dashboard route
        setErrorMessage(''); // Clear any previous error message
      } else {
        console.error('Login failed. Invalid username or password.');
        setErrorMessage('Incorrect username and password'); // Set error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Login failed. Please try again later.'); // Set a generic error message
    }
  };

  return (
    <div className="login-container">
      <div className="background-banner-container">
        {/* Content for your background banner */}
      </div>
      <div className="login-form-overlay">
        <div className="login-form-container">
          {isSignup ? (
            <SignupForm />
          ) : (
            <form onSubmit={handleLogin}>
              <input 
                type="text" 
                placeholder="Username" 
                className="login-input" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="login-input" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button type="submit" className="login-button">Login</button>
              <button 
                type="button" 
                className="login-button" 
                onClick={() => setIsSignup(true)} // Show the SignupForm when clicked
              >
                Sign-up
              </button>
              <button type="button" className="login-button">Forgot Password</button> {/* New Forgot Password button */}
            </form>
          )}
          {isSignup && (
            <button
              type="button"
              className="login-button"
              onClick={() => setIsSignup(false)} // Return to the login form
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message */}
    </div>
  );
};

export default LoginForm;
