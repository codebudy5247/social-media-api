const express=require('express');
const router=express.Router();
const {createPost,getPosts} = require("../CONTROLLER/post.controller")
const Auth = require("../verifyToken")

router.post('/',Auth,createPost)
router.get('/v1',getPosts)


module.exports=router;