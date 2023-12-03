import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the backend
    fetch('https://organizzen.azurewebsites.net/')
      .then((response) => response.json())
      .then((data) => setEvents(data.events_list))
      .catch((error) => console.log(error));
  }, []);

  const formatDate = (startDateString, endDateString) => {
    try {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      if (startDate.toDateString() === endDate.toDateString()) {
        // Display a single date for one-day events
        return new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(startDate);
      } else {
        // Display a date range for events with a range of dates
        return `${new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(startDate)} - ${new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(endDate)}`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div>
      {events.map((event) => (
        <div className="EventContainer" key={event.id}>
          <div className="EventBox">
            <h3>{event.name}</h3>
            <p>{formatDate(event.startDate, event.endDate)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Calendar;
