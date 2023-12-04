// backend.js

import express from 'express'
import cors from 'cors'

const app = express()
const port = 8001

app.use(cors())
app.use(express.json()) // set up express to process incoming data in JSON format

// Store events with associated tasks
const users = {
    users_list: [
        {
            userId: '1',
            username: 'user1',
            password: 'user1password',
            email: 'user1@realemail.com',
        },
    ],
}

const findEventById = (eventId) => {
    return users['users_list'].find((event) => event.id === eventId)
}

const usedUserIds = new Set()
usedUserIds.add(1).add(2)

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
    res.send('This is the backendUser.js file!') // sets the endpoint to accept http GET requests
})

// Retrieve users
app.get('/users', (req, res) => {
    res.send(users)
})

app.get('/users/:userId', (req, res) => {
    const id = req.params.Id
    let result = findEventById(id)
    if (result === undefined) {
        res.status(404).send('Resource not found.')
    } else {
        res.send(result)
    }
})

// USERS
const addUser = (user) => {
    user.userId = generateUniqueId(usedUserIds)
    users['users_list'].push(user)
    return user
}

app.post('/users', (req, res) => {
    const userToAdd = req.body
    if (userToAdd) {
        addUser(userToAdd)
        res.status(201).json(userToAdd)
    } else {
        res.status(500).json({ error: 'Failed to add user' })
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/users`)
})
