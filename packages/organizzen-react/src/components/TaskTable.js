import React, { useState, useEffect } from 'react';
import './TaskTable.css';

function TaskTable() {
  const [tasks, setTasks] = useState([]);

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

  const renderTasks = () => {
    const groupedTasks = groupTasksByDate();
    const taskDates = Object.keys(groupedTasks);

    const sortedDates = taskDates.sort((a, b) => new Date(a) - new Date(b));

    const currentDate = new Date();

    return sortedDates.map((date, index) => {
      const tasksForDate = groupedTasks[date];

      const filteredTasks = tasksForDate.filter(
        (task) => new Date(task.date) >= currentDate
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

          {filteredTasks.map((task) => (
            <div className="TaskContainer" key={task.id}>
              <div className="StartText" />
              <div className="TodoItem">
                <label>{task.name}</label>
              </div>
            </div>
          ))}

          {index < sortedDates.length - 1 && <div className="Divider"></div>}
        </div>
      );
    });
  };

  return <div className="ToDoListContainer">{renderTasks()}</div>;
}

export default TaskTable;