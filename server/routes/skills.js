const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { createSkill, updateSkill, obtainSkill, deleteSkill } = require('../controllers/skillController')

router.post('/', authMiddleware, createSkill)

router.put('/:id', authMiddleware, updateSkill)

router.get('/', authMiddleware, obtainSkill)

router.delete('/:id', authMiddleware, deleteSkill)

module.exports = router