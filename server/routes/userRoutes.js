const express=require('express')
const { userRegisterController, userLoginController, getAllUsersController } = require('../controller/userController')
const router=express.Router()

//register
router.post('/register',userRegisterController)

//login
router.post('/login',userLoginController)

//get all users
router.get('/all-users',getAllUsersController)

module.exports=router