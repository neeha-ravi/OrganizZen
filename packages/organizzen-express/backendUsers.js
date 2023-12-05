// backendUsers.js

import express from 'express';
import cors from 'cors';

const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

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
};

const findEventById = (userId) => {
    return users['users_list'].find((user) => user.userId === userId);
};

const usedUserIds = new Set();
usedUserIds.add(1).add(2);

// Generate a unique ID between 1 and infinity
const generateUniqueId = (usedIds) => {
    let id = 1;
    while (usedIds.has(id)) {
        id++;
    }
    usedIds.add(id);
    return id.toString();
};

app.get('/', (req, res) => {
    res.send('This is the backendUser.js file!');
});

// Retrieve users
app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/users/:userId', (req, res) => {
    const id = req.params.userId;
    let result = findEventById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

// USERS
const addUser = (user) => {
    if (!user.username || !user.password || !user.email) {
        throw new Error('Username, password, and email are required.');
    }

    user.userId = generateUniqueId(usedUserIds);
    users['users_list'].push(user);
    return user;
};

app.post('/users', (req, res) => {
    try {
        const userToAdd = req.body;
        addUser(userToAdd);
        res.status(201).json(userToAdd);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/users`);
});
