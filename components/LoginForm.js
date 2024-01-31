import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import SignupForm from './SignupForm'; // Import the SignupForm component
import { signIn } from 'next-auth/react';

const LoginForm = () => {
  const [username, setUsername] = useState(''); // State for entered username
  const [password, setPassword] = useState(''); // State for entered password
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const router = useRouter(); // Initialize the router
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    const result = await signIn('Credentials', {
      redirect: false, 
      username, 
      password
    });
  
    if (result?.error) {
      setErrorMessage('Incorrect username and password');
    } else {
      router.push('/dashboard');
    }
  };
  

  const handleSignupButtonClick = () => {
    router.push('/signup'); // Navigate to the /signup route
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
          </form>
          <button 
            type="button" 
            className="login-button" 
            onClick={handleSignupButtonClick} // Handle Signup button click
          >
            Sign-up
          </button>
          <button type="button" className="login-button">Forgot Password</button> {/* New Forgot Password button */}
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message */}
    </div>
  );
};

export default LoginForm;
