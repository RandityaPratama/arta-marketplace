// src/context/ChatContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("chat_conversations");
    if (saved) {
      setConversations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_conversations", JSON.stringify(conversations));
  }, [conversations]);

  // ✅ Buat chat sebagai PEMBELI ke penjual
  const startChatAsBuyer = (productId, product, sellerName, message) => {
    const chatId = `chat_${Date.now()}`;
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "you", // Anda = pembeli
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const chat = {
      id: chatId,
      participantType: "buyer", // Anda adalah pembeli
      product,
      sellerName,
      productId,
      messages: [newMessage],
      lastMessage: message,
    };

    setConversations(prev => [...prev, chat]);
    return chatId;
  };

  // ✅ Terima chat sebagai PENJUAL dari pembeli
  const receiveChatAsSeller = (productId, product, buyerName, message) => {
    const chatId = `chat_${Date.now()}_incoming`;
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "other", // Pembeli = orang lain
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const chat = {
      id: chatId,
      participantType: "seller", // Anda adalah penjual
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