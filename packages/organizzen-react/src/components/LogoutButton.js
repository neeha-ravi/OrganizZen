import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/index.module.css';
import './LogoutButton.css';

const LogoutButton = ({ isLoggedIn, username }) => { 
    const navigate = useNavigate();

  const handleLogout = () => {
    handleRedirectToWelcome()
  }

  const handleRedirectToWelcome = () => {
    // Use navigate to redirect to the welcome page
    navigate('/');
  };

  return (
    <div>
      {isLoggedIn && <span>Welcome, {username}! </span>}
      <button onClick={handleLogout}>{isLoggedIn ? 'Logout' : 'Redirect to Welcome Page'}</button>
    </div>
  );
};

export default LogoutButton;
