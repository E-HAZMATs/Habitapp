const express = require('express')
const user = express.Router()
const controller = require('../controllers/user.controller')

const timeLog = (req, res, next) => {
    console.log('Time now: ', Date.now())
    next()
}

user.use(timeLog)

user.get('/', (req, res) => {
    res.send('user router here.')
})

user.post('/register', controller.register)
user.post('/login', controller.login)

module.exports = user;