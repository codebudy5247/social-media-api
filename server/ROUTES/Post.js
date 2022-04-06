const express=require('express');
const router=express.Router();
const {createPost,getPosts,likePost,updatePost,deletePost, getPostById,unLikePost} = require("../CONTROLLER/post.controller")
const Auth = require("../verifyToken")

router.post('/',Auth,createPost)
router.get('/v1',getPosts)
router.patch('/:id/like', Auth, likePost)
router.patch('/:id',Auth,unLikePost)
router.patch('/:id',Auth,updatePost)
router.delete('/:id',Auth,deletePost)
router.get('/:id',getPostById)


module.exports=router;