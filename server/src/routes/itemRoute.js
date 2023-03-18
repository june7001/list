const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/addItem', authMiddleware, itemController.addItem);
router.delete('/deleteItem/:id', authMiddleware, itemController.deleteItem);
router.put('/updateItem', authMiddleware, itemController.updateItem);

module.exports = router;
