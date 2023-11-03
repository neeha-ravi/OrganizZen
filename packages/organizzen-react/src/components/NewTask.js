import React, { useState } from "react";
import "./NewTask.css";

function NewTask() {
  const [popup, popupState] = useState(false);
  const togglePopup = () => {
    popupState(!popup);
  };

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
              CLOSE
            </button>
            <h1>New Task</h1>
            <form className="popupForm">
              <label htmlFor="taskName">Name: </label>
              <br></br>
              <input id="taskName" />
              <br></br> <br></br>
              <label htmlFor="taskDescription">Description: </label>
              <br></br>
              <input id="taskDescription" />
              <br></br> <br></br>
              <label htmlFor="taskLink">Link (Optional): </label>
              <br></br>
              <input id="taskLink" />
              <br></br> <br></br>
              <label htmlFor="taskDate">Deadline: </label>
              <br></br>
              <input id="taskDate" type="date" />
              <br></br> <br></br>
              <label>
                Event:
                <br></br>
                <select>
                  <option value="event1">event1</option>
                  <option value="event2">event2</option>
                  <option value="event3">event3</option>
                  <option value="event4">event4</option>
                </select>
              </label>
              <br></br> <br></br>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NewTask;
