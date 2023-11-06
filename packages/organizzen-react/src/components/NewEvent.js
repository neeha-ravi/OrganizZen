import React, { useState } from "react";
import "./NewEvent.css";

function NewEvent() {
  const [popup, popupState] = useState(false);
  const togglePopup = () => {
    popupState(!popup);
  };

  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <>
      <button className="popupButton" onClick={togglePopup}>
        New Event
      </button>

      {popup && (
        <div className="popupWindow">
          <div className="overlay"></div>
          <div className="popupContent">
            <button id="popupClose" onClick={togglePopup}>
              CLOSE
            </button>
            <h1>New Event</h1>
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
              <label htmlFor="taskDate">Event Date: </label>
              <br></br>
              <input id="taskDate" type="date" />
              {!checked && <input id="taskDate" type="date" />}
              <br></br>
              <label>
                One Day Only?
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleChange}
                />
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

export default NewEvent;
