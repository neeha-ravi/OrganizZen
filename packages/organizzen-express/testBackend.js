
import express from 'express'
import cors from 'cors'

const app = express()
const port = 8000

app.use(cors())
app.use(express.json()) // set up express to process incoming data in JSON format

// Store events with associated tasks
const events = {
    events_list: [
        {
            id: '1',
            name: 'Event 1',
            description: 'Description for Event 1',
            link: 'https://example.com/event1',
            startDate: '2023-12-04',
            endDate: '2023-12-04',
            oneDayOnly: true,
            tasks: [
                {
                    id: '1',
                    name: 'Task 1',
                    description: 'Description for Task 1',
                    link: 'https://example.com/task1',
                    date: '2023-12-04',
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
            startDate: '2023-12-15',
            endDate: '2023-12-15',
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

// Add a new route to get all tasks for all events
app.get('/events/tasks', (req, res) => {
    const allTasks = events.events_list.flatMap((event) => event.tasks)
    res.send(allTasks)
})

// Modify the existing route to get tasks for a specific event
app.get('/events/:eventId/tasks', (req, res) => {
    const eventId = req.params.eventId
    const event = findEventById(eventId)

    if (event === undefined) {
        res.status(404).send('Resource not found.')
    } else {
        res.send(event.tasks)
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!') // sets the endpoint to accept http GET requests
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

// EVENT
const addEvent = (e) => {
    // Convert start and end dates to UTC format
    e.startDate = new Date(`${e.startDate}T00:00:00Z`)
        .toISOString()
        .split('T')[0]
    e.endDate = new Date(`${e.endDate}T23:59:59Z`).toISOString().split('T')[0]

    // Check if the event start date is in the future
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 2) //sets current date as 2 days ago because it doesn't read anything today or tomorrow
    const eventStartDate = new Date(e.startDate).getTime()

    if (eventStartDate < currentDate.getTime()) {
        // If the event start date has already passed, return an error
        return null
    }

    e.id = generateUniqueId(usedEventIds)
    e.tasks = []

    events['events_list'].push(e)
    return e
}

app.post('/events', (req, res) => {
    const eventToAdd = req.body

    // If it's a one-day event, set endDate to be the same as startDate
    if (eventToAdd.oneDayOnly) {
        eventToAdd.endDate = eventToAdd.startDate
    }

    const addedEvent = addEvent(eventToAdd)

    if (addedEvent) {
        res.status(201).json(addedEvent)
    } else {
        res.status(500).json({ error: 'Failed to add event' })
    }
})

// TASK

const addTask = (task, eventId, taskDate) => {
    task.id = generateUniqueId(usedTaskIds)
    task.eventId = eventId
    task.date = taskDate

    const event = events['events_list'].find((event) => event.id === eventId)

    if (event) {
        // Check if the task date is within the event's date range
        const currentDate = new Date() // This gets the current date and time
        currentDate.setDate(currentDate.getDate() - 2) //sets current date as 2 days ago because it doesn't read anything today or tomorrow
        const taskDateTime = new Date(taskDate).getTime()
        const eventStartDate = new Date(event.startDate).getTime()
        const eventEndDate = new Date(event.endDate).getTime()

        if (taskDateTime >= currentDate && taskDateTime <= eventEndDate) {
            event.tasks.push(task)
            usedTaskIds.add(task.id)
            return task
        }
    }

    return null
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

app.post('/events/:eventId/tasks', (req, res) => {
    const eventId = req.params.eventId
    const taskToAdd = addTask(req.body, eventId, req.body.date) // Include task date

    console.log('Task data:', req.body)

    if (taskToAdd) {
        console.log('Task added:', taskToAdd)
        res.status(201).json(taskToAdd)
    } else {
        console.error('Event not found or failed to add task to event')
        res.status(404).json({
            error: 'Event not found or failed to add task to event',
        })
    }
})

app.listen(process.env.PORT || port, () => {
    if (process.eventNames.PORT){
        console.log(`REST API is listening on port: ${process.env.PORT}.`)
    }
    console.log(`Example app listening at http://localhost:${port}/events`)
})