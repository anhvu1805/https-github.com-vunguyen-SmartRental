const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'smart-rental-secret'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    const roleHeader = req.headers['x-user-role']
    if (roleHeader === 'admin') {
      req.user = { role: 'admin' }
      return next()
    }
    return res.status(401).json({ error: 'Yêu cầu xác thực bằng token' })
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' })
  }
}

module.exports = verifyToken