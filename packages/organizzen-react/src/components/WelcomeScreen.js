import React from 'react'
import { Link } from 'react-router-dom'
import './WelcomeScreen.css'

function WelcomeScreen() {
    return (
        <div id="welcomeScreen">
            <div className="loginBox">
                <h1>Welcome to OrganizZen!</h1>
                <p>
                    For event planners, team leaders, and collaborative groups
                    who are overwhelmed with a great number of tasks and
                    responsibilities, OrganizZen emerges as an essential event
                    and project management tool. Instead of just offering a
                    simple to-do list, OrganizZen weaves together comprehensive
                    event management capabilities such as a calendar where
                    individuals can schedule meetings and deadlines.
                </p>
                <p>
                    Are you a returning OrganizZer? Log in! Are you new? Become
                    an OrganizZer through our signup form!
                </p>
                <br></br>
                <div id="buttonHolders">
                    <Link to="/login">
                        <button className="routeButtons">Login</button>
                    </Link>

                    <Link to="/signup">
                        <button className="routeButtons">Sign Up</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomeScreen
