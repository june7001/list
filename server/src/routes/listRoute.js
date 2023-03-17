const express = require('express');
const listController = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/lists', authMiddleware, listController.createList);
router.get('/lists/:id', authMiddleware, listController.getListById);



module.exports = router;
