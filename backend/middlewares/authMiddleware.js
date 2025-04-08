// Fix for authMiddleware.js
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {User} = require('../models/user.js') 

const protect = asyncHandler(async (req, res, next) => {
  let token
console.log(req.headers.authorization);
console.log(req.headers.authorization.startsWith('Bearer'));
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      console.log("try block");
      if (!token) {
        res.status(401)
        throw new Error('Not authorized, token is missing')
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      
      if (!req.user) {
        res.status(404)
        throw new Error('User not found')
      }

      next()
    } catch (error) {
      console.error('Auth error details:', error.message)
      
      if (error.name === 'JsonWebTokenError') {
        res.status(401)
        throw new Error('Invalid token format')
      } else {
        res.status(401)
        throw new Error('Not authorized, authentication failed')
      }
    }
  } else {
    res.status(401)
    throw new Error('Not authorized, no token provided')
  }
})

module.exports = { protect }