const express=require('express');
const router=express.Router();
const {getUser,followUser} = require("../CONTROLLER/user.controller")
const Auth = require("../verifyToken")

router.get('/user',Auth,getUser)
router.patch('/user/:id/follow',Auth, followUser)


module.exports=router;