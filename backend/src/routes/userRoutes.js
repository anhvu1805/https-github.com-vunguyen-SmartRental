const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Allow user creation without admin check initially
const createUserMiddleware = async (req, res, next) => {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    // Allow first user creation or require admin role
    if (userCount === 0 || req.headers['x-user-role'] === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Chỉ admin mới được tạo người dùng' });
};

router.get('/', userController.index);
router.get('/admin-debug/:id', userController.showDebug);
router.post('/', createUserMiddleware, userController.store);
router.get('/:id', userController.show);
router.put('/:id', adminMiddleware, userController.update);
router.delete('/:id', adminMiddleware, userController.destroy);

module.exports = router;