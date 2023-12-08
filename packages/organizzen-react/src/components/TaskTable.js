import React, { useState, useEffect } from 'react'
import './TaskTable.css'

function TaskTable({ filter, onToggleShowCompleted }) {
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [showCompleted, setShowCompleted] = useState(
        localStorage.getItem('showCompleted') === 'true'
    )
    const [taskDetailsPopups, setTaskDetailsPopups] = useState({})
    const [selectedTaskDetails, setSelectedTaskDetails] = useState(null)

    // Function to set the selected task's details
    const selectTaskDetails = (taskId) => {
        const selectedTask = tasks.find((task) => task.id === taskId)
        setSelectedTaskDetails(selectedTask)
    }
    console.log(selectTaskDetails)
    console.log(selectedTaskDetails)

    // Function to set the details popup state for a specific task
    const setTaskDetailsPopup = (taskId, isOpen) => {
        setTaskDetailsPopups((prevDetailsPopups) => ({
            ...prevDetailsPopups,
            [taskId]: isOpen,
        }))
    }

    const toggleTaskDetailsPopup = (taskId) => {
        setTaskDetailsPopup(taskId, !taskDetailsPopups[taskId])
    }

    useEffect(() => {
        fetch('https://organizzen.azurewebsites.net/events/tasks')
            .then((response) => response.json())
            .then((data) => {
                const allTasks = data
                const initialCompletedTasks = allTasks.filter(
                    (task) => task.done
                )
                setCompletedTasks(initialCompletedTasks)
                setTasks([...allTasks])
            })
            .catch((error) => console.log(error))
    }, [])

    useEffect(() => {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks))
    }, [completedTasks])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(
                    'https://organizzen.azurewebsites.net/events/tasks'
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks')
                }
                const data = await response.json()
                const allTasks = data
                const initialCompletedTasks = allTasks.filter(
                    (task) => task.done
                )
                setCompletedTasks(initialCompletedTasks)
                setTasks([...allTasks])
            } catch (error) {
                console.log('Error fetching tasks:', error)
            }
        }

        fetchTasks()
    }, [])

    useEffect(() => {
        // Check if there are events selected in the filter
        if (filter.size > 0) {
            // Fetch tasks for each eventId in the filter
            Promise.all(
                [...filter].map((eventId) =>
                    fetch(`https://organizzen.azurewebsites.net/events/${eventId}/tasks`)
                )
            )
                .then((responses) =>
                    Promise.all(responses.map((response) => response.json()))
                )
                .then((data) => {
                    console.log(data)
                    // Flatten the array of arrays into a single array of tasks
                    const filteredTasks = data.flat()
                    setTasks(filteredTasks)
                })
                .catch((error) =>
                    console.log('Error fetching filtered tasks:', error)
                )
        } else {
            // If no events are selected, fetch all tasks
            fetch('https://organizzen.azurewebsites.net/events/tasks')
                .then((response) => response.json())
                .then((data) => setTasks(data))
                .catch((error) =>
                    console.log('Error fetching all tasks:', error)
                )
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

        fetch(`https://organizzen.azurewebsites.net/events/${eventId}/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete task')
                }

                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== taskId)
                )
                setCompletedTasks((prevCompletedTasks) =>
                    prevCompletedTasks.filter(
                        (completedTask) => completedTask.id !== taskId
                    )
                )
            })
            .then(() => console.log('Task deleted successfully!'))
            .catch((error) => {
                console.error('Error deleting task:', error)
            })
    }

    function handleDone(taskId, eventId) {
        console.log('EventId:', eventId, 'TaskId:', taskId)
        const isCompleted = completedTasks.some(
            (completedTask) => completedTask.id === taskId
        )

        const endpoint = isCompleted ? 'undo' : 'mark-as-done'

        fetch(
            `https://organizzen.azurewebsites.net/events/${eventId}/tasks/${taskId}/${endpoint}`,
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

                const updatedTasks = tasks.map((task) =>
                    task.id === taskId ? { ...task, done: !task.done } : task
                )
                setTasks(updatedTasks)

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
        currentDate.setDate(currentDate.getDate())

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
                const dateFilteredTasks = tasksForDate.filter(
                    (task) => new Date(task.date) >= currentDate
                )

                if (dateFilteredTasks.length === 0) {
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

                        {dateFilteredTasks.map((task) => {
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
                                            onClick={() =>
                                                toggleTaskDetailsPopup(task.id)
                                            }
                                        >
                                            <label>{task.name}</label>
                                        </div>
                                        <div className="DeleteButtonContainer">
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        task.id,
                                                        task.event
                                                    )
                                                }
                                                className="DeleteButton"
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        {taskDetailsPopups[task.id] && (
                                            <div>
                                                <div className="detailsView">
                                                    <button
                                                        id="popupClose"
                                                        onClick={() =>
                                                            toggleTaskDetailsPopup(
                                                                task.id
                                                            )
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
                                                        task.event
                                                    )
                                                }
                                                className="CompletedButton"
                                            >
                                                {isCompleted ? 'UNDO' : 'DONE'}
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
                    {showCompleted ? (
                        <b>Show Incomplete Tasks</b>
                    ) : (
                        <b>Show Completed Tasks</b>
                    )}
                </button>
            </div>
            <div className="ToDoListContainer">{renderTasks()}</div>
        </div>
    )
}

export default TaskTable
