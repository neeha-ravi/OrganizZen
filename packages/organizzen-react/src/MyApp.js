import React, { useState } from 'react'
import HomePage from './components/HomePage'
import NewEvent from './components/NewEvent'
import NewTask from './components/NewTask'
import './MyApp.css'
const App = () => {
    const [events, setEvents] = useState([])

    function postEvent(event) {
        const promise = fetch('Http://localhost:8000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
        return promise
    }

    function updateList(event) {
        postEvent(event)
            .then(() => setEvents([...events, event]))
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <HomePage />
            <div className="newButtons">
                <NewEvent handleSubmit={updateList} />
                <NewTask />
            </div>
        </div>
    )
}

export default App
