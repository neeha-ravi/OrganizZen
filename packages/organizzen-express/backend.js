// backend.js
import express from 'express'
import cors from 'cors'
//import { ObjectId } from 'mongodb'
import {
    getEvents,
    addEvent,
    getTasksForEvent,
    addTaskForEvent,
} from './database.js'

const app = express()
const port = process.env.PORT || 8000 //process not defined

app.use(cors())
app.use(express.json())

// Your routes and other middleware here

// Example route to get events
app.get('/events', async (req, res) => {
    try {
        const events = await getEvents()
        res.json(events)
    } catch (error) {
        console.error('Error fetching events:', error)
        res.status(500).json({ error: 'Failed to fetch events' })
    }
})

// Example route to add an event
app.post('/events', async (req, res) => {
    const eventToAdd = req.body
    try {
        const addedEvent = await addEvent(eventToAdd)
        res.status(201).json(addedEvent)
    } catch (error) {
        console.error('Error adding event:', error)
        res.status(500).json({ error: 'Failed to add event' })
    }
})

// Example route to get tasks for a specific event
app.get('/events/:eventId/tasks', async (req, res) => {
    const eventId = req.params.eventId
    try {
        const tasks = await getTasksForEvent(eventId)
        res.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        res.status(500).json({ error: 'Failed to fetch tasks' })
    }
})

// Example route to add a task for a specific event
app.post('/events/:eventId/tasks', async (req, res) => {
    const eventId = req.params.eventId
    const taskToAdd = req.body
    try {
        const addedTask = await addTaskForEvent(eventId, taskToAdd)
        res.status(201).json(addedTask)
    } catch (error) {
        console.error('Error adding task:', error)
        res.status(500).json({ error: 'Failed to add task' })
    }
})

app.listen(process.env.PORT || port, () => {
    if (process.eventNames.PORT) {
        console.log(`REST API is listening on port: ${process.env.PORT}.`)
    }
    else console.log(`Example app listening at http://localhost:${port}/events`)
})
