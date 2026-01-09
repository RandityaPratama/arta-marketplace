// components/ChatRoom.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "./Background";
import { useChat } from "../components/context/ChatContext";

export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  // ✅ Ambil fungsi API dan loading state dari Context
  const { 
    conversations, 
    loading, 
    messagesLoading, 
    sendMessage, 
    loadMessages, 
    markAsRead, 
    fetchConversations,
    setActiveConversation // ✅ Untuk real-time subscription
  } = useChat();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef(null);
  const hasMarkedAsRead = useRef(false); // ✅ Track apakah sudah mark as read

  // ✅ Gunakan loose equality (==) karena id dari URL string, dari API integer
  const chat = conversations.find(c => c.id == id);
  const isMessagesLoading = messagesLoading[id] || false;

  // ✅ FIX: Load conversations dulu jika belum ada data (untuk handle refresh)
  useEffect(() => {
    if (conversations.length === 0 && !loading && isInitialLoad) {
      fetchConversations(false);
    }
  }, [conversations.length, loading, isInitialLoad, fetchConversations]);

  // ✅ Load pesan dari API saat masuk room atau setelah conversations ter-load
  useEffect(() => {
    if (id && conversations.length > 0 && !hasMarkedAsRead.current) {
      const conversation = conversations.find(c => c.id == id);
      
      // Load messages jika conversation ada dan messages masih kosong
      if (conversation && (!conversation.messages || conversation.messages.length === 0)) {
        loadMessages(id);
        markAsRead(id);
        hasMarkedAsRead.current = true; // ✅ Set flag
        setIsInitialLoad(false);
      } else if (conversation && conversation.messages && conversation.messages.length > 0) {
        // Jika sudah ada messages, mark as read saja
        markAsRead(id);
        hasMarkedAsRead.current = true; // ✅ Set flag
        setIsInitialLoad(false);
      }
    }
  }, [id, conversations.length, loadMessages, markAsRead]); // ✅ Gunakan conversations.length, bukan conversations

  // ✅ Subscribe ke real-time updates saat masuk chat room
  useEffect(() => {
    if (id) {
      console.log(`🔔 Setting active conversation: ${id}`);
      setActiveConversation(id);
      hasMarkedAsRead.current = false; // ✅ Reset flag saat ganti conversation
    }

    // Cleanup: unsubscribe saat keluar dari chat room
    return () => {
      console.log('🔕 Leaving chat room, unsubscribing...');
      setActiveConversation(null);
      hasMarkedAsRead.current = false; // ✅ Reset flag
    };
  }, [id, setActiveConversation]);

  // ✅ FIX: Navigasi ke /chat jika conversation tidak ditemukan setelah loading selesai
  useEffect(() => {
    if (!loading && !isMessagesLoading && conversations.length > 0 && !chat && !isInitialLoad) {
      navigate("/chat");
    }
  }, [chat, loading, isMessagesLoading, conversations, navigate, isInitialLoad]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(id, messageText);
      setMessageText("");
    } catch (error) {
      console.error("Gagal mengirim pesan", error);
    } finally {
      setIsSending(false);
    }
  };

  // ✅ Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chat?.messages && chat.messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages?.length]); // ✅ Dependency: length of messages

  // ✅ Tampilkan Loading jika data belum siap
  if ((loading || isMessagesLoading || isInitialLoad) && !chat) {
    return (
      <>
        <NavbarAfter />
        <Background>
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
            <p className="ml-3 text-gray-600">Memuat percakapan...</p>
          </div>
        </Background>
        <Footer />
      </>
    );
  }

  // ✅ Jika setelah loading selesai masih tidak ada chat, redirect
  if (!loading && !isMessagesLoading && !isInitialLoad && !chat) {
    return null;
  }

  // ✅ Jika chat ada tapi messages belum ter-load, tampilkan loading di dalam chat
  if (chat && (!chat.messages || chat.messages.length === 0) && isMessagesLoading) {
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
                  <h2 className="font-semibold text-gray-800">
                    {chat.participantType === "seller" ? chat.buyerName : chat.sellerName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {chat.participantType === "seller" ? "Pembeli" : "Penjual"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
              <p className="ml-3 text-gray-600">Memuat pesan...</p>
            </div>
          </div>
        </Background>
        <Footer />
      </>
    );
  }

  if (!chat) return null;

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
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                    {chat.product.images && chat.product.images.length > 0 && (
                      <img src={chat.product.images[0]} alt={chat.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
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
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Tulis pesan..."
              disabled={isSending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#162e68] transition"
            >
              {isSending ? "..." : "Kirim"}
            </button>
          </div>
        </div>
      </Background>
      <Footer />
    </>
  );
}