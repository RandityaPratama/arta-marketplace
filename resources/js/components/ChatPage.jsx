// src/pages/ChatPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "./Background";
import { useChat } from "../components/context/ChatContext";

export default function ChatPage() {
  const navigate = useNavigate();
  const { conversations } = useChat();
  const [activeTab, setActiveTab] = useState("incoming");

  // ✅ "Pesan Pembeli" = chat di mana Anda adalah PENJUAL
  const incomingChats = conversations.filter(c => c.participantType === "seller");
  
  // ✅ "Pesan Penjual" = chat di mana Anda adalah PEMBELI
  const outgoingChats = conversations.filter(c => c.participantType === "buyer");

  const currentChats = activeTab === "incoming" ? incomingChats : outgoingChats;

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
              {currentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/chatroom/${chat.id}`)}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">Foto</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {activeTab === "incoming" 
                          ? `${chat.buyerName} • ${chat.product.name}`
                          : `${chat.sellerName} • ${chat.product.name}`}
                      </h3>
                      <span className="text-xs text-gray-500">Sekarang</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activeTab === "incoming" 
                        ? `Pembeli • ${chat.product.location}`
                        : `Penjual • ${chat.product.location}`}
                    </p>
                  </div>
                </div>
              ))}
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