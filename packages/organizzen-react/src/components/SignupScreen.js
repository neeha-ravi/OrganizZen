import React from 'react'
import './LoginScreen.css'

function SignupScreen() {
    return (
        <div>
            <div className="loginBox">
                <h1>Sign up here!</h1>
                <form className="loginForm">
                    <label htmlFor="username">Username: </label>
                    <br></br>
                    <input id="username" />
                    <br></br> <br></br>
                    <label htmlFor="password">Password: </label>
                    <br></br>
                    <input id="password" />
                    <br></br> <br></br>
                    <label htmlFor="password">Email: </label>
                    <br></br>
                    <input id="email" />
                    <br></br> <br></br>
                    <input type="submit" value="Sign up" id="submitform" />
                </form>
                <br></br>
                <p>Already on OrganizZen? Log in here!</p>
            </div>
        </div>
    )
}

export default SignupScreen
