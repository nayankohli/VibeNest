// Fix for authMiddleware.js
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const {User} = require('../models/user.js') // Adjust path if needed

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Debugging - log the token to see what's being received
      token = req.headers.authorization.split(' ')[1]
      
      // Check if token exists and is not undefined/null
      if (!token) {
        res.status(401)
        throw new Error('Not authorized, token is missing')
      }

      // Try to decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find user by ID
      req.user = await User.findById(decoded.id).select('-password')
      
      if (!req.user) {
        res.status(404)
        throw new Error('User not found')
      }

      next()
    } catch (error) {
      // More specific error handling
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