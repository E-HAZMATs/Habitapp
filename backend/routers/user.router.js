const express = require('express')
const user = express.Router()
const controller = require('../controllers/user.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

user.get('/', (req, res) => {
    res.send('user router here.')
})

user.post('/register', controller.register)
user.post('/login', controller.login)
user.get('/authRoute', authMiddleware, (req, res) => {
    res.send('hi')
})

module.exports = user;