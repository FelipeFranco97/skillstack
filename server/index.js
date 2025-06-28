const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('API is running!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})