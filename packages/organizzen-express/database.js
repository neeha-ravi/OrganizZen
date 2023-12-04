import { MongoClient /*, ObjectId*/ } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoURI = process.env.MONGODB_URI

const connectToMongoDB = async () => {
  const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })

  console.log("hello")
  try {
      console.log('Connecting to MongoDB...')
      await client.connect()
      console.log('Connected to MongoDB')
      return client
  } catch (err) {
      console.error('Error connecting to MongoDB:', err)
      throw err
  }
}


//EVENT STUFF

// Function to get events, accesses events collection from database
async function getEvents() {
    const client = await connectToMongoDB()
    const eventsCollection = client.db('Cluster0').collection('userEvents')

    try {
        const events = await eventsCollection.find().toArray()
        return events
    } catch (error) {
        console.error('Error fetching events:', error)
        throw error
    } finally {
        client.close()
    }
}

// Function to add an event
async function addEvent(event) {
    const client = await connectToMongoDB()
    const eventsCollection = client.db('Cluster0').collection('userEvents')

    try {
        const addedEvent = await eventsCollection.insertOne(event)
        return addedEvent.ops[0]
    } catch (error) {
        console.error('DB: Error adding event:', error)
        throw error
    } finally {
        client.close()
    }
}

// Function to get tasks for a specific event
async function getTasksForEvent(eventId) {
    const client = await connectToMongoDB()
    const tasksCollection = client.db('Cluster0').collection('eventTasks')

    try {
        const tasks = await tasksCollection.find({ eventId: eventId }).toArray()
        return tasks
    } catch (error) {
        console.error('DB: Error fetching tasks:', error)
        throw error
    } finally {
        client.close()
    }
}

// Function to add a task for a specific event
async function addTaskForEvent(eventId, task) {
    const client = await connectToMongoDB()
    const tasksCollection = client.db('Cluster0').collection('eventTasks')

    try {
        task.eventId = eventId // Set the event id for the task
        const addedTask = await tasksCollection.insertOne(task)
        return addedTask.ops[0]
    } catch (error) {
        console.error('DB: Error adding task:', error)
        throw error
    } finally {
        client.close()
    }
}

export {
    connectToMongoDB,
    getEvents,
    addEvent,
    getTasksForEvent,
    addTaskForEvent,
}
