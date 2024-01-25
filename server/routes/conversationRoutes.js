const express=require('express')
const { createConversationController, getConversationController } = require('../controller/conversationController')
const router=express.Router()

//create
router.post('/create',createConversationController)

//get
router.get('/get-conversation/:userID',getConversationController)


module.exports=router