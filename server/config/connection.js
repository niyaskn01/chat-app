const mongoose=require('mongoose')
require('dotenv').config()
const mongoURl=process.env.MONGO_URL
const connect=()=>{
  try {
    mongoose.connect(mongoURl)
    console.log('connected with db');
  } catch (error) {
    console.log('error in connection with db');
  }
}

module.exports=connect