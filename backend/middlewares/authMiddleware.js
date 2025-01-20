const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");
const {User} = require('../models/user.js');
const protect = asyncHandler(async (req, res, next) => {
  console.log("protect route");
    let token;
  console.log( req.headers.authorization );
  console.log(req.headers.authorization.startsWith("Bearer"));
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        console.log("try block");
        token = req.headers.authorization.split(" ")[1];
      console.log(token);
        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decicee");
  
        req.user = await User.findById(decoded.id).select("-password");
  console.log("user");
        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
    if (!token) {
      console.log("error");
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  
  });
module.exports={protect};  