import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LogoutButton.css'

const LogoutButton = ({ isLoggedIn, username }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        handleRedirectToWelcome()
    }

    const handleRedirectToWelcome = () => {
        // Use navigate to redirect to the welcome page
        navigate('/')
    }

    return (
        <div>
            {isLoggedIn && <span>Welcome, {username}! </span>}
            <button className="logoutbutton" onClick={handleLogout}>
                LOGOUT
            </button>
        </div>
    )
}

export default LogoutButton