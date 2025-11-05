// src/components/ChatbotPopup.jsx

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
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4">
          <Chatbot closeChat={toggleChat} />
        </div>
      )}

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
  );
};

export default ChatbotPopup;