const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Logic kiểm tra user trong DB (đây là ví dụ)
        const user = await User.findOne({ username });
        
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.roleID },
            'SECRET_KEY_CUA_BAN',
            { expiresIn: '1d' }
        );

        res.json({ token, user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};