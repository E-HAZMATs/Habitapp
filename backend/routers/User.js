const express = require('express')
const user = express.Router()

const timeLog = (req, res, next) => {
    console.log('Time now: ', Date.now())
    next()
}

user.use(timeLog)
user.get('/', (req, res) => {
    res.send('user router here.')
})

module.exports = user;