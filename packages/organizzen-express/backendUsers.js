import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
//import { MongoClient } from 'mongodb'
import { connectToMongoDB } from './database.js'

const app = express()
const port = 8001

app.use(
    cors({
        origin: 'https://zealous-island-0e0d1bb1e.4.azurestaticapps.net',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
)
app.use(bodyParser.json())
app.use(express.json())

let mongoClient

// Use connectToMongoDB function to establish connection
connectToMongoDB()
    .then((client) => {
        mongoClient = client
        console.log('Connected to MongoDB - users')

        const usersCollection = mongoClient
            .db('OrganizzenData') // Replace with your actual database name
            .collection('OZusers') // Replace with your actual collection name

        app.get('/', (req, res) => {
            res.send('This is the backendUser.js file!')
        })

        // Retrieve users
        app.get('/users', async (req, res) => {
            try {
                const users = await usersCollection.find({}).toArray()
                res.json({ users_list: users })
            } catch (error) {
                console.error('Error fetching users:', error)
                res.status(500).json({ error: 'Failed to fetch users' })
            }
        })

        app.get('/users/:userId', async (req, res) => {
            const id = req.params.userId
            try {
                const user = await usersCollection.findOne({
                    userId: id,
                })
                if (user) {
                    res.json(user)
                } else {
                    res.status(404).json({ error: 'User not found' })
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                res.status(500).json({ error: 'Failed to fetch user' })
            }
        })

        const addUser = async (user) => {
            // try {
            // Check for duplicate username or email
            const existingUser = await usersCollection.findOne({
                $or: [{ username: user.username }, { email: user.email }],
            })

            if (existingUser) {
                return {
                    status: 'error',
                    error: 'Username or email already exists.',
                }
            }

            const result = await usersCollection.insertOne(user)
            const insertedUser = result.ops[0]

            if (!insertedUser) {
                return {
                    status: 'error',
                    error: 'Failed to add user to the database.',
                }
            }

            console.log('User added successfully: ', insertedUser)
            return { status: 'success', user: insertedUser }
            // }
            // } catch (error) {
            //     return { status: 'error', error: 'Failed to add user' }
            // }
        }

        app.post('/users', async (req, res) => {
            try {
                const userToAdd = req.body
                const result = await addUser(userToAdd)

                if (result.error) {
                    // Send a 400 Bad Request status for duplicate user
                    res.status(400).json({ error: result.error })
                } else {
                    res.status(201).json(result)
                }
            } catch (error) {
                console.error('Error adding user:', error.message)
                //res.status(500).json({ error: 'Failed to add user' })
            }
        })

        app.listen(process.env.PORT || port, () => {
            console.log('REST API is listening - users.')
        })
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB - users', error)
    })

process.on('SIGINT', () => {
    console.log('Closing MongoDB users connection')
    mongoClient.close()
    process.exit()
})
