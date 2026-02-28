const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const { wrapController } = require('../utils/wrapController')

const wrappedController = wrapController(controller);

router.use(authMiddleware)
router.delete('/delete/:id', wrappedController.delete)
router.put('/updateTimezone', wrappedController.updateTimezone)
router.get('/me', wrappedController.me);
router.patch('/me', wrappedController.updateProfile);


module.exports = router;