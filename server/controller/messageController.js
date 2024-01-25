const conversationModel = require('../model/conversationModel')
const messageModel=require('../model/messageModel')
const userModel=require("../model/userModel")

//create
const createMessageController=async(req,res)=>{
  const {conversationID,senderID,message,recieverID=''}=req.body
  if(!senderID || !message){
    return res.status(400).send({message:'please fill all the fields'})
  }
  
  try {
    if(conversationID==='new' && recieverID){
      const newConversation=await new conversationModel({members:[senderID,recieverID]}).save()
      await new messageModel({conversationID:newConversation._id,senderID,message}).save()
      return res.status(200).send({
        success:true,
        message:'new message created'
      })
    }else if (!conversationID && !recieverID){
      return res.status(400).send({message:'all fields are required'})
    }
    const mssg=await new messageModel({conversationID,senderID,message})
    .save()
    res.status(200).send({
      success:true,
      message:'new message created',
      mssg:mssg
    })
  } catch (error) {
    console.log('error :',error)
  }
}

// //get message
// const getMessageController=async(req,res)=>{
//   const {conversationID}=req.params
//   if(conversationID==='new') return res.status(200).json([])
  
//   try {
//     const messages=await messageModel.find({conversationID})
//     const messageUserData=Promise.all(messages.map(async(message)=>{
//       const user=await userModel.findById(message.senderID)
//        return {
//         user:{name:user.name,email:user.email},
//         message:message.message
//       }
//     }))
//     res.status(200).json(await messageUserData)
//   } catch (error) {
//     console.log('error :',error)
//   }
// }

// getMessageController
const getMessageController = async (req, res) => {
  const { conversationID } = req.params;
  if (conversationID === 'new') return res.status(200).json([]);

  try {
    const messages = await messageModel.find({ conversationID });
    const messageUserData = await Promise.all(messages.map(async (message) => {
      const user = await userModel.findById(message.senderID);
      return {
        user: { _id:user._id,name: user.name, email: user.email },
        message: message.message,
      };
    }));
    res.status(200).json(messageUserData);
  } catch (error) {
    console.log('error:', error);
  }
};


module.exports={
  createMessageController,
  getMessageController
}