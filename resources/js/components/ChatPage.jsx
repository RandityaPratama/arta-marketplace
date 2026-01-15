// components/ChatPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "./Background";
import { useChat } from "../components/context/ChatContext";

export default function ChatPage() {
  const navigate = useNavigate();
  const { 
    conversations, 
    fetchConversations, 
    loading,
    subscribeToAllConversations,
    unsubscribeFromAllConversations
  } = useChat();
  const [activeTab, setActiveTab] = useState("incoming");

  // ✅ Fetch data terbaru saat halaman dibuka
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ✅ Subscribe ke semua conversations untuk real-time updates
  useEffect(() => {
    if (conversations.length > 0) {
      console.log('📡 ChatPage: Subscribing to all conversations');
      subscribeToAllConversations();
    }

    // Cleanup: unsubscribe saat keluar dari ChatPage
    return () => {
      console.log('📡 ChatPage: Unsubscribing from all conversations');
      unsubscribeFromAllConversations();
    };
  }, [conversations.length, subscribeToAllConversations, unsubscribeFromAllConversations]);

  // ✅ "Pesan Pembeli" = chat di mana Anda adalah PENJUAL
  const incomingChats = conversations.filter(c => c.participantType === "seller");
  
  // ✅ "Pesan Penjual" = chat di mana Anda adalah PEMBELI
  const outgoingChats = conversations.filter(c => c.participantType === "buyer");

  const currentChats = activeTab === "incoming" ? incomingChats : outgoingChats;

  // ✅ Helper untuk memformat waktu (Time Ago)
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400 && date.getDate() === now.getDate()) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 172800) return "Kemarin";
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  if (loading && conversations.length === 0) {
    return (
      <>
        <NavbarAfter />
        <Background>
          <div className="flex items-center justify-center h-screen text-gray-500">Memuat pesan...</div>
        </Background>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Pesan</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("incoming")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "incoming"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Pesan Pembeli
              </button>
              <button
                onClick={() => setActiveTab("outgoing")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "outgoing"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Pesan Penjual
              </button>
            </div>

            <Button variant="primary" size="md" onClick={() => navigate(-1)}>
              Kembali
            </Button>
          </div>

          {currentChats.length > 0 ? (
            <div className="space-y-4">
              {currentChats.map((chat) => {
                const participantName = activeTab === "incoming" ? chat.buyerName : chat.sellerName;
                const participantRole = activeTab === "incoming" ? "Pembeli" : "Penjual";
                
                return (
                  <div
                    key={`chat-${chat.id}-${chat.lastMessageAt || chat.createdAt}`}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/chatroom/${chat.id}`)}
                  >
                    {/* Avatar Participant */}
                    <div className="w-12 h-12 bg-[#DDE7FF] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {chat.participantAvatar ? (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${chat.participantAvatar}`} 
                          alt={participantName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#1E3A8A] font-bold text-lg">
                          {participantName?.charAt(0).toUpperCase() || 'P'}
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                      {chat.product.images && chat.product.images.length > 0 ? (
                        <img src={chat.product.images[0]} alt={chat.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-500">Foto</span>
                      )}
                    </div>
                    
                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {participantName} • {chat.product.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {participantRole} • {chat.product.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {activeTab === "incoming" 
                ? "Belum ada pembeli yang menghubungi Anda." 
                : "Belum ada percakapan dengan penjual."}
            </div>
          )}
        </div>
      </Background>
      <Footer />
    </>
  );
}