const userModel=require('../model/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

//register
const userRegisterController=async(req,res)=>{
  const {name,email,password}=req.body
  if(!name || !email || !password){
    return res.status(400).send({message:'all fields required'})
  }
  try {
    const existingUser=await userModel.findOne({email})
    if(existingUser){ 
      return res.status(400).send({
        message:'user already exisist,please login'
      })
    }
    //create and save the new user
    const user= new userModel({name,email})
    const hashedPassword=await bcrypt.hash(password,10)
    user.password=hashedPassword

    await user.save()
    res.status(200).send({success:true,message:"user created"})

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:'error in register'
    })
  }
}

//user login
const userLoginController=async(req,res)=>{
  const{email,password}=req.body;
  let token
  if (!email||!password) {
    return res.status(400).json({message: "Please enter email and password"});
    }
    try {
      const user=await userModel.findOne({email})
      if(!user){
        return res.status(400).send({message:'invalid email'})
      }
      const validPassword=await bcrypt.compare(password,user.password)
      if(!validPassword) return res.status(400).send({message:'invalid password'})

      const payload={
        userID:user._id,
        email:user.email
      }
      const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY || 'secret'

      const signToken = () =>
      new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, (err, generateToken) => {
          if (err) reject(err);
          resolve(generateToken);
        });
      });

    // Use async/await to wait for the token
    token = await signToken();
      
     
      res.status(200).send(await {
        success:true,
        message:'successfully logged in',
         user:{
          name:user.name,
          email:user.email,
          _id:user._id
        },
        token:token
      })
    } catch (error) {
      console.log(error);
    res.status(500).send({
      success:false,
      message:'error in login'
    })
    }
}

//get all users
const getAllUsersController=async(req,res)=>{
  try{
    const users=await userModel.find()
    const userData=users.map((user)=>{
      return {
        user:{name:user.name,_id:user._id,
        email:user.email}
      }
    })
    res.status(200).json(userData)
  }catch(err){
    console.log('error :',err);
  }
  
}

module.exports={
  userRegisterController,
  userLoginController,
  getAllUsersController
}