const express = require('express');
const router = express.Router();
const roomCtrl = require('../controllers/roomController');
const upload = require('../middlewares/uploadMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', roomCtrl.index);
router.get('/:id', roomCtrl.show);
router.post('/', adminMiddleware, upload.single('image'), roomCtrl.store);
router.put('/:id', adminMiddleware, upload.single('image'), roomCtrl.update);
router.delete('/:id', adminMiddleware, roomCtrl.destroy);

module.exports = router;