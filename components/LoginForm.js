import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter

const LoginForm = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (username === 'admin' && password === 'password') {
      console.log('Login successful!');
      router.push('/dashboard'); // Redirect to /dashboard route
      setErrorMessage(''); // Clear any previous error message
    } else {
      console.error('Login failed. Invalid username or password.');
      setErrorMessage('Incorrect username and password'); // Set error message
    }
  };

  return (
    <div className="login-container">
      <div className="background-banner-container">
        {/* Content for your background banner */}
      </div>
      <div className="login-form-overlay">
        <div className="login-form-container">
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
            <button type="button" className="login-button">Sign-up</button> {/* New Sign-up button */}
            <button type="button" className="login-button">Forgot Password</button> {/* New Forgot Password button */}
          </form>
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message */}

    </div>
  );
};

export default LoginForm;
