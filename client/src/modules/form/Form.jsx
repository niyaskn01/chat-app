
import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../axios/axios'

function Form({
  isSignInPage=false
}) {

  const [dataInfo,setDataInfo]=useState({
    ...(!isSignInPage && { name:''}),
    email:'', password:''
  })
  const navigate=useNavigate()

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      const {data}=await axiosInstance.post(`/user/${isSignInPage ? 'login':'register'}`,dataInfo)
      if(data?.token){
        localStorage.setItem('user:token', data.token)
        localStorage.setItem('user:details', JSON.stringify(data.user))
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='bg-white w-[350px] 
    h-[500px] shadow-lg rounded-lg
    flex items-center justify-center 
    flex-col'>
      <div className='text-4xl font-bold'>welcome {isSignInPage && 'back'}</div>
      <div className='text-xl font-light mb-14'>{isSignInPage ? 'sign in to get explored' : 'sign up now to get started'}</div>
      <form onSubmit={handleSubmit}>
      {
        !isSignInPage && 
        <Input className='mb-4'
        value={dataInfo.name}
        onChange={(e)=>setDataInfo({...dataInfo,name:e.target.value})}
       label='Username' name='name' placeholder='enter user full name' />
      }
      
      <Input className='mb-4'
      value={dataInfo.email}
      onChange={(e)=>setDataInfo({...dataInfo,email:e.target.value})}
       label='Email' type='email' name='email' placeholder='enter user full email' />
      <Input className='mb-4'
      value={dataInfo.password}
      onChange={(e)=>setDataInfo({...dataInfo,password:e.target.value})}
       label='Password' type='password' name='password' placeholder='enter user password' />
      <Button type='submit' className='mb-4' label={isSignInPage ?'sign in':'sign up'} />
      </form>
      <div onClick={()=>navigate(`${isSignInPage ? '/register':'/login'}`)}
      className='cursor-pointer'>
        {
          isSignInPage ?
          'Dont have an accout ?' : 'Already have an account ?'
        }
         <span className=" text-primary cursor-pointer underline">
          {isSignInPage ? 'Sign Up':'Sign In'}
        </span>
      </div>
    </div>
  )
}

export default Form