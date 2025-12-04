const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const { authMiddleware, hasRole } = require('../middlewares/auth.middleware')
const { wrapController } = require('../utils/wrapController')

const wrappedController = wrapController(controller);

router.use(authMiddleware)
router.get('/authRoute', authMiddleware, (req, res) => {
    res.send('hi')
})
router.delete('/delete/:id', wrappedController.delete)
router.get('/admin', hasRole('admin'), (req, res)=>{
    res.send('hi admin')
})


module.exports = router;