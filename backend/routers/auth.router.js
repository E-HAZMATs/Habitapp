const express = require('express')
const controller = require('../controllers/auth.controller');
const { wrapController } = require('../utils/wrapController');
const router = express.Router();

const wrappedController = wrapController(controller)
router.get('/refresh', wrappedController.refresh);

module.exports = router;