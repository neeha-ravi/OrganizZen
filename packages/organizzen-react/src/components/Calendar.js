import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar({ filter, setFilter }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
  
    const handleEventClick = (eventId) => {
      // Toggle the clicked event ID in the filter
      setFilter((prevFilter) => {
        const updatedFilter = new Set(prevFilter);
        if (updatedFilter.has(eventId)) {
          updatedFilter.delete(eventId); // Remove the event if it was selected
          setSelectedEvent(null); // Unset SelectedEvent when the event is removed
        } else {
          updatedFilter.add(eventId); // Add the event if it wasn't selected
          setSelectedEvent(eventId);
        }
        return updatedFilter;
      });
    };
  
    useEffect(() => {
      // Fetch events from the backend
      fetch('http://localhost:8000/events')
        .then((response) => response.json())
        .then((data) => {
          // Sort events by start date in ascending order
          const sortedEvents = data.events_list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
          setEvents(sortedEvents);
        })
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
      <div className="EventScrollContainer">
        {events.map((event) => (
          <div
            className={`EventContainer ${selectedEvent === event.id ? 'SelectedEvent' : ''} ${filter.has(event.id) ? 'ShadedEvent' : ''}`}
            key={event.id}
            onClick={() => handleEventClick(event.id)}
          >
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
  