const express=require('express')
const app=express()
const cors=require('cors')
require('dotenv').config()
const db=require('./config/connection')
const userRouter=require('./routes/userRoutes')
const conversationRouter=require('./routes/conversationRoutes')
const messageRouter=require('./routes/messageRoutes')
const userModel = require('./model/userModel')
const io=require('socket.io')(8090,{
  cors:{
    origin:"http://localhost:3000",
  }
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
db()
app.use('/user',userRouter)
app.use('/conversation',conversationRouter)
app.use('/message',messageRouter)

let users=[]
io.on('connection',socket=>{
  
  socket.on('addUser',userID=>{
    
    const isUserExist=users.find(user=>user.userID===userID)
    if(!isUserExist){
      const user={userID,socketID:socket.id}
      users.push(user)
      io.emit('getUsers',users)
    }
  }) 
  socket.on('sendMessage',async({conversationID,recieverID,senderID,message})=>{
    const reciever=users.find((user)=>user.userID===recieverID)
    const sender=users.find((user)=>user.userID===senderID)
    const user=await userModel.findById(senderID)
    if(reciever){
      io.to(reciever.socketID).emit('getMessage',{
        senderID,
        message,
        recieverID,
        conversationID,
        user
      })
    }
    if (sender) {
      io.to(sender.socketID).emit('getMessage', {
        senderID,
        message,
        recieverID,
        conversationID,
        user: user // Include sender details in the emitted data
      });
    }
  })

  

  socket.on('disconnect',()=>{
    users=users.filter(user => user.socketID !== socket.id)
    io.emit('getUsers',users)
  })

})

app.get('/',(req,res)=>{
  res.send("Hello World")
})

const port=process.env.PORT
app.listen(port,()=>console.log('server connected at ',port))