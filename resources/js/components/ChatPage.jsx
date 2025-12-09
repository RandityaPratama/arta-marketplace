// src/pages/ChatPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "./Background";

export default function ChatPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("incoming");

  const conversations = [
    {
      id: 1,
      name: "Randitya Pratama",
      avatar: "R",
      lastMessage: "Halo, apakah barang ini masih tersedia?",
      time: "10:30",
      unread: 2,
      type: "incoming",
    },
    {
      id: 2,
      name: "Budi Santoso",
      avatar: "B",
      lastMessage: "Terima kasih, barang sudah saya terima.",
      time: "Kemarin",
      unread: 0,
      type: "outgoing",
    },
    {
      id: 3,
      name: "Dina Putri",
      avatar: "D",
      lastMessage: "Boleh nego harganya?",
      time: "2 hari lalu",
      unread: 0,
      type: "incoming",
    },
    {
      id: 4,
      name: "Toko Elektronik Jaya",
      avatar: "T",
      lastMessage: "Barang sudah dikirim via JNE",
      time: "Hari ini",
      unread: 1,
      type: "outgoing",
    },
  ];

  const incomingChats = conversations.filter(conv => conv.type === "incoming");
  const outgoingChats = conversations.filter(conv => conv.type === "outgoing");
  const currentChats = activeTab === "incoming" ? incomingChats : outgoingChats;

  const getAvatarBg = (type) => {
    return type === "incoming" ? "bg-[#DDE7FF]" : "bg-[#FED7AA]";
  };

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Pesan</h1>

          {/* ✅ Tab Header + Tombol Kembali dalam satu baris */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("incoming")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "incoming"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A] "
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

            {/* ✅ Tombol Kembali — sejajar dengan tab */}
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(-1)}
            >
              Kembali
            </Button>
          </div>

          {/* Daftar Chat */}
          {currentChats.length > 0 ? (
            <div className="space-y-4">
              {currentChats.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/chat/${conv.id}`)}
                >
                  <div className={`w-12 h-12 ${getAvatarBg(conv.type)} rounded-full flex items-center justify-center`}>
                    <span className="text-[#1E3A8A] font-bold">{conv.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.type === "incoming" ? "Pembeli" : "Penjual"}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada pesan di {activeTab === "incoming" ? "Pesan Masuk" : "Pesan Keluar"}.
            </div>
          )}
        </div>
      </Background>
      <Footer />
    </>
  );
}