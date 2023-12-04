import React from 'react'
import { Link } from 'react-router-dom'
import './LoginScreen.css'

function LoginScreen() {
    return (
        <div>
            <div className="loginScreen">
                <div className="loginBox">
                    <h1>Welcome back!</h1>
                    <form className="loginForm">
                        <label htmlFor="username">Username: </label>
                        <br></br>
                        <input id="username" />
                        <br></br> <br></br>
                        <label htmlFor="password">Password: </label>
                        <br></br>
                        <input id="password" />
                        <br></br> <br></br>
                        <input type="submit" value="Login" id="submitform" />
                    </form>
                    <br></br>
                    <p>
                        <Link to="/signup">
                            Don't have an account yet? Sign up here!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen
