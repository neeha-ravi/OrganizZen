
// database.js
require('dotenv').config()
const { MongoClient } = require('mongodb')

const mongoURI = process.env.MONGODB_URI

const connectToMongoDB = async () => {
  const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  try {
    await client.connect();
    console.log('Connected to MongoDB')
    return client
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    throw err
  }
};

export { connectToMongoDB }
