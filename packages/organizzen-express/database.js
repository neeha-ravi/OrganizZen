import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const connectToMongoDB = async () => {
    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        return client;
    } catch (error) {
        throw new Error('Failed to connect to MongoDB');
    }
};

export { connectToMongoDB };
