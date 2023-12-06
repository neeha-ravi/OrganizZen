import React, { useState, useEffect } from 'react'
import ViewDetails from './ViewDetails'
import './TaskTable.css'

function TaskTable({ filter }) {
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [showCompleted, setShowCompleted] = useState(
        localStorage.getItem('showCompleted') === 'true' ? true : false
    )

    useEffect(() => {
        fetch('http://localhost:8000/events/tasks')
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
        if (filter.size > 0) {
            Promise.all(
                [...filter].map((eventId) =>
                    fetch(`http://localhost:8000/events/${eventId}/tasks`)
                )
            )
                .then((responses) =>
                    Promise.all(responses.map((response) => response.json()))
                )
                .then((data) => {
                    const filteredTasks = data.flat()
                    setTasks(filteredTasks)
                })
                .catch((error) => console.log(error))
        } else {
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

        fetch(`http://localhost:8000/events/${eventId}/tasks/${taskId}`, {
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
            `http://localhost:8000/events/${eventId}/tasks/${taskId}/${endpoint}`,
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
        const filteredTasks = showCompleted ? completedTasks : tasks
        const groupedTasks = groupTasksByDate()
        const taskDates = Object.keys(groupedTasks)
        const sortedDates = taskDates.sort((a, b) => new Date(a) - new Date(b))
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - 2)

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
                                        <div className="TodoItem">
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
                                        <div>
                                            <ViewDetails task={task} />
                                        </div>

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
