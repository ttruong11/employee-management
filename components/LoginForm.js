import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { signIn, useSession } from 'next-auth/react';

const LoginForm = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const router = useRouter(); 

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

const handleLogin = async (e) => {
  e.preventDefault(); 
  
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
    router.push('/signup'); 
  };

  return (
    <div className="login-container">
      <div className="background-banner-container">
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
            onClick={handleSignupButtonClick} 
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
