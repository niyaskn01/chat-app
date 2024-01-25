const mongoose=require('mongoose')
const schema=mongoose.Schema

const messageSchema=new schema({
  conversationID:{
    type:String,
  },
  senderID:{
    type:String
  },
  message:{
    type:String
  } 
},{timestamps:true})

module.exports=mongoose.model('message',messageSchema)