const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', contractController.index);
router.post('/', adminMiddleware, contractController.store);
router.get('/:id', contractController.show);
router.put('/:id/return', adminMiddleware, contractController.returnRoom);
router.delete('/:id', adminMiddleware, contractController.destroy);

module.exports = router;