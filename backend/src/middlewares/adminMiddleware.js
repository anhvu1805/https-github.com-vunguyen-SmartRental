const adminMiddleware = (req, res, next) => {
    // Kiểm tra header x-admin-token hoặc x-user-role
    const userRole = req.headers['x-user-role'];
    
    if (userRole === 'admin') {
        return next();
    }
    
    return res.status(403).json({ error: 'Chỉ admin mới được thực hiện action này' });
};

module.exports = adminMiddleware;
