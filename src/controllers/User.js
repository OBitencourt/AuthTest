import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function getPublicUsers (req, res) {

    const users = await UserModel.find()

    res.status(200).json({message: "Tudo certo", users})

}

export async function getUser (req, res) {
  const { id } = req.params

  const user = await UserModel.findById(id, '-password') // Takes all the informations but password

  if(!user) {
      return res.status(404).json({message: "Usuário não encontrado"}) 
  } else {
      return res.status(200).json({message: "Usuário encontrado", user}) 
  }

}

export async function createUser (req, res) {

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
}

export async function loginUser (req, res) {
    
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

  
  try {

      const secret = process.env.SECRET

      const token = jwt.sign({
          id: user._id
      }, secret, { expiresIn: '1h' })

      return res.status(200).json({message: "Autenticação realizada!", token})

  } catch (err) {
      return res.status(500).json({ message: "Houve um erro!" })       
  }
}