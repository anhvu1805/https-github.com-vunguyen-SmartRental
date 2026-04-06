const adminMiddleware = (req, res, next) => {
  const roleHeader = req.headers['x-user-role']
  if (req.user?.role === 'admin' || roleHeader === 'admin') {
    return next()
  }
  return res.status(403).json({ error: 'Chỉ admin mới được thực hiện action này' })
}

module.exports = adminMiddleware
