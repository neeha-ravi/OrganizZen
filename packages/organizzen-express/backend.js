//backend.js

import express from 'express'
import cors from 'cors'

const app = express()
const port = 8000

app.use(cors())
app.use(express.json()) //set up express to process incoming dats in JSON format

// Store events with associated tasks
const events = {
    events_list: [
        {
            id: '1',
            name: 'Event 1',
            description: 'Description for Event 1',
            link: 'https://example.com/event1',
            date: '2023-12-01',
            oneDayOnly: true,
            tasks: [
                {
                    id: '1',
                    name: 'Task 1',
                    description: 'Description for Task 1',
                    link: 'https://example.com/task1',
                    date: '2023-12-01',
                    color: 'red',
                    event: '1',
                },
                // Add more tasks for Event 1 if needed
            ],
        },
        {
            id: '2',
            name: 'Event 2',
            description: 'Description for Event 2',
            link: 'https://example.com/event2',
            date: '2023-12-15',
            oneDayOnly: false,
            tasks: [
                {
                    id: '2',
                    name: 'Task 2',
                    description: 'Description for Task 2',
                    link: 'https://example.com/task2',
                    date: '2023-12-15',
                    color: 'blue',
                    event: '2',
                },
                // Add more tasks for Event 2 if needed
            ],
        },
        // Add more pre-made events if needed
    ],
}

const findEventById = (eventId) => {
    return events['events_list'].find((event) => event.id === eventId)
}

const usedEventIds = new Set()
usedEventIds.add(1).add(2)
const usedTaskIds = new Set()
usedTaskIds.add(1).add(2)

// Generate a unique ID between 1 and infinity
const generateUniqueId = (usedIds) => {
    let id = 1
    while (usedIds.has(id)) {
        id++
    }
    usedIds.add(id)
    return id.toString()
}

app.get('/', (req, res) => {
    res.send('Hello World!') //sets the endpoint to accept http GET requests
})

// Retrieve events
app.get('/events', (req, res) => {
    res.send(events)
})

app.get('/events/:eventId', (req, res) => {
    const id = req.params.Id
    let result = findEventById(id)
    if (result === undefined) {
        res.status(404).send('Resource not found.')
    } else {
        res.send(result)
    }
})

//EVENT
const addEvent = (e) => {
    e.id = generateUniqueId(usedEventIds)
    e.tasks = []
    events['events_list'].push(e)
    return e
}
app.post('/events', (req, res) => {
    const eventToAdd = req.body
    const addedEvent = addEvent(eventToAdd)
    if (addedEvent) {
        res.status(201).json(addedEvent)
    } else {
        res.status(500).json({ error: 'Failed to add event' })
    }
})

// TASK

const addTask = (task, eventId) => {
    task.id = generateUniqueId(usedTaskIds)
    task.eventId = eventId // Set the event id for the task
    const event = events['events_list'].find((event) => event.id === eventId)
    if (event) {
        event.tasks.push(task)
        usedTaskIds.add(task.id) // Add task id to usedTaskIds
        return task // Return the added task
    }
    return null // Return null if event is not found
}

app.get('/events/:eventId/tasks', (req, res) => {
    const id = req.params.eventId
    let result = findEventById(id)
    if (result === undefined) {
        res.status(404).send('Resource not found.')
    } else {
        res.send(result.tasks)
    }
})

app.post('/events/:eventId/', (req, res) => {
    const eventId = req.params.eventId // Fix the parameter name
    const taskToAdd = addTask(req.body, eventId)

    if (taskToAdd) {
        res.status(201).json(taskToAdd)
    } else {
        res.status(404).json({
            error: 'Event not found or failed to add task to event',
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/events`)
})
