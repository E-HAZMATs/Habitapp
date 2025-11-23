const express = require('express')
const controller = require('../controllers/auth.controller')
const router = express.Router();

router.get('/refresh', controller.refresh);

module.exports = router;