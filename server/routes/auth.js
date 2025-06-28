const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        return res.status(400).json({ message: 'Faltan datos'})
    }

    const fakeToken = '123456.fake.token'
    res.json({ token: fakeToken, user: {email}})
})

module.exports = router