const express = require('express')
const user = express.Router()
const controller = require('../controllers/user.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')

user.get('/', (req, res) => {
    res.send('user router here.')
})

// TODO?: maybe i should move the authentication endpoints to auth service?
// keep user service for existing user data operations?
user.post('/register', controller.register)
user.post('/login', controller.login)
user.get('/authRoute', authMiddleware, (req, res) => {
    res.send('hi')
})
user.post('/logout', controller.logout)

module.exports = user;