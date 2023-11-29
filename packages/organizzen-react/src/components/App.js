//MyApp.js

import React, { useState, useEffect } from 'react'
import HomePage from './HomePage'
import NewEvent from './components/NewEvent'
import NewTask from './components/NewTask'
import './MyApp.css'

function MyApp() {
    const [events, setEvents] = useState([])
    const [newEventData, setNewEventData] = useState({
        id: '',
        name: '',
        description: '',
        link: '',
        date: '',
        oneDayOnly: false,
    })

    const [tasks, setTasks] = useState([])
    const [newTaskData, setNewTaskData] = useState({
        id: '',
        name: '',
        description: '',
        link: '',
        deadline: '',
        color: '',
        eventid: '',
    })

    function fetchEvents() {
        const promise = fetch('http://localhost:8000/events')
        return promise
    }

    function fetchTasks(eventId) {
        const promise = fetch(`http://localhost:8000/events/:eventId/tasks`)
        return promise
    }

    function postEvent(newEventData) {
        const promise = fetch('http://localhost:8000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEventData),
        })
        return promise
    }

    function postEvent(newEventData) {
        return fetch('http://localhost:8000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEventData),
        })
            .then((response) => {
                if (response.status === 201) {
                    return response.json()
                } else {
                    throw new Error('Failed to create event')
                }
            })
            .then((createdEvent) => {
                setEvents([...events, createdEvent])
                setNewEventData({
                    name: '',
                    description: '',
                    link: '',
                    date: '',
                    oneDayOnly: false,
                })
            })
            .catch((error) => console.log(error))
    }

    function postTask(newTaskData) {
        const promise = fetch(
            `http://localhost:8000/events/${newTaskData.event}/tasks`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTaskData),
            }
        )
        return promise
    }

    //event effect
    useEffect(() => {
        fetchEvents()
            .then((res) => res.json())
            .then((json) => setEvents(json['events_list']))
            .catch((error) => {
                console.log(error)
            })
    }, [])

    //task effect
    useEffect(() => {
        if (events.length > 0) {
            const firstEvent = events[0]
            //fetchAndDisplayTasks(firstEvent.id);
        }
    }, [events])

    function updateEventList(newEventData) {
        postEvent(newEventData)
            .then((response) => {
                if (response.status === 201) {
                    return response.json()
                } else {
                    throw new Error('Failed to create event')
                }
            })
            .then(() => {
                setEvents([...events, newEventData])
                setNewEventData({
                    id: '',
                    name: '',
                    description: '',
                    link: '',
                    date: '',
                    oneDayOnly: false,
                }) //resets
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function updateTaskList(newTaskData) {
        postTask(newTaskData)
            .then((response) => {
                if (response.status === 201) {
                    return response.json()
                } else {
                    throw new Error('Failed to create new task')
                }
            })
            .then(() => {
                setNewTaskData({
                    id: '',
                    name: '',
                    description: '',
                    link: '',
                    deadline: '',
                    color: '',
                })
            }) //reset
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <HomePage />
            {/* <div className="newButtons">
                <NewEvent
                    newEventData={newEventData}
                    setNewEventData={setNewEventData}
                    handleNewEventSubmit={updateEventList}
                />
                <NewTask
                    newTaskData={newTaskData}
                    setNewTaskData={setNewTaskData}
                    handleNewTaskSubmit={updateTaskList}
                    events={events}
                />
            </div> */}
        </div>
    )
}

export default MyApp
