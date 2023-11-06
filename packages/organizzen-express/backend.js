import express from "express";
import cors from "cors";

const app = express(); //creates an instance of express
const port = 8000; //localhost:8000

app.use(cors());

const events = {
  events_list: [
    {
      name: "Event1",
      desc: "Description of event 1",
      date: "2012-04-23",
    },
    {
      name: "Event2",
      desc: "Description of event 2",
      date: "2012-04-12",
    },
    {
      name: "Event3",
      desc: "Description of event 3",
      date: "2012-05-01",
    },
    {
      name: "Event4",
      desc: "Description of event 4",
      date: "2012-04-28",
    },
    {
      name: "Event5",
      desc: "Description of event 5",
      date: "2012-03-30",
    },
  ],
};

app.use(express.json()); //set up express to process incoming dats in JSON format

app.get("/", (req, res) => {
  res.send("Hello World!"); //sets the endpoint to accept http GET requests
});

app.get("/events", (req, res) => {
  res.send(events);
});

// Create a new event with tasks
app.post('/events', (req, res) => {
  const { name, description, link, date, oneDayOnly, tasks } = req.body;
  const newEvent = { name, description, link, date, oneDayOnly, tasks: [] };
  events.push(newEvent);
  res.status(201).json(newEvent);
});


// Create a new task for an event
//eventid??
app.post('/events/:eventId/tasks', (req, res) => {
  const eventId = req.params.eventId;
  const { name, description, link, date, color } = req.body;
  const newTask = { name, description, link, date, color };
  
  // Find the event by eventId
  const event = events.find(event => event.name === eventId);
  if (event) {
    event.tasks.push(newTask);
    res.status(201).json(newTask);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
