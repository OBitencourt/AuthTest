import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import dbConnect from './src/utils/dbConnect.js'

const app = express()
dotenv.config()
app.use(express.json())

// Connecting to DB

dbConnect()

// Public Route 

app.get('/', (req,res) => {

    res.status(200).json({message: "Tudo certo"})
})


const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("Server is listening!")
})