const express=require('express');
const router=express.Router();
const {CreateUser,LoginUser,CreateAdmin,LoginAdmin}=require('../CONTROLLER/auth.controller')


router.post('/user/signup',CreateUser);
router.post('/user/signin',LoginUser);
router.post('/admin/signup',CreateAdmin)
router.post('/admin/signin',LoginAdmin)


module.exports=router;