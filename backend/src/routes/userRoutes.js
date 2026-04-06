const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const createUserMiddleware = async (req, res, next) => {
    const userCount = await User.countDocuments();
    if (userCount === 0) return next();
    return verifyToken(req, res, () => adminMiddleware(req, res, next));
};

const canViewUser = (req, res, next) => {
    if (req.user?.role === 'admin' || req.user?.id === req.params.id) return next();
    return res.status(403).json({ error: 'Không có quyền xem thông tin này' });
};

router.get('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/admin-debug/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/', createUserMiddleware, async (req, res) => {
    try {
        const { username, password, fullName, role } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username và mật khẩu là bắt buộc' });

        const existing = await User.findOne({ username });
        if (existing) return res.status(409).json({ error: 'Tên đăng nhập đã tồn tại' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, fullName: fullName || '', role: role === 'admin' ? 'admin' : 'user' });
        await newUser.save();

        res.status(201).json({ _id: newUser._id, username: newUser.username, fullName: newUser.fullName, role: newUser.role });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', verifyToken, canViewUser, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
        const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;