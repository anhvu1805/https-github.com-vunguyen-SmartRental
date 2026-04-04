const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, password, fullName } = req.body;
        const newUser = new User({ username, password, fullName });
        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};