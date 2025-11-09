// src/components/ChatbotPopup.jsx - FIXED

import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { Button } from '@/components/ui/button';
import { BotMessageSquare, X } from 'lucide-react';

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* The Chatbot component is now rendered here. 
        It will control its own position (full-screen on mobile, popup on desktop).
      */}
      {isOpen && (
        <Chatbot closeChat={toggleChat} />
      )}

      {/* This div is ONLY for the trigger button */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
        <Button
            onClick={toggleChat}
            className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-primary-foreground" />
            ) : (
              <BotMessageSquare className="h-6 w-6 text-primary-foreground" />
            )}
          </Button>
      </div>
    </>
  );
};

export default ChatbotPopup;