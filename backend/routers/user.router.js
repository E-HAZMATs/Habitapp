const express = require('express')
const user = express.Router()
const controller = require('../controllers/user.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const { wrapController } = require('../utils/wrapController')

const wrappedController = wrapController(controller);
// TODO?: maybe i should move the authentication endpoints to auth service?
// keep user service for existing user data operations?
user.post('/register', wrappedController.register)
user.post('/login', wrappedController.login)
user.get('/authRoute', authMiddleware, (req, res) => {
    res.send('hi')
})
user.post('/logout', wrappedController.logout)

module.exports = user;