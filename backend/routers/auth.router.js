const express = require('express')
const controller = require('../controllers/auth.controller');
const { wrapController } = require('../utils/wrapController');
const { authRateLimit } = require('../middlewares/rate-limit.middleware');
const router = express.Router();

const wrappedController = wrapController(controller)
router.post('/register', authRateLimit, wrappedController.register)
router.post('/login', authRateLimit, wrappedController.login)
router.post('/logout', wrappedController.logout)
router.get('/refresh', wrappedController.refresh);

module.exports = router;