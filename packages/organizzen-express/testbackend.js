//backend.js

require('dotenv').config();
import express from 'express'
import cors from 'cors'
const { MongoClient, ObjectId } = require('mongodb');
const { connectToMongoDB } = require("./database")

const app = express()
const port = 8000

app.use(cors())
app.use(express.json()) //set up express to process incoming dats in JSON format

const mongoClient = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connectToMongoDB()
    .then(() => {
        console.log('Connected to MongoDB');
        
    const eventsCollection = mongoClient.db('Cluster0').collection('userEvents');
    const tasksCollection = mongoClient.db('Cluster0').collection('eventTasks');

    app.get('/', (req, res) => {
        res.send('Hello World!') //sets the endpoint to accept http GET requests
    })

    // Retrieve events
    app.get('/events', async (req, res) => {
        try {
        const events = await eventsCollection.find().toArray();
        res.json(events);
        } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
        }
    })

    app.get('/events/:eventId', async (req, res) => {
        const eventId = req.params.eventId;
        try {
          const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
          if (event) {
            res.json(event);
          } else {
            res.status(404).json({ error: 'Event not found' });
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          res.status(500).json({ error: 'Failed to fetch event' });
        }
    })

    app.post('/events', async (req, res) => {
        const eventToAdd = req.body;
        try {
        const addedEvent = await eventsCollection.insertOne(eventToAdd);
        res.status(201).json(addedEvent.ops[0]);
        } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
        }
    })

    app.get('/events/:eventId/tasks', async (req, res) => {
        const eventId = req.params.eventId;
        try {
          const tasks = await tasksCollection.find({ eventId: eventId }).toArray();
          res.json(tasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    })
    
    app.post('/events/:eventId/tasks', async (req, res) => {
        const eventId = req.params.eventId;
        const taskToAdd = req.body;
        console.log('Task data:', req.body)
        taskToAdd.eventId = eventId; // Set the event id for the task
        try {
          const addedTask = await tasksCollection.insertOne(taskToAdd);
          res.status(201).json(addedTask.ops[0]);
        } catch (error) {
          console.error('Error adding task:', error);
          res.status(500).json({ error: 'Failed to add task' });
        }
    })

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})
    .catch((error) => {
        console.error('Error connecting to MongoDB', error)
    }
);

process.on('SIGINT', () => {
    console.log('Closing MongoDB connection');
    mongoClient.close();
    process.exit();
  });
