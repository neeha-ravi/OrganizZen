/* global process */
import mongoose from "mongoose"
import dotenv from "dotenv"

// Load environment variables from a .env file
dotenv.config()

// eslint-disable-next-line no-unused-vars
const mongoURI = process.env.MONGODB_URI
