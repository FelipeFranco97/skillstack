const express = require('express')
const cors = require('cors')
const connectDB = require('./db')
require('dotenv').config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Conexión a la base de datos
connectDB()

// Rutas
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// Iniciar servidor
const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})