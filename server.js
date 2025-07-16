import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import dbConnect from './src/utils/dbConnect.js'

// Controllers imports

import { createUser, getPublicUsers, getUser, loginUser } from './src/controllers/User.js'

// Middlewares imports

import { checkToken } from './src/middlewares/checkToken.js'

//

const app = express()
dotenv.config()
app.use(express.json())

// Allow cors

app.use(cors())

// Connecting to DB

dbConnect()

// Public Route 

app.get('/', getPublicUsers)

// Private Route

app.get('/user/:id', checkToken , getUser)

// Create User

app.post('/auth/register', createUser)

// Login

app.post("/auth/login", loginUser)

// Server listen

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("Server is listening!")
})