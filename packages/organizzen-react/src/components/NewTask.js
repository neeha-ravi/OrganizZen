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

    // Add a state to keep track of the selected color
    const [selectedColor, setSelectedColor] = useState('none')

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

    function handleColorChange(color) {
        setTask((prevTask) => ({
            ...prevTask,
            color: color,
        }))
        setSelectedColor(color)
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
    }, [])

    const [selectedEvent, setEventSelect] = useState(eventOptions[0])
    const handleEventSelect = (e) => {
        setEventSelect(e.target.value)
        console.log('Selected Event ID:', e.target.value)
    }

    return (
        <>
            <button className="popupButton" onClick={togglePopup}>
                Add Task
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
                            <br />
                            <input
                                id="name"
                                name="name"
                                onChange={handleChange}
                            />
                            <br /> <br />
                            <label htmlFor="taskDescription">
                                Description:{' '}
                            </label>
                            <br />
                            <input
                                id="description"
                                name="description"
                                onChange={handleChange}
                            />
                            <br /> <br />
                            <label htmlFor="taskLink">Link (Optional): </label>
                            <br />
                            <input id="link" name="link" onChange={handleChange} />
                            <br /> <br />
                            <label htmlFor="date">Deadline: </label>
                            <br />
                            <input
                                id="date"
                                type="date"
                                name="date"
                                onChange={handleChange}
                            />
                            <br /> <br />
                            <label>
                                Event:
                                <br />
                                <select
                                    name="event"
                                    id="event"
                                    onChange={handleEventSelect}
                                    value={selectedEvent}
                                >
                                    {eventOptions.map((event) => (
                                        <option value={event.id}>{event.name}</option>
                                    ))}
                                </select>
                            </label>
                            <br /> <br />
                            <label htmlFor="color">
                                Label Color:
                                <br />
                                <div className="color-options">
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === 'none' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#ffffff' }}
                                        onClick={() => handleColorChange('none')}
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#f59d9d' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#f59d9d' }}
                                        onClick={() => handleColorChange('#f59d9d')}
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#f5c99d' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#f5c99d' }}
                                        onClick={() => handleColorChange('#f5c99d')}
                                    ></button>
                                </div>
                                <div className="color-options">
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#f5df9d' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#f5df9d' }}
                                        onClick={() => handleColorChange('#f5df9d')}
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#a8c7a7' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#a8c7a7' }}
                                        onClick={() => handleColorChange('#a8c7a7')}
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#9bc1cc' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#9bc1cc' }}
                                        onClick={() => handleColorChange('#9bc1cc')}
                                    ></button>
                                </div>
                                <div className="color-options">
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#a99bcc' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#a99bcc' }}
                                        onClick={() => handleColorChange('#a99bcc')}
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === '#f5c3cb' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#f5c3cb' }}
                                        onClick={() => handleColorChange('#f5c3cb')}
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${selectedColor === 'brown' ? 'selected' : ''}`}
                                        style={{ backgroundColor: '#6b5145' }}
                                        onClick={() => handleColorChange('brown')}
                                    ></button>
                                </div>
                            </label>
                            <br /> <br />
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