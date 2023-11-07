import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

// Store events with associated tasks
const events = [];

const findEventByName = (name) =>
  events["events"].filter((event) => event["name"] === name);

app.use(cors());
app.use(express.json()); //set up express to process incoming dats in JSON format
// Create a new event with tasks

app.post('/events', (req, res) => {
  const { name, description, link, date, oneDayOnly, tasks } = req.body;
  const newEvent = { name, description, link, date, oneDayOnly, tasks: [] };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Create a new task for an event
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

app.get("/", (req, res) => {
  res.send("Hello World!"); //sets the endpoint to accept http GET requests
});

// Retrieve events
app.get('/events', (req, res) => {
  res.json(events);
});

app.get("/events/:name", (req, res) => {
  const name = req.params["name"];
  let result = findEventByName(name);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
