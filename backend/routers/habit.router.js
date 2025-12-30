const express = require('express')
const router = express.Router()
const habitController = require('../controllers/habit.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const { wrapController } = require('../utils/wrapController')

const wrappedController = wrapController(habitController)
router.use(authMiddleware)
router.post('/create', wrappedController.create)
router.patch('/update/:id', wrappedController.update)
router.delete('/delete/:id', wrappedController.delete)
router.get('/getAllByUser', wrappedController.getAllByUser)
router.get('/getById/:id', wrappedController.getById)
module.exports = router