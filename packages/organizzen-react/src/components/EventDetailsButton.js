import React, { useState } from 'react'
import './EventDetailsButton.css'

function EventDetailsButton({ event }) {
    const [popup, popupState] = useState(false)
    const togglePopup = () => {
        popupState((prevPopup) => !prevPopup)
    }

    return (
        <>
            <button className="popup" onClick={togglePopup}>
                • • •
            </button>

            {popup && (
                <div className="viewWindow">
                    <div className="overlay"></div>
                    <div className="popupView">
                        <button id="popupClose" onClick={togglePopup}>
                            X
                        </button>
                        <h1>{event.name}</h1>
                        <h2>{event.description}</h2>
                        <h2>{event.link}</h2>
                        <h2>{event.startDate}</h2>
                        {event.startDate !== event.endDate && (
                            <h2>{event.endDate}</h2>
                        )}

                        {event.tasks && event.tasks.length > 0 && <></>}
                    </div>
                </div>
            )}
        </>
    )
}

export default EventDetailsButton
