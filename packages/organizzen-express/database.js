import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

//const users_mongoURI = process.env.MONGODB_URI_USERS
const main_mongoURI = process.env.MONGODB_URI_MAIN

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

const connectToMongoDBMain = async () => {
    try {
        const client = new MongoClient(main_mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        await client.connect()
        return client
    } catch (error) {
        throw new Error('Failed to connect to MongoDB - main')
    }
}

export { connectToMongoDBMain }
