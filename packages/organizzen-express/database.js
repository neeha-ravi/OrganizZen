import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

//const users_mongoURI = process.env.MONGODB_URI_USERS
const mongoURI = process.env.MONGODB_URI

// const connectToMongoDBUsers = async () => {
//     try {
//         const client = new MongoClient(users_mongoURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         await client.connect()
//         return client
//     } catch (error) {
//         throw new Error('Failed to connect to MongoDB - users')
//     }
// }

const connectToMongoDB = async () => {
    try {
        const client = new MongoClient(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        await client.connect()
        return client
    } catch (error) {
        throw new Error('Failed to connect to MongoDB - main')
    }
}

export { connectToMongoDB }
