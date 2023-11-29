import React, { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import NewEvent from './components/NewEvent'
import NewTask from './components/NewTask'
import './MyApp.css'

const App = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        // Fetch the list of events when the component mounts
        fetch('http://localhost:8000/events')
            .then((response) => response.json())
            .then((data) => setEvents(data.events_list))
            .catch((error) => console.log(error))
    }, []) // Empty dependency array ensures it runs only once on mount

    function postEvent(event) {
        // Add the new event to the backend
        fetch('http://localhost:8000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        })
            .then(() => {
                // After successfully adding the event, fetch the updated list
                return fetch('http://localhost:8000/events')
            })
            .then((response) => response.json())
            .then((data) => setEvents(data.events_list))
            .catch((error) => console.log(error))
    }

    function postTask(eventId, task) {
        // Add the new task to the backend
        fetch(`http://localhost:8000/events/${eventId}/tasks`, {
            // <-- Note '/tasks' here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
            .then(() => {
                // After successfully adding the task, fetch the updated list
                return fetch(`http://localhost:8000/events/${eventId}/tasks`)
            })
            .then((response) => response.json())
            .then((data) => {
                // Update the tasks for the specific event in the state
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === eventId ? { ...event, tasks: data } : event
                    )
                )
            })
            .catch((error) => console.log(error))
    }

    return (
        <div>
            <HomePage />
            <div className="newButtonContainer">
                <div className="ButtonsContainer">
                    <NewEvent handleSubmit={postEvent} />
                    {/* Pass addTask function as a prop to NewTask component */}
                    <div className="ButtonDivider"></div>
                    <NewTask handleSubmit={postTask} events={events} />
                </div>
                <div className="ButtonOtherDivider" />
                <div className="TaskWidth" />
            </div>
            {/* Render the list of events and tasks */}
            {events.map((event) => (
                <div key={event.id}>
                    <h3>{event.name}</h3>
                    <ul>
                        {event.tasks.map((task) => (
                            <li key={task.id}>{task.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default App