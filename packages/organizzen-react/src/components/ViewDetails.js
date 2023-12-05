import React, { useState } from 'react'
import './ViewDetails.css'

function ViewDetails({ task }) {
    const [popup, popupState] = useState(false)
    const togglePopup = () => {
        popupState(!popup)
    }

    return (
        <>
            <button className="popupButton" onClick={togglePopup}>
                Details
            </button>

            {popup && (
                <div className="viewWindow">
                    <div className="overlay"></div>
                    <div className="popupView">
                        <button id="popupClose" onClick={togglePopup}>
                            X
                        </button>
                        <h1>{task.name}</h1>
                        <h2>DESCRIPTION: {task.description}</h2>
                        <hr />
                        {task.link !== '' ? (
                            <h3>
                                Link: <a href={task.link}>{task.link}</a>
                            </h3>
                        ) : null}
                        <h3>Deadline: {task.date}</h3>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewDetails
