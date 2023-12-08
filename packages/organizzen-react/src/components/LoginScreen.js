import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginScreen.css'

function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidLogin, setInvalidLogin] = useState('')
    const [userData, setUserData] = useState([])
    const navigate = useNavigate()

    const handleUsername = (username) => {
        setUsername(username.target.value)
    }
    const handlePassword = (password) => {
        setPassword(password.target.value)
    }
    useEffect(() => {
        fetch('https://organizzen.azurewebsites.net/users')
            .then((response) => response.json())
            .then((data) => setUserData(data))
            .then(setInvalidLogin(false))
            .catch((error) => console.log(error))
    }, [])

    function submitForm(submitEvent) {
        submitEvent.preventDefault()

        console.log(userData)
        const user = userData.users_list.find(
            (u) => u.username === username && u.password === password
        )

        if (user) {
            console.log('Logged in!')
            navigate('/dashboard')
        } else {
            console.log('Invalid username or password.')
            setInvalidLogin(true)
        }
    }

    return (
        <div>
            <div className="loginScreen">
                <div className="loginBox">
                    <h1>Welcome back!</h1>
                    <form className="loginForm">
                        <label htmlFor="username">Username: </label>
                        <br></br>
                        <input id="username" onChange={handleUsername} />
                        <br></br> <br></br>
                        <label htmlFor="password">Password: </label>
                        <br></br>
                        <input
                            id="password"
                            type="password"
                            onChange={handlePassword}
                        />
                        <br></br> <br></br>
                        <button id="submitform" onClick={submitForm}>
                            Login
                        </button>
                    </form>
                    <br />

                    {invalidLogin && (
                        <div>
                            <p style={{ color: 'red' }}>
                                Invalid username or password.
                            </p>
                            <br></br>
                        </div>
                    )}

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
