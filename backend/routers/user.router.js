const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const { wrapController } = require('../utils/wrapController')

const wrappedController = wrapController(controller);

router.get('/authRoute', authMiddleware, (req, res) => {
    res.send('hi')
})


module.exports = router;