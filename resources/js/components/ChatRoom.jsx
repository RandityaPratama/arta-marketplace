import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "./Background"


export default function ChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Simulasi data lawan bicara
  const otherUser = {
    name: "Randitya Pratama",
    avatar: "R",
    isSeller: false, // false = pembeli, true = penjual
  };

  // Simulasi pesan awal
  useEffect(() => {
    setMessages([
      { id: 1, text: "Halo, apakah barang ini masih tersedia?", sender: "other", time: "10:30" },
      { id: 2, text: "Halo! Ya masih tersedia. Minat?", sender: "me", time: "10:32" },
    ]);
  }, []);

  // Auto-scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulasi balasan otomatis (opsional)
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        text: "Terima kasih! Saya akan segera menghubungi Anda.",
        sender: "other",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 w-full">
          {/* Header Chat */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/chat")}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                <span className="text-[#1E3A8A] font-bold">{otherUser.avatar}</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{otherUser.name}</h2>
                <p className="text-xs text-gray-500">
                  {otherUser.isSeller ? "Penjual" : "Pembeli"}
                </p>
              </div>
            </div>
          </div>

          {/* Area Chat */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "me"
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-blue-100" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Pesan */}
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