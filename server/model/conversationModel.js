const mongoose=require('mongoose')
const schema=mongoose.Schema

const conversationSchema=new schema({
  members:{
    type:Array,
    required:true
  }
},{timestamps:true})

module.exports=mongoose.model('conversation',conversationSchema)