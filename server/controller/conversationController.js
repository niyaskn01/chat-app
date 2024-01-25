const conversationModel=require('../model/conversationModel')
const userModel = require('../model/userModel')

//create
const createConversationController=async(req,res)=>{
  const {senderID,recieverID}=req.body
  try {
    const newConversation=new conversationModel({members:[senderID,recieverID]})
    await newConversation.save()
    res.status(200).send({
      success:true,
      message:'new conversation created'
    })
  } catch (error) {
    console.log('error :',error)
  }
}
//get conversations
const getConversationController=async(req,res)=>{
  const {userID}=req.params
  try {
    const conversations = await conversationModel.find({ members: { $in: [userID] } }).sort({createdAt:-1});
    
    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverID = conversation.members.find((member) => member !== userID);
        const reciever= await userModel.findById(receiverID);
        return {
          user:{name:reciever.name,email:reciever.email,_id:reciever._id},
          conversationID:conversation._id
        }
      })
    );
    res.status(200).json(conversationUserData)
  } catch (error) {
    console.log('error :',error);
  }
}


module.exports={
  createConversationController,
  getConversationController
}