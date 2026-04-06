const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwtSecret = process.env.JWT_SECRET || 'smart-rental-secret';

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username và mật khẩu là bắt buộc' });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });

        const token = jwt.sign({ id: String(user._id), role: user.role || 'user', username: user.username }, jwtSecret, { expiresIn: '8h' });
        res.status(200).json({ message: 'Đăng nhập thành công', token, role: user.role || 'user', username: user.username, fullName: user.fullName });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;