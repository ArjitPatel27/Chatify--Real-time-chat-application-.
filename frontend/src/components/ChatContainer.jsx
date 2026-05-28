import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {

  const { messages, getMessages, isMessageLoading, selectedUser, subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const { authUser } = useAuthStore();

  // for scrolling the message that comes immediatley on the chat screen
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();
    return () => unsubscribeFromMessages();

  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


  // for smooth scrolling of messages on the chat screen
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //for message loading time , show the message skeleton
  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }



  // we will use daisy ui for chat-start and chat-end
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message._id} //means if we are the user of chat then chat start with right side and for the other user messages, the chat will be on left side
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* for showing the small circled image during the chats */}
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : //if it don't have any image then go for the avatar image 
                  selectedUser.profilePic || "/avatar.png"}
                  alt='profile_pic' />

              </div>

            </div>
            <div className="chat-header mb-1">
              {/* the current time */}
              {/* for formatting the message you can use formatMessageTime from libs utils*/}
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* message or text in that chat bubble that is sending to the user */}
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img src={message.image} alt='Attachement'
                  className='sm:max-w-[200px] rounded-md mb-2' />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}

      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer
