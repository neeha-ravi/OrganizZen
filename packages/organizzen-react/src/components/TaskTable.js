import React, { useState, useEffect } from 'react'
import './TaskTable.css'

function TaskTable({ filter }) {
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [showCompleted, setShowCompleted] = useState(
        localStorage.getItem('showCompleted') === 'true' ? true : false
    )
    const [taskDetailsPopup, setTaskDetailsPopupState] = useState(false)
    const toggleTaskDetailsPopup = () => {
        setTaskDetailsPopupState(!taskDetailsPopup)
    }

    useEffect(() => {
        // Fetch all tasks initially
        fetch('http://localhost:8000/events/tasks')
            .then((response) => response.json())
            .then((data) => {
                const allTasks = data
                const initialCompletedTasks = allTasks.filter(
                    (task) => task.done
                )
                setCompletedTasks(initialCompletedTasks)
                setTasks(allTasks)
            })
            .catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        // Update localStorage whenever completedTasks state changes
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks))
    }, [completedTasks])

    useEffect(() => {
        // Check if there are events selected in the filter
        if (filter.size > 0) {
            // Fetch tasks for each eventId in the filter
            Promise.all(
                [...filter].map((eventId) =>
                    fetch(`http://localhost:8000/events/${eventId}/tasks`)
                )
            )
                .then((responses) =>
                    Promise.all(responses.map((response) => response.json()))
                )
                .then((data) => {
                    // Flatten the array of arrays into a single array of tasks
                    const filteredTasks = data.flat()
                    setTasks(filteredTasks)
                })
                .catch((error) => console.log(error))
        } else {
            // If no events are selected, fetch all tasks
            fetch('http://localhost:8000/events/tasks')
                .then((response) => response.json())
                .then((data) => setTasks(data))
                .catch((error) => console.log(error))
        }
    }, [filter])

    const groupTasksByDate = () => {
        const groupedTasks = {}
        tasks.forEach((task) => {
            if (!groupedTasks[task.date]) {
                groupedTasks[task.date] = []
            }
            groupedTasks[task.date].push(task)
        })
        return groupedTasks
    }

    function handleDelete(taskId, eventId) {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this task?'
        )

        if (!confirmDelete) {
            return
        }

        // Make a DELETE request to remove the task
        fetch(`http://localhost:8000/events/${eventId}/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete task')
                }

                // Update the local state to remove the deleted task
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== taskId)
                )

                // If the task is completed, update completedTasks as well
                setCompletedTasks((prevCompletedTasks) =>
                    prevCompletedTasks.filter(
                        (completedTask) => completedTask.id !== taskId
                    )
                )
            })
            .catch((error) => {
                console.error('Error deleting task:', error)
            })
    }

    // eslint-disable-next-line no-unused-vars
    function fetchTasks(eventId) {
        if (!eventId) {
            console.error('No event ID provided.')
            return
        }

        // Make a GET request to fetch tasks for the specified event
        fetch(`http://localhost:8000/events/${eventId}/tasks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks')
                }
                return response.json()
            })
            .then((tasks) => {
                // Process the fetched tasks, update state, or perform other actions
                console.log('Fetched tasks for event', eventId, ':', tasks)

                // Use the current state to update tasks, preventing potential race conditions
                setTasks((prevTasks) => {
                    // Create a new array with the updated tasks
                    const updatedTasks = prevTasks.map((task) =>
                        task.eventId === eventId
                            ? tasks.find((t) => t.id === task.id) || task
                            : task
                    )

                    return updatedTasks
                })
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error)
            })
    }

    function handleDone(taskId, eventId) {
        const isCompleted = completedTasks.some(
            (completedTask) => completedTask.id === taskId
        )

        // Make a PUT request to update the task as done or undone
        fetch(
            `http://localhost:8000/events/${eventId}/tasks/${taskId}/${
                isCompleted ? 'undo' : 'mark-as-done'
            }`,
            {
                method: 'PUT',
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        isCompleted
                            ? 'Failed to undo task'
                            : 'Failed to mark task as done'
                    )
                }

                // Update the local state with the modified tasks
                const updatedTasks = tasks.map((task) =>
                    task.id === taskId ? { ...task, done: !task.done } : task
                )
                setTasks(updatedTasks)

                // Move the task between incomplete and completed tasks based on its current state
                if (isCompleted) {
                    setCompletedTasks((prevCompletedTasks) =>
                        prevCompletedTasks.filter(
                            (completedTask) => completedTask.id !== taskId
                        )
                    )
                } else {
                    const completedTask = updatedTasks.find(
                        (task) => task.id === taskId
                    )
                    setCompletedTasks((prevCompletedTasks) => [
                        ...prevCompletedTasks,
                        completedTask,
                    ])
                }
            })
            .catch((error) => {
                console.error(
                    `Error ${
                        isCompleted ? 'undoing' : 'marking as done'
                    } task:`,
                    error
                )
            })
    }

    const renderTasks = () => {
        // eslint-disable-next-line no-unused-vars
        const filteredTasks = showCompleted ? completedTasks : tasks
        const groupedTasks = groupTasksByDate()
        const taskDates = Object.keys(groupedTasks)

        const sortedDates = taskDates.sort((a, b) => new Date(a) - new Date(b))

        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - 2) //sets current date as 2 days ago because it doesn't read anything today or tomorrow

        // Check if there are no tasks at all
        if (tasks.length === 0) {
            return (
                <div className="NoTasksContainer">
                    <div className="NoTasks">No Tasks Remaining!!☻</div>
                </div>
            )
        }

        return sortedDates
            .map((date, index) => {
                const tasksForDate = groupedTasks[date]

                const filteredTasks = tasksForDate.filter(
                    (task) => new Date(task.date) >= currentDate
                )

                if (filteredTasks.length === 0) {
                    return null
                }

                return (
                    <div key={index}>
                        <div className="DateContainer">
                            <b>
                                {new Intl.DateTimeFormat('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }).format(
                                    new Date(
                                        new Date(date).getTime() +
                                            24 * 60 * 60 * 1000
                                    )
                                )}
                            </b>
                        </div>

                        {filteredTasks.map((task) => {
                            const isCompleted = completedTasks.some(
                                (completedTask) => completedTask.id === task.id
                            )

                            if (
                                (showCompleted && isCompleted) ||
                                (!showCompleted && !isCompleted)
                            ) {
                                return (
                                    <div
                                        className="TaskContainer"
                                        key={task.id}
                                        style={{
                                            backgroundColor:
                                                task.color || '#ffffff',
                                        }}
                                    >
                                        <div className="StartText" />
                                        <div
                                            className="TodoItem"
                                            onClick={toggleTaskDetailsPopup}
                                        >
                                            <label>{task.name}</label>
                                        </div>
                                        <div className="DeleteButtonContainer">
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        task.id,
                                                        task.eventId
                                                    )
                                                }
                                                className="DeleteButton"
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        {taskDetailsPopup && (
                                            <div>
                                                <div className="detailsView">
                                                    <button
                                                        id="popupClose"
                                                        onClick={
                                                            toggleTaskDetailsPopup
                                                        }
                                                    >
                                                        X
                                                    </button>
                                                    <h1>{task.name}</h1>
                                                    <h2>{task.description}</h2>
                                                    <hr />
                                                    {task.link !== '' ? (
                                                        <h3>
                                                            Link:{' '}
                                                            <a href={task.link}>
                                                                {task.link}
                                                            </a>
                                                        </h3>
                                                    ) : null}
                                                    <h3>
                                                        Deadline: {task.date}
                                                    </h3>
                                                </div>
                                            </div>
                                        )}

                                        <div className="CompletedButtonContainer">
                                            <button
                                                onClick={() =>
                                                    handleDone(
                                                        task.id,
                                                        task.eventId
                                                    )
                                                }
                                                className="CompletedButton"
                                            >
                                                {task.done ? 'UNDO' : 'DONE'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        })}

                        {index < sortedDates.length - 1 && (
                            <div className="Divider"></div>
                        )}
                    </div>
                )
            })
            .filter(Boolean)
    }

    const toggleShowCompleted = () => {
        setShowCompleted((prevShowCompleted) => {
            const newShowCompleted = !prevShowCompleted
            localStorage.setItem('showCompleted', newShowCompleted.toString())
            return newShowCompleted
        })
    }

    return (
        <div className="TaskTableContainer">
            <div className="ButtonContainer">
                <button
                    onClick={toggleShowCompleted}
                    className="completedtoggle"
                >
                    {showCompleted
                        ? 'Show Incomplete Tasks'
                        : 'Show Completed Tasks'}
                </button>
            </div>
            <div className="ToDoListContainer">{renderTasks()}</div>
        </div>
    )
}

export default TaskTable
