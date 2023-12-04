import React, { useState, useEffect } from 'react';
import './TaskTable.css';

function TaskTable({ filter }) {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        // Fetch all tasks initially
        fetch('http://localhost:8000/events/tasks')
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.log(error))
    }, [])

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

    const renderTasks = () => {
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

        return sortedDates.map((date, index) => {
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

                    {filteredTasks.map((task) => (
                        <div
                            className="TaskContainer"
                            key={task.id}
                            style={{ backgroundColor: task.color || '#ffffff' }}
                        >
                            <div className="StartText" />
                            <div className="TodoItem">
                                <label>{task.name}</label>
                            </div>
                        </div>
                    ))}

                    {index < sortedDates.length - 1 && (
                        <div className="Divider"></div>
                    )}
                </div>
            )
        })
    }

  return (
    <div>
      <button onClick={toggleShowCompleted} className = "completedtoggle">
        {showCompleted ? 'Show Incomplete Tasks' : 'Show Completed Tasks'}
      </button>
      <div className="ToDoListContainer">{renderTasks()}</div>
    </div>
  );
}

export default TaskTable;
