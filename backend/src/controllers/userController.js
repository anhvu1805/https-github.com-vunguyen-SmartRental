const User = require('../models/User');

exports.index = async (req, res) => {
    try {
        // Get all users but don't select -password to see all fields
        const users = await User.find();
        const cleaned = users.map(u => {
            const obj = u.toObject();
            delete obj.password;
            return obj;
        });
        res.json(cleaned);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.showDebug = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const obj = user.toObject();
        console.log('Full user object:', obj);
        res.json(obj);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.store = async (req, res) => {
    try {
        const { username, password, fullName, role } = req.body;
        
        console.log('\n=== USER STORE ===');
        console.log('Request body:', req.body);
        console.log('Extracted: username=%s, password=%s, role=%s', username, password, role);
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username và mật khẩu là bắt buộc' });
        }
        
        // Create and save user
        const userObj = {
            username,
            password,
            fullName: fullName || '',
            role: (role === 'admin' || role === 'user') ? role : 'user'
        };
        
        console.log('Object to save:', userObj);
        
        const newUser = new User(userObj);
        console.log('New user before save:', {
            username: newUser.username,
            role: newUser.role,
            roleType: typeof newUser.role
        });
        
        await newUser.save();
        console.log('New user after save:', {
            username: newUser.username,
            role: newUser.role,
            roleType: typeof newUser.role
        });
        
        const safeUser = {
            _id: newUser._id,
            username: newUser.username,
            fullName: newUser.fullName,
            role: newUser.role,
            __v: newUser.__v
        };
        
        console.log('Response object:', safeUser);
        console.log('=== END USER STORE ===\n');
        
        res.status(201).json(safeUser);
    } catch (err) {
        console.error('❌ Error in store:', err);
        res.status(400).json({ error: err.message });
    }
};

exports.show = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const obj = user.toObject();
        delete obj.password;
        res.json(obj);
    } catch (err) {
        res.status(404).json({ message: "Không tìm thấy" });
    }
};

exports.update = async (req, res) => {
    try {
        const updateData = { ...req.body };
        const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};