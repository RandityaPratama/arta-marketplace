// src/pages/ChatRoom.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "./Background";
import { useChat } from "../components/context/ChatContext";

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { conversations } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const chat = conversations.find(c => c.id === id);
  if (!chat) {
    navigate("/chat");
    return null;
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const messageObj = {
      id: Date.now(),
      text: newMessage,
      sender: "you", // Selalu "you" saat Anda mengirim
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedConversations = conversations.map(c => 
      c.id === id 
        ? { ...c, messages: [...c.messages, messageObj], lastMessage: newMessage }
        : c
    );
    
    localStorage.setItem("chat_conversations", JSON.stringify(updatedConversations));
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Tentukan nama lawan bicara
  const otherName = chat.participantType === "seller" 
    ? chat.buyerName  // Anda penjual → lawan = pembeli
    : chat.sellerName; // Anda pembeli → lawan = penjual

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 w-full">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate("/chat")} className="p-2 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                <span className="text-[#1E3A8A] font-bold">P</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{otherName}</h2>
                <p className="text-xs text-gray-500">
                  {chat.participantType === "seller" ? "Pembeli" : "Penjual"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 h-[500px] overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{chat.product.name}</h4>
                    <p className="text-sm text-gray-600">Rp. {chat.product.price}</p>
                  </div>
                </div>
              </div>

              {chat.messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "you"
                        ? "bg-[#1E3A8A] text-white"    // KANAN
                        : "bg-white border border-gray-200 text-gray-800" // KIRI
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "you" ? "text-blue-100" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Tulis pesan..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#162e68] transition"
            >
              Kirim
            </button>
          </div>
        </div>
      </Background>
      <Footer />
    </>
  );
}