const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/serviceController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', serviceCtrl.index);
router.post('/', adminMiddleware, serviceCtrl.store);
router.delete('/:id', adminMiddleware, serviceCtrl.destroy);

module.exports = router;