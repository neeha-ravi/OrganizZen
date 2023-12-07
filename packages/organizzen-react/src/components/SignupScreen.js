// SignupScreen.js

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginScreen.css'

function SignupScreen(props) {
    const navigate = useNavigate()
    const [userFormData, setUserFormData] = useState({
        userId: '',
        username: '',
        password: '',
        email: '',
    })

    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserFormData({
            ...userFormData,
            [name]: value,
        })
    }

    const validateForm = () => {
        // Check if all three fields are filled
        return (
            userFormData.username.trim() !== '' &&
            userFormData.password.trim() !== '' &&
            userFormData.email.trim() !== ''
        )
    }

    const submitForm = async () => {
        if (validateForm()) {
            try {
                // Check if the username already exists on the server side
                const response = await fetch('http://localhost:8001/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch users.')
                }

                const usersData = await response.json()
                const existingUser = usersData.users_list.find(
                    (u) => u.username === userFormData.username
                )

                if (existingUser) {
                    alert('Username or email already exists.')
                } else {
                    // Proceed with form submission
                    const registrationUrl = 'http://localhost:8001/users'
                    const registrationResponse = await fetch(registrationUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: userFormData.username,
                            password: userFormData.password,
                            // Add other user details if needed
                        }),
                    })

                    if (!registrationResponse.ok) {
                        throw new Error('Failed to register user.')
                    }

                    const registrationData = await registrationResponse.json()
                    console.log(
                        'Account created successfully!',
                        registrationData
                    )
                    // Optionally, you can navigate to the dashboard or display a success message
                    navigate('/dashboard')
                }
            } catch (error) {
                console.error('Error submitting form:', error)
                alert('Error submitting form. Please try again.')
            }
        } else {
            alert('Please fill in ALL fields.')
        }
    }

    return (
        <div className="loginScreen">
            <div className="loginBox">
                <h1>Sign up here!</h1>
                <form className="loginForm" onSubmit={submitForm}>
                    <label htmlFor="username">Username: </label>
                    <br />
                    <input
                        id="username"
                        name="username"
                        onChange={handleChange}
                        value={userFormData.username}
                    />
                    <br /> <br />
                    <label htmlFor="password">Password: </label>
                    <br />
                    <input
                        id="password"
                        name="password"
                        onChange={handleChange}
                        value={userFormData.password}
                    />
                    <br /> <br />
                    <label htmlFor="email">Email: </label>
                    <br />
                    <input
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={userFormData.email}
                    />
                    <br /> <br />
                    <input type="submit" value="Sign up" id="submitform" />
                </form>
                <br />
                <p>
                    <Link to="/login">Already on OrganizZen? Log in here!</Link>
                </p>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        </div>
    )
}

export default SignupScreen
