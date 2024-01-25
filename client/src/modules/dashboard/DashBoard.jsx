import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../../assets/images.png'
import Input from '../../components/Input'
import axiosInstance from '../../axios/axios'
import {io} from 'socket.io-client'

function DashBoard() {
  const dummy=useRef()
  const [socket,setSocket]=useState(null)
  const [user]=useState(JSON.parse(localStorage.getItem('user:details')))
  const [conversation,setConversation]=useState([])
  const [convoID,setConvoID]=useState('')
  const [messages,setMessages]=useState([])
  const [reciever,setReciever]=useState('')
  const [message,setMessage]=useState('')
  const [users,setUsers]=useState([])

  useEffect(()=>{
    setSocket(io('http://localhost:8090'))
  },[])
  useEffect(()=>{
    console.log(messages);
      socket?.emit('addUser', user?._id);
      socket?.on('getUsers', (receivedUsers) => {
        console.log('User List', receivedUsers);
      });

      socket?.on('getMessage',data=>{
        setMessages(prev => [...prev, { user: { _id: data.user._id, name: data.user.name, email: data.user.email }, message: data.message }]);

      })

  },[socket])

  const getMessages=async(e,conversationID,user)=>{
    e.preventDefault()

    const existingReciver=conversation.find((item)=>item.user._id===user._id)
    // console.log(existingReciver);
    if(existingReciver) {
      conversationID=existingReciver.conversationID
    }
        
    setReciever(user)
    setConvoID(conversationID)
    try {
      const {data}=await axiosInstance(`/message/message/${conversationID}`)
      setMessages(data)
      console.log(messages,'myre');
    } catch (error) {
      console.log(error);
    }
   
  }
  useEffect(()=>{
    dummy?.current?.scrollIntoView({behaviour:'smooth'});
  },[message,messages, reciever])

  //sent message
  const handleSentMessage=async(e)=>{
    e.preventDefault()
    socket.emit('sendMessage',{
      conversationID:convoID,
        senderID:user._id,
        recieverID:reciever._id,
        message
    })
    try {
      const {data}=await axiosInstance.post('/message/message',{
        conversationID:convoID,
        senderID:user._id,
        recieverID:reciever._id,
        message
      })
      if (data.success) {
        setMessage('');
        
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    const getConversations=async()=>{
      const {data}=await axiosInstance(`/conversation/get-conversation/${user._id}`)
      setConversation(data)
    }
    getConversations()
  },[user,conversation])

  useEffect(()=>{
    const getUsers=async()=>{
      try {
        const {data}=await axiosInstance("/user/all-users")
        setUsers(data)
      } catch (error) {
        console.log(error);
      }
    }
    getUsers()
  },[users])
  return (
    <div className='w-screen flex'>
      <div className='w-[25%] h-screen  bg-secondary'>
        <div className='flex items-center justify-center'>
          <div className='border border-primary rounded-full p-2'>
            <img src={Avatar} height={40} width={40} alt="" />
          </div>
          <div className='ml-4'>
            <h3 className='text-2xl'>{user.name}</h3>
            <p className='text-lg font-light'>profile details</p>
          </div>
        </div>
        <hr />
        <div className='ml-10 mt-6 mr-10'>
          <div className='text-primary text-lg' >Messages</div>
          <div className=' mt-5'>
          {
            conversation.length > 0 ?
            conversation.map(({user,conversationID})=>(
              <div key={user._id}>
              <div  onClick={(e)=>{getMessages(e,conversationID,user)}}
              className='flex items-center mt-4' >
                <div>
                  <img src={Avatar} height={35} width={35} alt="" />
                </div>
                <div className='ml-4'>
                  <h5 className='text-xl'>{user.name}</h5>
                  <p className='text-sm font-light'>{user.email}</p>
                </div>
              </div>
              <hr />
              </div>
            )) :
            <div className='text-center text-lg font-semibold'>
              No Conversations Yet!
            </div>
            
          }
          </div>
        </div>
      </div>
      <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
        
        {
          
          reciever._id &&
          <div className='w-[75%] bg-secondary h-[80px] my-3 rounded-full shadow-md flex items-center px-14 py-2'>
						<div className='cursor-pointer'><img src={Avatar} width={60} height={60} className="rounded-full" alt='' /></div>
						<div className='ml-6 mr-auto'>
							<h3 className='text-lg'>{reciever.name}</h3>
							<p className='text-sm font-light text-gray-600'>online</p>
						</div>
						<div className='cursor-pointer'>
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
								<line x1="15" y1="9" x2="20" y2="4" />
								<polyline points="16 4 20 4 20 8" />
							</svg>
						</div>
					</div>
        }
      
          <div className='h-[75%] w-full overflow-scroll'
            style={{ overflow: 'auto' }}          >
					<div className='py-14 px-10 h-[100px]'>
            {
              messages.length > 0 && reciever._id ?
              messages.map(({message,user:{_id}={}},ind)=>{
                return (
                <div key={ind}>
                {
                  _id !== user._id ? (
                    <div className='p-2 mb-3 max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl'>
                      {message}
                    </div>
                  ) : (
                    <div className='p-2 mb-3 text-white max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto'>
                      {message}
                    </div>
                  )
                }
                <span ref={dummy}></span>
                </div>)
               }):
              <div className='text-center center-lg mt-24 font-semibold'>
                start a new chat
              </div>
            } 
           
					</div>
				</div>
        {
          reciever?._id &&
          <div className="p-10 w-full flex items-center">
            <Input value={message}
             onChange={(e)=>setMessage(e.target.value)}
             className='w-[75%]' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none'
             placeholder='type something...'/>
             <div className={`ml-4 p-2 cursor-pointer ${!message && 'pointer-events-none'}  bg-light rounded-full`}
             onClick={(e)=>handleSentMessage(e)}>
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<line x1="10" y1="14" x2="21" y2="3" />
								<path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
							</svg>
						</div>
            <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full  `}>
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<circle cx="12" cy="12" r="9" />
								<line x1="9" y1="12" x2="15" y2="12" />
								<line x1="12" y1="9" x2="12" y2="15" />
							</svg>
						</div>
          </div>
        }
      
      </div>
      <div className='w-[25%] h-screen bg-secondary overflow-y-scroll px-8 py-10'>
        <div className="text-primary text-lg">
          {
            users.map((user)=>(
              <div key={user.user._id} onClick={(e)=>getMessages(e,'new',user.user)}
              className='flex items-center py-3 border-b border-b-gray-300'>
										<div className='cursor-pointer flex items-center'>
											<div><img src={Avatar} className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" alt='' /></div>
											<div className='ml-6'>
												<h3 className='text-lg font-semibold'>{user?.user?.name}</h3>
												<p className='text-sm font-light text-gray-600'>{user?.user?.email}</p>
											</div>
										</div>
									</div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DashBoard