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
            name: 'Event1',
            desc: 'Description of event 1',
            date: '2012-04-23',
        },
        {
            name: 'Event2',
            desc: 'Description of event 2',
            date: '2012-04-12',
        },
        {
            name: 'Event3',
            desc: 'Description of event 3',
            date: '2012-05-01',
        },
        {
            name: 'Event4',
            desc: 'Description of event 4',
            date: '2012-04-28',
        },
        {
            name: 'Event5',
            desc: 'Description of event 5',
            date: '2012-03-30',
        },
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

app.get('/events', (req, res) => {
    res.send(events)
})

app.get('/events/:name', (req, res) => {
    const name = req.params['name']
    let result = findEventByName(name)
    if (result === undefined) {
        res.status(404).send('Resource not found.')
    } else {
        res.send(result)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/events`)
})
