import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import dbConnect from './src/utils/dbConnect.js'
import UserModel from './src/models/user.js'

const app = express()
dotenv.config()
app.use(express.json())

// Connecting to DB

dbConnect()

// Public Route 

app.get('/', (req,res) => {

    res.status(200).json({message: "Tudo certo"})
})

// Create User

app.post('/auth/register', async (req, res) => {
  const {
    name,
    email,
    password,
    passwordConfirm
  } = req.body

  // Simple verification

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(422).json({ message: "Preencha os campos corretamente" })
  }

  if (password !== passwordConfirm) {
    return res.status(422).json({ message: "A senha e a confirmação de senha precisam ser iguais!" })
  }

  // Verify user existence

  const userExists = await UserModel.findOne({ email: email })
  if (userExists) {
    return res.status(422).json({ message: "Este e-mail já está em uso!" })
  }

  try {

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Criar o usuário
    const user = new UserModel({
      name: name,
      email: email,
      password: passwordHash
    })

    await user.save()

    return res.status(201).json({ message: "Usuário criado com sucesso", user: user })

  } catch (error) {
    return res.status(500).json({ message: "Erro interno", error })
  }
})

// Login

app.post("/auth/login", async (req,res) => {

    const {
        email,
        password
    } = req.body

    // validations

    if (!email || !password) {
        return res.status(422).json({ message: "Preencha os campos corretamente" })
    }

    // verify user existence

    const user = await UserModel.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ message: "Usuário não está cadastrado!" })
    }

    // check if password match

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ message: "A senha está incorreta!" })       
    }
})

// Server listen

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("Server is listening!")
})