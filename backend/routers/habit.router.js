const express = require('express')
const router = express.Router()
const habitController = require('../controllers/habit.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

router.use(authMiddleware)
router.post('/create', habitController.create)

module.exports = router