const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notifyController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, notifyController.createNotification);
router.get('/:userId', authMiddleware, notifyController.getNotifications);
router.put('/:id/read', authMiddleware, notifyController.markAsRead);
router.delete('/:id', authMiddleware, notifyController.deleteNotification);

module.exports = router;
