import React, { useState, useEffect } from 'react'
import './NewTask.css'

function NewTask(props) {
    const [task, setTask] = useState({
        id: '',
        name: '',
        description: '',
        link: '',
        date: '',
        color: '',
        event: '',
    })

    function submitForm() {
        props.handleSubmit(selectedEvent, task)
        setTask({
            id: '',
            name: '',
            description: '',
            link: '',
            date: '',
            color: '',
            event: '',
        })
    }
    function handleChange(e) {
        const { name, value } = e.target
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
            event: selectedEvent,
        }))
    }

    const [popup, popupState] = useState(false)
    const togglePopup = () => {
        popupState(!popup)
    }

    const [eventOptions, setEventOptions] = useState([])
    useEffect(() => {
        fetch('http://localhost:8000/events')
            .then((response) => response.json())
            .then((data) => {
                setEventOptions(data.events_list)
            })
    })

    const [selectedEvent, setEventSelect] = useState(eventOptions[0])
    const handleEventSelect = (e) => {
        setEventSelect(e.target.value)
    }

    return (
        <>
            <button className="popupButton" onClick={togglePopup}>
                New Task
            </button>

            {popup && (
                <div className="popupWindow">
                    <div className="overlay"></div>
                    <div className="popupContent">
                        <button id="popupClose" onClick={togglePopup}>
                            X
                        </button>
                        <h1>New Task</h1>
                        <form className="popupForm">
                            <label htmlFor="taskName">Name: </label>
                            <br></br>
                            <input
                                id="name"
                                name="name"
                                onChange={handleChange}
                            />
                            <br></br> <br></br>
                            <label htmlFor="taskDescription">
                                Description:{' '}
                            </label>
                            <br></br>
                            <input
                                id="description"
                                name="description"
                                onChange={handleChange}
                            />
                            <br></br> <br></br>
                            <label htmlFor="taskLink">Link (Optional): </label>
                            <br></br>
                            <input
                                id="link"
                                name="link"
                                onChange={handleChange}
                            />
                            <br></br> <br></br>
                            <label htmlFor="date">Deadline: </label>
                            <br></br>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                onChange={handleChange}
                            />
                            <br></br> <br></br>
                            <label>
                                Event:
                                <br></br>
                                <select
                                    name="event"
                                    id="event"
                                    onChange={handleEventSelect}
                                    value={selectedEvent}
                                >
                                    {eventOptions.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <br></br> <br></br>
                            <label for="color">
                                Label Color:
                                <br></br>
                                <select
                                    name="color"
                                    id="color"
                                    onChange={handleChange}
                                >
                                    <option value="none">None</option>
                                    <option value="red">Red</option>
                                    <option value="orange">Orange</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="green">Green</option>
                                    <option value="blue">Blue</option>
                                    <option value="purple">Purple</option>
                                    <option value="pink">Pink</option>
                                    <option value="brown">Brown</option>
                                </select>
                            </label>
                            <br></br> <br></br>
                            <input
                                type="submit"
                                value="Submit"
                                id="submitform"
                                onClick={submitForm}
                            />
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewTask
