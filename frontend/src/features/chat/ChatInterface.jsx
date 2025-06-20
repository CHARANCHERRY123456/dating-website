import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useMatchStore from '../../store/matchStore';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import socketService from '../../configs/socket';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatInterface = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { user } = useAuthStore();
  const { activeMatch, fetchActiveMatch } = useMatchStore();
  const { 
    messages, 
    fetchMessages, 
    sendMessage, 
    addMessage, 
    startTyping, 
    stopTyping,
    typingUsers,
    setUserTyping,
    isLoading 
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchActiveMatch();
  }, [fetchActiveMatch]);

  useEffect(() => {
    if (activeMatch) {
      fetchMessages(activeMatch.id);
      socketService.joinMatch(activeMatch.id);
    }
  }, [activeMatch, fetchMessages]);

  useEffect(() => {
    // Socket event listeners
    const handleNewMessage = (message) => {
      addMessage(message);
    };

    const handleUserTyping = ({ userId }) => {
      setUserTyping(userId, true);
      setTimeout(() => setUserTyping(userId, false), 3000);
    };

    const handleUserStoppedTyping = ({ userId }) => {
      setUserTyping(userId, false);
    };

    socketService.on('newMessage', handleNewMessage);
    socketService.on('userTyping', handleUserTyping);
    socketService.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socketService.off('newMessage', handleNewMessage);
      socketService.off('userTyping', handleUserTyping);
      socketService.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [addMessage, setUserTyping]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeMatch) return;
    console.log('[ChatInterface] Sending message', {
      matchId: activeMatch?.id,
      receiverId: activeMatch?.matchedUser?.id,
      content: messageInput.trim(),
    });
    sendMessage(activeMatch.id, activeMatch.matchedUser.id, messageInput.trim());
    setMessageInput('');
    handleStopTyping();
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    if (!isTyping && activeMatch) {
      setIsTyping(true);
      startTyping(activeMatch.id, activeMatch.matchedUser.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (isTyping && activeMatch) {
      setIsTyping(false);
      stopTyping(activeMatch.id, activeMatch.matchedUser.id);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  if (!activeMatch) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="card p-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Conversation</h3>
            <p className="text-gray-500 mb-4">You need an active match to start chatting.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="py-20" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="card overflow-hidden h-[calc(100vh-12rem)]">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img
                  src={activeMatch.matchedUser.avatar}
                  alt={activeMatch.matchedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{activeMatch.matchedUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {activeMatch.messageCount}/100 messages • {activeMatch.matchedUser.location}
                  </p>
                </div>
              </div>
              
              {activeMatch.videoCallUnlocked && (
                <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
                  📹 Video Call Available
                </button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500">Start your mindful conversation...</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === user.id}
                  avatar={message.senderId === user.id ? user.avatar : activeMatch.matchedUser.avatar}
                />
              ))
            )}
            
            {typingUsers.has(activeMatch.matchedUser.id) && (
              <TypingIndicator 
                avatar={activeMatch.matchedUser.avatar}
                name={activeMatch.matchedUser.name}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 input-field"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{messageInput.length}/500</span>
              {activeMatch.messageCount >= 100 && (
                <span className="text-green-600 font-medium">
                  🎉 Video call unlocked after 100 messages!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatInterface;