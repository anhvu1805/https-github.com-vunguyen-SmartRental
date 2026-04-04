const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.index);
router.post('/', roomController.store);
router.delete('/:id', roomController.destroy);

module.exports = router;