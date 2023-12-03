import React, { useState, useEffect } from 'react'
import SignupScreen from './components/SignupScreen'

const LoginApp = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Fetch the list of events when the component mounts
        fetch('http://localhost:8001/users')
            .then((response) => response.json())
            .then((data) => setUsers(data.users_list))
            .catch((error) => console.log(error))
    }, []) // Empty dependency array ensures it runs only once on mount

    function postUser(user) {
        // Add the new event to the backend
        const promise = fetch('http://localhost:8001/users', {
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
            .then(() => setUsers([...users, user]))
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <SignupScreen handleSubmit={updateUsers} />
        </div>
    )
}

export default LoginApp
