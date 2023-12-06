import express from 'express'
import cors from 'cors'
import { connectToMongoDB } from './database.js'

const app = express()
const port = 8000

app.use(
    cors({
        origin: 'https://lively-mud-0344e681e.4.azurestaticapps.net',
    })
)

app.use(express.json()) // set up express to process incoming data in JSON format

let mongoClient
let usedEventIds = new Set()
let usedTaskIds = new Set()

// Declare usedEventIds variable to store used event IDs

connectToMongoDB()
    .then((client) => {
        mongoClient = client
        console.log('Connected to MongoDB')

        const eventsCollection = mongoClient
            .db('OrganizzenData')
            .collection('userEvents')
        const tasksCollection = mongoClient
            .db('OrganizzenData')
            .collection('eventTasks')

        app.get('/', (req, res) => {
            res.send('This is the backend.js file!') // sets the endpoint to accept http GET requests
        })

        const findEventById = async (eventId) => {
            try {
                const event = await eventsCollection.findOne({ id: eventId })
                return event
            } catch (error) {
                console.error('Error fetching event:', error)
                return null
            }
        }

        // Function to find a task by ID within an event
        const findTaskById = async (eventId, taskId) => {
            const event = await findEventById(eventId)

            if (event) {
                const task = event.tasks.find((t) => t.id === taskId)
                return task
            }

            return null
        }

        // Function to generate a unique ID
        const generateUniqueId = (usedIds) => {
            let id
            do {
                id = Math.floor(Math.random() * 1000000).toString()
            } while (usedIds.has(id))
            usedIds.add(id)
            return id
        }

        // Endpoint to get all tasks for all events
        app.get('/events/tasks', async (req, res) => {
            try {
                const allTasks = await tasksCollection.find({}).toArray()
                res.json(allTasks)
            } catch (error) {
                console.error('Error fetching tasks:', error)
                res.status(500).json({ error: 'Failed to fetch tasks' })
            }
        })

        // Endpoint to get tasks for a specific event
        app.get('/events/:eventId/tasks', async (req, res) => {
            const eventId = req.params.eventId
            try {
                const eventTasks = await tasksCollection
                    .find({ event: eventId })
                    .toArray()
                res.json(eventTasks)
            } catch (error) {
                console.error('Error fetching tasks:', error)
                res.status(500).json({ error: 'Failed to fetch tasks' })
            }
        })

        app.put('/events/:eventId/tasks', async (req, res) => {
            const eventId = req.params.eventId
            try {
                const eventTasks = await tasksCollection
                    .find({ event: eventId })
                    .toArray()
                res.json(eventTasks)
            } catch (error) {
                console.error('Error fetching tasks:', error)
                res.status(500).json({ error: 'Failed to fetch tasks' })
            }
        })

        // Endpoint to get a specific task by ID within an event
        app.get('/events/:eventId/tasks/:taskId', async (req, res) => {
            const eventId = req.params.eventId
            const taskId = req.params.taskId
            try {
                const task = await findTaskById(eventId, taskId)
                if (task) {
                    res.json(task)
                } else {
                    res.status(404).json({ error: 'Task not found' })
                }
            } catch (error) {
                console.error('Error fetching task:', error)
                res.status(500).json({ error: 'Failed to fetch task' })
            }
        })

        // Endpoint to retrieve all events
        app.get('/events', async (req, res) => {
            try {
                const allEvents = await eventsCollection.find({}).toArray()
                res.json(allEvents)
            } catch (error) {
                console.error('Error fetching events:', error)
                res.status(500).json({ error: 'Failed to fetch events' })
            }
        })

        // Endpoint to get a specific event by ID
        app.get('/events/:eventId', async (req, res) => {
            const eventId = req.params.eventId
            try {
                const event = await findEventById(eventId)
                if (event) {
                    res.json(event)
                } else {
                    res.status(404).json({ error: 'Event not found' })
                }
            } catch (error) {
                console.error('Error fetching event:', error)
                res.status(500).json({ error: 'Failed to fetch event' })
            }
        })

        // Endpoint to get a specific task and mark it as done
        app.get(
            '/events/:eventId/tasks/:taskId/mark-as-done',
            async (req, res) => {
                const eventId = req.params.eventId
                const taskId = req.params.taskId

                try {
                    const result = await tasksCollection.findOneAndUpdate(
                        { eventId, taskId },
                        { $set: { done: true } },
                        { returnDocument: 'after' }
                    )

                    console.log(result) // Log the entire result object
                    if (result.value) {
                        res.status(200).json(result.value)
                    } else {
                        res.status(404).json({ error: 'Task not found' })
                    }
                } catch (error) {
                    console.error('Error updating task:', error)
                    res.status(500).json({
                        error: 'Failed to mark task as done',
                    })
                }
            }
        )

        const addEvent = async (e) => {
            e.startDate = new Date(`${e.startDate}T00:00:00Z`)
                .toISOString()
                .split('T')[0]
            e.endDate = new Date(`${e.endDate}T23:59:59Z`)
                .toISOString()
                .split('T')[0]

            const currentDate = new Date()
            const eventStartDate = new Date(e.startDate).getTime()

            if (eventStartDate < currentDate.getTime()) {
                return null
            }

            const uniqueId = generateUniqueId(usedEventIds)
            e.id = uniqueId
            e.tasks = []

            try {
                await eventsCollection.insertOne(e)
                return e
            } catch (error) {
                console.error('Error adding event:', error)
                return null
            }
        }

        app.post('/events', async (req, res) => {
            const eventToAdd = req.body

            if (eventToAdd.oneDayOnly) {
                eventToAdd.endDate = eventToAdd.startDate
            }

            const addedEvent = await addEvent(eventToAdd)

            if (addedEvent) {
                res.status(201).json(addedEvent)
            } else {
                res.status(500).json({ error: 'Failed to add event' })
            }
        })

        // Function to add a task to a specific event
        const addTask = async (task, eventId, taskDate) => {
            task.id = generateUniqueId(usedTaskIds)
            task.date = taskDate

            // Set the eventId directly in the task
            task.event = eventId

            // Use the database query to find the event by ID
            const event = await findEventById(eventId)

            if (event) {
                // Check if the task date is within the event's date range
                const currentDate = new Date()
                const taskDateTime = new Date(taskDate).getTime()
                const eventEndDate = new Date(event.endDate).getTime()

                if (
                    taskDateTime >= currentDate &&
                    taskDateTime <= eventEndDate
                ) {
                    try {
                        // Insert the task into the eventTasks collection
                        await tasksCollection.insertOne(task)
                        // Update the event in the userEvents collection to include the new task
                        await eventsCollection.updateOne(
                            { id: eventId },
                            { $push: { tasks: task } }
                        )
                        usedTaskIds.add(task.id)
                        return task
                    } catch (error) {
                        console.error('Error adding task:', error)
                        return null
                    }
                }
            }

            return null
        }

        // Endpoint to get all tasks for all events
        app.get('/events/tasks', async (req, res) => {
            try {
                const allTasks = await tasksCollection.find({}).toArray()
                res.json(allTasks)
            } catch (error) {
                console.error('Error fetching tasks:', error)
                res.status(500).json({ error: 'Failed to fetch tasks' })
            }
        })

        // Endpoint to add a task to a specific event
        app.post('/events/:eventId/tasks', async (req, res) => {
            const eventId = req.params.eventId
            const taskToAdd = req.body

            const addedTask = await addTask(taskToAdd, eventId, taskToAdd.date)

            if (addedTask) {
                res.status(201).json(addedTask)
            } else {
                res.status(500).json({ error: 'Failed to add task' })
            }
        })

        /// Inside markTaskAsDone function
        const markTaskAsDone = async (eventId, taskId) => {
            console.log(
                'Received request to mark task as done. EventId:',
                eventId,
                'TaskId:',
                taskId
            )
            try {
                const result = await tasksCollection.updateOne(
                    { event: eventId, id: taskId }, // Adjust the condition here
                    { $set: { done: true } }
                )

                console.log('Result:', result)

                if (result && result.modifiedCount > 0) {
                    const updatedTask = await tasksCollection.findOne({
                        event: eventId,
                        id: taskId,
                    })
                    console.log('Task marked as done:', updatedTask)
                    return updatedTask
                } else {
                    console.error('Task not found')
                    return null
                }
            } catch (error) {
                console.error('Error updating task:', error)
                throw error // Re-throw the error to be caught in the catch block
            }
        }

        // Endpoint to mark a specific task as done
        app.put(
            '/events/:eventId/tasks/:taskId/mark-as-done',
            async (req, res) => {
                const eventId = req.params.eventId
                const taskId = req.params.taskId
                console.log(
                    'Received request to mark task as done. EventId:',
                    eventId,
                    'TaskId:',
                    taskId
                )

                const task = await markTaskAsDone(eventId, taskId)

                if (task) {
                    res.status(200).json(task)
                } else {
                    res.status(404).json({ error: 'Task not found' })
                }
            }
        )

        // Inside undoMarkTaskAsDone function
        const undoMarkTaskAsDone = async (eventId, taskId) => {
            try {
                const result = await tasksCollection.updateOne(
                    { event: eventId, id: taskId },
                    { $set: { done: false } }
                )

                if (result && result.modifiedCount > 0) {
                    const updatedTask = await tasksCollection.findOne({
                        event: eventId,
                        id: taskId,
                    })
                    console.log('Task marked as not done:', updatedTask)
                    return updatedTask
                } else {
                    console.error('Task not found')
                    return null
                }
            } catch (error) {
                console.error('Error undoing mark task as done:', error)
                return null
            }
        }

        // Endpoint to undo marking a specific task as done
        app.put('/events/:eventId/tasks/:taskId/undo', async (req, res) => {
            const eventId = req.params.eventId
            const taskId = req.params.taskId

            const task = await undoMarkTaskAsDone(eventId, taskId)

            if (task) {
                res.status(200).json(task)
            } else {
                res.status(404).json({ error: 'Task not found' })
            }
        })

        const deleteEvent = async (eventId) => {
            try {
                // Get the event before deleting it to retrieve associated task IDs
                const event = await eventsCollection.findOne({ id: eventId })

                if (!event) {
                    return false // Event not found
                }

                // Extract task IDs from the event
                const taskIds = event.tasks.map((task) => task.id)

                // Delete the event from the events collection
                const result = await eventsCollection.deleteOne({ id: eventId })

                if (result.deletedCount > 0) {
                    // Delete associated tasks from the tasks collection
                    await tasksCollection.deleteMany({ id: { $in: taskIds } })

                    return true // Event and associated tasks deleted successfully
                } else {
                    return false // Event not found or not deleted
                }
            } catch (error) {
                console.error('Error deleting event and tasks:', error)
                return false
            }
        }

        app.delete('/events/:eventId', async (req, res) => {
            const eventId = req.params.eventId

            const isEventDeleted = await deleteEvent(eventId)

            if (isEventDeleted) {
                res.status(200).json({ message: 'Event deleted successfully' })
            } else {
                res.status(404).json({ error: 'Event not found' })
            }
        })

        // Function to delete a task
        const deleteTask = async (eventId, taskId) => {
            try {
                const result = await tasksCollection.deleteOne({
                    event: eventId,
                    id: taskId,
                })

                return result.deletedCount > 0
            } catch (error) {
                console.error('Error deleting task:', error)
                return false
            }
        }

        // Endpoint to delete a specific task
        app.delete('/events/:eventId/tasks/:taskId', async (req, res) => {
            const eventId = req.params.eventId
            const taskId = req.params.taskId

            const isTaskDeleted = await deleteTask(eventId, taskId)

            if (isTaskDeleted) {
                res.status(200).json({ message: 'Task deleted successfully' })
            } else {
                res.status(404).json({ error: 'Task not found' })
            }
        })

        app.listen(process.env.PORT || port, () => {
            console.log("REST API is listening.");
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error)
    })

process.on('SIGINT', () => {
    console.log('Closing MongoDB connection')
    mongoClient.close()
    process.exit()
})
