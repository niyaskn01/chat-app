const express=require('express')
const { createMessageController, getMessageController } = require('../controller/messageController')
const router=express.Router()

//create
router.post('/message',createMessageController)

//get
router.get('/message/:conversationID',getMessageController)
module.exports=router