import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';

const Home = () => {
  const [showSignupForm, setShowSignupForm] = useState(true); // State to control form visibility

  // Callback function to hide the signup form after successful registration
  const handleSignupSuccess = () => {
    setShowSignupForm(false);
  };

  return (
    <div className="bodyContainer">
      <div className="loginFormContainer">
        <LoginForm showSignupForm={showSignupForm} onSignupSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
};

export default Home;
