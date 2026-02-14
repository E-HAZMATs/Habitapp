const express = require('express');
const router = express.Router();
const habitLogController = require('../controllers/habitLog.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { wrapController } = require('../utils/wrapController');

const wrappedController = wrapController(habitLogController);

router.use(authMiddleware);
router.get('/getByUser', wrappedController.getLogsByUser);

module.exports = router;