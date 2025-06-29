const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    // Se verifica si el usuario existe
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    // Se encripta la conseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Se crea y se guarda el nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
    })

    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado correctamente' })
  } catch (error) {
    console.error('Error en /register: ', error.message)
    res.status(500).json({ message: 'Error de servidor' })
  }
})

module.exports = router

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Se busca el usuario
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    // Se compara la contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    // Se crea el token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

    // Se envía la respuesta
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Error en /login:', error.message)
    res.status(500).json({ message: 'Error del servidor' })
  }
})
