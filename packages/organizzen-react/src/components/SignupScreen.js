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

    const submitForm = async (event) => {
        event.preventDefault()
        if (validateForm()) {
            props.handleSubmit(userFormData)
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
                window.location.href = 'http://localhost:3000/signup'
            } else {
                setUserFormData({
                    userId: '',
                    username: '',
                    password: '',
                    email: '',
                })
                navigate('/dashboard')
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
            </div>
        </div>
    )
}

export default SignupScreen
