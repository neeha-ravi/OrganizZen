// TaskTable.jsx
import React from 'react';
import './TaskTable.css';

function TaskTable() {
  const getNext7Days = () => {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    });
    return next7Days;
  };

  const next7Days = getNext7Days();

  // just for testing
  const todoItems = [
    { id: 1, text: 'run' },
    { id: 2, text: 'gym' },
  ];

  return (
    <div className="ToDoListContainer">
      {next7Days.map((date, index) => (
        <div key={index}>
          {/* Date */}
          <div className="DateContainer">
            <b>
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(date)}
            </b>
          </div>
        
        {/* todo items */}
          {todoItems[index] && (
            <div className="TaskContainer">
              <div className="StartText" />
              <div className="TodoItem">
                <label>
                  {todoItems[index].text}
                </label>
              </div>
            </div>
          )}

          {index < next7Days.length - 1 && <div className="Divider"></div>}
        </div>
      ))}
    </div>
  );
}

export default TaskTable;
