const express = require('express')
const controller = require('../controllers/auth.controller');
const { wrapController } = require('../utils/wrapController');
const router = express.Router();

const wrappedController = wrapController(controller)
router.post('/register', wrappedController.register)
router.post('/login', wrappedController.login)
router.post('/logout', wrappedController.logout)
router.get('/refresh', wrappedController.refresh);

module.exports = router;