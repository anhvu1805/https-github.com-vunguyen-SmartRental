const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username và mật khẩu là bắt buộc' });
        }

        // Find user with this username and password
        const user = await User.findOne({ username, password });
        
        if (!user) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Use role from database (defaults to 'user' if not set)
        const userRole = user.role || 'user';

        res.status(200).json({ 
            message: 'Đăng nhập thành công',
            role: userRole,
            username: user.username,
            fullName: user.fullName
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};