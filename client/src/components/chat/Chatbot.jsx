// src/components/Chatbot.jsx

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send } from 'lucide-react';

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex items-end mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

const Chatbot = ({ closeChat, courseContext }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you with the SDGs today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommended, setRecommended] = useState([
    "What is an SDG?", "Summarize SDG 1", "Why are the goals important?"
  ]);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const sendMessage = async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    const newUserMessage = { text: messageText, isUser: true };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setRecommended([]);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("Authentication token not found.");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        {
          message: messageText,
          courseContext: courseContext || 'General Topics'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const { message: aiMessage, recommendedQuestions } = res.data;
      const aiResponse = { text: aiMessage, isUser: false };
      
      setMessages(prev => [...prev, aiResponse]);
      if (recommendedQuestions && Array.isArray(recommendedQuestions)) {
        setRecommended(recommendedQuestions);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = { text: "I'm having trouble connecting right now. Please try again in a moment.", isUser: false };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSend = () => sendMessage(input);
  const handleRecommendedClick = (question) => sendMessage(question);

  return (
    <div className="flex flex-col h-screen w-screen bg-card md:h-[500px] md:w-[380px] md:border md:rounded-lg md:shadow-xl">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg text-foreground">SustainED AI Tutor</h3>
        <Button variant="ghost" size="icon" onClick={closeChat}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && <ChatMessage message="..." isUser={false} />}
      </ScrollArea>

      <div className="p-4 border-t">
        {recommended.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
              {recommended.map((q, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1" onClick={() => handleRecommendedClick(q)}>
                  {q}
                </Button>
              ))}
            </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

Chatbot.defaultProps = {
  courseContext: 'General SDG Topics'
};

export default Chatbot;