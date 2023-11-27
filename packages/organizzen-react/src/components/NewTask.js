import React, { useState, useEffect } from 'react'
import './NewTask.css'

function NewTask() {
    const [popup, popupState] = useState(false)
    const [eventOptions, setEventOptions] = useState([])
    const togglePopup = () => {
        popupState(!popup)
    }

    useEffect(() => {
        fetch('http://localhost:8000/events')
            .then((response) => response.json())
            .then((data) => {
                setEventOptions(data.events_list)
            })
    })

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
                            <input id="taskName" name="taskName" />
                            <br></br> <br></br>
                            <label htmlFor="taskDescription">
                                Description:{' '}
                            </label>
                            <br></br>
                            <input id="taskDescription" name="description" />
                            <br></br> <br></br>
                            <label htmlFor="taskLink">Link (Optional): </label>
                            <br></br>
                            <input id="taskDescription" name="description" />
                            <br></br> <br></br>
                            <label htmlFor="taskDate">Deadline: </label>
                            <br></br>
                            <input id="taskDate" type="date" />
                            <br></br> <br></br>
                            <label>
                                Event:
                                <br></br>
                                <select>
                                    {eventOptions.map((event) => (
                                        <option
                                            key={event.id}
                                            value={event.name}
                                        >
                                            {event.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <br></br> <br></br>
                            <label for="color">
                                Label Color:
                                <br></br>
                                <select name="color" id="color">
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
                            />
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewTask
