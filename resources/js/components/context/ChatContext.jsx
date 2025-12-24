// components/context/ChatContext.js
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // ✅ Data dummy: percakapan awal
  const [conversations, setConversations] = useState([
    {
      id: "chat_1",
      participantType: "buyer",
      product: { 
        id: 1, 
        name: "Samsung S24 Ultra", 
        price: "10.800.000" 
      },
      sellerName: "Randitya Pratama",
      productId: 1,
      messages: [
        {
          id: 1001,
          text: "Apakah masih tersedia?",
          sender: "you",
          time: "10:30"
        },
        {
          id: 1002,
          text: "Halo! Ya, masih tersedia. Minat?",
          sender: "other",
          time: "10:32"
        }
      ],
      lastMessage: "Halo! Ya, masih tersedia. Minat?"
    },
    {
      id: "chat_2",
      participantType: "buyer",
      product: { 
        id: 2, 
        name: "iPhone 15 Pro", 
        price: "15.500.000" 
      },
      sellerName: "Siti Rahayu",
      productId: 2,
      messages: [
        {
          id: 2001,
          text: "Boleh nego?",
          sender: "you",
          time: "09:15"
        }
      ],
      lastMessage: "Boleh nego?"
    }
  ]);

  // ❌ Hapus localStorage

  const startChatAsBuyer = (productId, product, sellerName, message) => {
    const chatId = `chat_${Date.now()}`;
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "you",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const chat = {
      id: chatId,
      participantType: "buyer",
      product,
      sellerName,
      productId,
      messages: [newMessage],
      lastMessage: message,
    };

    setConversations(prev => [...prev, chat]);
    return chatId;
  };

  const receiveChatAsSeller = (productId, product, buyerName, message) => {
    const chatId = `chat_${Date.now()}_incoming`;
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "other",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const chat = {
      id: chatId,
      participantType: "seller",
      product,
      buyerName,
      productId,
      messages: [newMessage],
      lastMessage: message,
    };

    setConversations(prev => [...prev, chat]);
    return chatId;
  };

  return (
    <ChatContext.Provider value={{ 
      conversations, 
      startChatAsBuyer,
      receiveChatAsSeller 
    }}>
      {children}
    </ChatContext.Provider>
  );
};