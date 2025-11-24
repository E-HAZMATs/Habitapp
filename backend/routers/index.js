// Container for my routers.
const express = require('express');
const router = express.Router();

router.use('/user', require('./user.router'));
router.use('/auth', require('./auth.router'));
router.use('/habit', require('./habit.router'));

module.exports = router;
