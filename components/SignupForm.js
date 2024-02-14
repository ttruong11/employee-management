import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const handleBackButton = () => {
    router.push('/'); 
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(backendURL + '/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.status === 201 || response.status === 204) {
        console.log('Registration successful!');
        setUsername(''); 
        setPassword('');
        setEmail('');
        setErrorMessage(''); 
        router.push('/'); 
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
          <button className="login-button" onClick={handleBackButton}>Return To Login</button>
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default SignupForm;
