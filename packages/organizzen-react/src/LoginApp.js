import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignupScreen from './components/SignupScreen'
import LoginScreen from './components/LoginScreen'
import WelcomeScreen from './components/WelcomeScreen'
import App from './MyApp'

const LoginApp = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Fetch the list of events when the component mounts
        fetch('https://organizzen.azurewebsites.net/users')
            .then((response) => response.json())
            .then((data) => setUsers(data.users_list))
            .catch((error) => console.log(error))
    }, []) // Empty dependency array ensures it runs only once on mount

    function postUser(user) {
        // Add the new event to the backend
        const promise = fetch('https://organizzen.azurewebsites.net/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        return promise
    }

    function updateUsers(user) {
        postUser(user)
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error)
                    })
                }
                return response.json()
            })
            .then((data) => {
                setUsers([...users, data])
            })
            .catch((error) => {
                alert(error.message) // Display the error to the user
            })
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomeScreen />} />
                <Route
                    path="/signup"
                    element={<SignupScreen handleSubmit={updateUsers} />}
                />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/dashboard" element={<App />} />
            </Routes>
        </Router>
    )
}

export default LoginApp
