import React, { useState, useEffect } from 'react';
import './TaskTable.css';

function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvent, setEventSelect] = useState(eventOptions[0]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/events/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.log(error));
  }, []);

  const groupTasksByDate = () => {
    const groupedTasks = {};
    tasks.forEach((task) => {
      if (!groupedTasks[task.date]) {
        groupedTasks[task.date] = [];
      }
      groupedTasks[task.date].push(task);
    });
    return groupedTasks;
  };

  function fetchTasks(eventId) {
    if (!eventId) {
      console.error('No event ID provided.');
      return;
    }

    // Make a GET request to fetch tasks for the specified event
    fetch(`http://localhost:8000/events/${eventId}/tasks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return response.json();
      })
      .then((tasks) => {
        // Process the fetched tasks, update state, or perform other actions
        console.log('Fetched tasks for event', eventId, ':', tasks);
        setTasks(tasks); // Update the tasks state
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }

  function handleDone(taskId, eventId) {
    // Make a PUT request to update the task as done
    fetch(`http://localhost:8000/events/${eventId}/tasks/${taskId}/mark-as-done`, {
      method: 'PUT',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to mark task as done');
        }
        // Move the task to completed tasks
        const completedTask = tasks.find((task) => task.id === taskId);
        setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, completedTask]);
      })
      .catch((error) => {
        console.error('Error marking task as done:', error);
      });
  }
  
  const renderTasks = () => {
    const groupedTasks = groupTasksByDate();
    const taskDates = Object.keys(groupedTasks);
  
    const sortedDates = taskDates.sort((a, b) => new Date(a) - new Date(b));
  
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2);
  
    return sortedDates.map((date, index) => {
      const tasksForDate = groupedTasks[date];
  
      const filteredTasks = tasksForDate.filter(
        (task) => new Date(task.date).toDateString() === new Date(date).toDateString()
      );
  
      if (filteredTasks.length === 0) {
        return null;
      }
  
      return (
        <div key={index}>
          <div className="DateContainer">
            <b>
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000))}
            </b>
          </div>
  
          {filteredTasks.map((task) => {
            const isCompleted = completedTasks.some((completedTask) => completedTask.id === task.id);
  
            if ((showCompleted && isCompleted) || (!showCompleted && !isCompleted)) {
              return (
                <div
                  className="TaskContainer"
                  key={task.id}
                  style={{ backgroundColor: task.color || '#ffffff' }}
                >
                  <div className="StartText" />
                  <div className="TodoItem">
                    <label>{task.name}</label>
                  </div>
                  <button
                    onClick={() => handleDone(task.id, task.eventId)}
                    className="CompletedButton"
                  >
                    DONE
                  </button>
                </div>
              );
            }
  
            return null;
          })}
  
          {index < sortedDates.length - 1 && <div className="Divider"></div>}
        </div>
      );
    }).filter(Boolean);
  };

  const toggleShowCompleted = () => {
    setShowCompleted((prevShowCompleted) => !prevShowCompleted);
  };

  
  

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
