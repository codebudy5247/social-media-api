const jwt = require("jsonwebtoken");
const User =  require("./MODEL/User")


const auth = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')
      // req.user = decoded?.sub
      console.log("USER",req.user);

      next()
    } catch (err) {
      console.log(err)
      res.status(401).json({msg: err.message})
      
    }
  }

  if (!token) {
    res.status(401).json({msg: "Invalid Authentication."})
   
  }
}

module.exports=auth;