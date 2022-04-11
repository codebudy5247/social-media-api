const express=require('express');
const router=express.Router();
const Auth = require("../verifyToken")
const {createComment,deleteComment} = require("../CONTROLLER/comment.controller")

router.post('/', Auth, createComment)
router.delete('/:commentId', Auth, deleteComment)


module.exports=router;