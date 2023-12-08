import React, { useState, useEffect } from 'react'
import './NewTask.css'

function NewTask(props) {
    const [task, setTask] = useState({
        name: '',
        description: '',
        link: '',
        date: '',
        color: '',
        event: '',
        done: false,
    })

    const [selectedColor, setSelectedColor] = useState('none')

    function submitForm(event) {
        event.preventDefault()
        const currentDate = new Date()

        if (selectedDate === '') {
            setInvalidInput(3)
            return
        } else if (selectedDate > selectedEventData.endDate) {
            if (selectedEventData.oneDayOnly === false) {
                setInvalidInput(1)
            }
            return
        } else if (
            selectedDate < currentDate ||
            selectedDate > selectedEventData.endDate
        ) {
            setInvalidInput(1)
            return
        } else if (inputName === '') {
            setInvalidInput(2)
            return
        }

        const updatedTask = {
            ...task,
            id: `${selectedEvent}_${task.name}_${Math.floor(
                Math.random() * 1000000
            )}`,
            event: selectedEvent,
        }

        fetch(`https://organizzen.azurewebsites.net/events/${selectedEvent}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Task added successfully:', data)
                props.handleSubmit(selectedEvent, updatedTask)
            })
            .catch((error) => {
                console.error('Error adding task:', error)
            })

        setTask({
            name: '',
            description: '',
            link: '',
            date: '',
            color: '',
            event: '',
            done: false,
        })

        const form = document.getElementById('taskForm')
        form.submit()
    }

    const [inputName, setInputName] = useState('')
    const [selectedDate, setSelectedDate] = useState('')

    function handleChange(e) {
        const { name, value } = e.target
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
            event: selectedEvent,
        }))
        if (name === 'date') {
            setSelectedDate(value)
        }
        if (name === 'name') {
            setInputName(value)
        }
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
        setInvalidInput(0)
    }

    const [invalidInput, setInvalidInput] = useState([])
    const [eventOptions, setEventOptions] = useState([])

    useEffect(() => {
        fetch('https://organizzen.azurewebsites.net/events')
            .then((response) => response.json())
            .then((data) => {
                const eventsList = data || []

                if (eventsList.length > 0) {
                    setEventOptions(eventsList)
                    setEventSelect(eventsList[0].id)
                    setSelectedEventData(
                        eventsList.find(
                            (event) => event.id === eventsList[0].id
                        )
                    )
                    setInvalidInput(0)
                } else {
                    console.error('No events available.')
                }
            })
    }, [])

    const [selectedEventData, setSelectedEventData] = useState([])
    const [selectedEvent, setEventSelect] = useState(eventOptions[0])

    const handleEventSelect = (e) => {
        setEventSelect(e.target.value)
        setSelectedEventData(
            eventOptions.find((event) => event.id === e.target.value)
        )
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
                        <form className="popupForm" id="taskForm">
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
                            <input
                                id="link"
                                name="link"
                                onChange={handleChange}
                            />
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
                                    value={selectedEvent || ''}
                                >
                                    {eventOptions.length === 0 && (
                                        <option value="">
                                            Loading events...
                                        </option>
                                    )}
                                    {eventOptions.map((event) => (
                                        <option value={event.id} key={event.id}>
                                            {event.name}
                                        </option>
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
                                        className={`color-button ${
                                            selectedColor === 'none'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#ffffff' }}
                                        onClick={() =>
                                            handleColorChange('none')
                                        }
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#f59d9d'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#f59d9d' }}
                                        onClick={() =>
                                            handleColorChange('#f59d9d')
                                        }
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#f5c99d'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#f5c99d' }}
                                        onClick={() =>
                                            handleColorChange('#f5c99d')
                                        }
                                    ></button>
                                </div>
                                <div className="color-options">
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#f5df9d'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#f5df9d' }}
                                        onClick={() =>
                                            handleColorChange('#f5df9d')
                                        }
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#a8c7a7'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#a8c7a7' }}
                                        onClick={() =>
                                            handleColorChange('#a8c7a7')
                                        }
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#9bc1cc'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#9bc1cc' }}
                                        onClick={() =>
                                            handleColorChange('#9bc1cc')
                                        }
                                    ></button>
                                </div>
                                <div className="color-options">
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#a3a3e0'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#a3a3e0' }}
                                        onClick={() =>
                                            handleColorChange('#a3a3e0')
                                        }
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#d6a3e0'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#d6a3e0' }}
                                        onClick={() =>
                                            handleColorChange('#d6a3e0')
                                        }
                                    ></button>
                                    <button
                                        type="button"
                                        className={`color-button ${
                                            selectedColor === '#e0a3b6'
                                                ? 'selected'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: '#e0a3b6' }}
                                        onClick={() =>
                                            handleColorChange('#e0a3b6')
                                        }
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
                        <div>
                            {(() => {
                                switch (invalidInput) {
                                    case 1:
                                        return (
                                            <p style={{ color: 'red' }}>
                                                Deadline does not match date
                                                range of selected event.
                                            </p>
                                        )
                                    case 2:
                                        return (
                                            <p style={{ color: 'red' }}>
                                                Please input a task name.
                                            </p>
                                        )
                                    case 3:
                                        return (
                                            <p style={{ color: 'red' }}>
                                                Please set a task deadline.
                                            </p>
                                        )
                                    default:
                                        return null
                                }
                            })()}
                            <br></br>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewTask
