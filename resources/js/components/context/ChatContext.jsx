// components/context/ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Import Echo untuk real-time
let Echo = null;
if (typeof window !== 'undefined' && window.Echo) {
  Echo = window.Echo;
}

// ✅ Gunakan path gambar yang sama dengan  ProductContext
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '') + '/product-images';

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
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const { isAuthenticated } = useAuth();
  const channelRef = useRef(null);

  const getToken = () => localStorage.getItem('token');

  // ✅ Fetch daftar percakapan dari API
  const fetchConversations = useCallback(async (preserveMessages = false) => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        // ✅ FIX: Gunakan setConversations dengan callback untuk akses state terbaru
        setConversations(prevConversations => {
          // Mapping data API (snake_case) ke format Frontend (camelCase)
          const mappedData = result.data.map(c => {
            // ✅ Proses URL gambar agar lengkap
            let productImages = c.product.images || [];
            if (!Array.isArray(productImages)) productImages = [];
            
            const processedProduct = {
              ...c.product,
              images: productImages.map(path => `${STORAGE_URL}/${path}`)
            };

            // ✅ FIX: Preserve existing messages jika ada
            const existingConv = prevConversations.find(conv => conv.id === c.id);
            const existingMessages = existingConv?.messages || [];

            return {
              id: c.id,
              participantType: c.participant_type,
              product: processedProduct,
              buyerName: c.participant_type === 'seller' ? c.other_participant.name : 'You',
              sellerName: c.participant_type === 'buyer' ? c.other_participant.name : 'You',
              otherParticipant: c.other_participant,
              lastMessage: c.last_message,
              lastMessageAt: c.last_message_at,
              unreadCount: c.unread_count,
              createdAt: c.created_at,
              messages: preserveMessages && existingMessages.length > 0 ? existingMessages : []
            };
          });
          return mappedData;
        });
      }
    } catch (error) {
      console.error("Gagal mengambil percakapan:", error);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ FIX: Empty dependency array - tidak bergantung pada conversations

  // Load saat login
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations(false);
    } else {
      setConversations([]);
    }
  }, [isAuthenticated, fetchConversations]);

  // ✅ Mulai chat baru (Hubungi Penjual)
  const startChatAsBuyer = async (productId) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ product_id: productId })
      });
      const result = await response.json();

      if (result.success) {
        await fetchConversations(); // Refresh list
        return result.data.id;
      } else {
        throw new Error(result.message || "Gagal memulai chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error;
    }
  };

  // ✅ Ambil pesan untuk chat room tertentu
  const loadMessages = useCallback(async (conversationId) => {
    const token = getToken();
    
    // Set loading state untuk conversation ini
    setMessagesLoading(prev => ({ ...prev, [conversationId]: true }));
    
    try {
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        const mappedMessages = result.data.map(m => ({
          id: m.id,
          text: m.message,
          sender: m.is_own ? "you" : "other",
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: m.is_read,
          createdAt: m.created_at
        }));

        // ✅ FIX: Update state conversations dengan pesan yang baru diambil
        setConversations(prev => {
          const updated = prev.map(c => 
            c.id == conversationId
              ? { ...c, messages: mappedMessages } 
              : c
          );
          
          // ✅ Jika conversation belum ada di list, fetch ulang conversations
          const convExists = prev.some(c => c.id == conversationId);
          if (!convExists) {
            // Trigger fetch conversations di background dengan preserve messages
            fetchConversations(true);
          }
          
          return updated;
        });
        
        return mappedMessages;
      }
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
      return [];
    } finally {
      setMessagesLoading(prev => ({ ...prev, [conversationId]: false }));
    }
  }, [fetchConversations]); // ✅ Dependency hanya fetchConversations

  // ✅ Kirim pesan
  const sendMessage = useCallback(async (conversationId, messageText) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
      });
      const result = await response.json();

      if (result.success) {
        const newMessage = {
          id: result.data.id,
          text: result.data.message,
          sender: "you",
          time: new Date(result.data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: result.data.created_at
        };

        // ✅ FIX: Update state lokal langsung agar UI responsif
        setConversations(prev => {
          const updated = prev.map(c => {
            if (c.id == conversationId) {
              console.log('✅ Updating conversation after sendMessage:', {
                id: c.id,
                oldLastMessage: c.lastMessage,
                newLastMessage: messageText
              });
              return {
                ...c,
                lastMessage: messageText,
                lastMessageAt: new Date().toISOString(),
                messages: [...(c.messages || []), newMessage]
              };
            }
            return c;
          });
          return updated;
        });

        return newMessage;
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      throw error;
    }
  }, []);

  // ✅ Tandai sudah dibaca
  const markAsRead = useCallback(async (conversationId) => {
    const token = getToken();
    try {
      await fetch(`${API_URL}/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      setConversations(prev => prev.map(c => 
        c.id == conversationId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  }, []);

  // ✅ Subscribe ke SEMUA conversations untuk update lastMessage di ChatPage
  const subscribeToAllConversations = useCallback(() => {
    if (!Echo || conversations.length === 0) {
      return;
    }

    console.log(`🔔 Subscribing to ${conversations.length} conversations for ChatPage`);

    conversations.forEach(conv => {
      const channel = Echo.private(`conversation.${conv.id}`);
      
      // Listen untuk pesan baru - Update lastMessage saja (tidak perlu messages array)
      channel.listen('.message.sent', (event) => {
        console.log(`📨 [ChatPage] New message in conversation ${conv.id}:`, event);
        
        setConversations(prev => {
          return prev.map(c => {
            if (c.id == event.conversation.id) {
              return {
                ...c,
                lastMessage: event.message.message,
                lastMessageAt: event.message.created_at
              };
            }
            return c;
          });
        });
      });
    });
  }, [conversations]);

  // ✅ Unsubscribe dari semua conversations
  const unsubscribeFromAllConversations = useCallback(() => {
    if (!Echo || conversations.length === 0) {
      return;
    }

    console.log(`🔕 Unsubscribing from ${conversations.length} conversations`);
    
    conversations.forEach(conv => {
      Echo.leave(`conversation.${conv.id}`);
    });
  }, [conversations]);

  // ✅ Subscribe ke conversation channel untuk real-time updates (ChatRoom)
  const subscribeToConversation = useCallback((conversationId) => {
    if (!Echo || !conversationId) {
      console.warn('Echo not available or no conversation ID');
      return;
    }

    // Unsubscribe dari channel sebelumnya jika ada
    if (channelRef.current) {
      Echo.leave(`conversation.${channelRef.current}`);
      channelRef.current = null;
    }

    console.log(`🔔 Subscribing to conversation.${conversationId}`);
    
    const channel = Echo.private(`conversation.${conversationId}`);
    channelRef.current = conversationId;

    // Listen untuk pesan baru
    channel.listen('.message.sent', (event) => {
      console.log('📨 New message received:', event);
      
      const newMessage = {
        id: event.message.id,
        text: event.message.message,
        sender: event.message.sender_id === JSON.parse(localStorage.getItem('user'))?.id ? "you" : "other",
        time: new Date(event.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: event.message.is_read,
        createdAt: event.message.created_at
      };

      // Update messages di conversation yang aktif
      setConversations(prev => {
        return prev.map(c => {
          if (c.id == conversationId) {
            // Cek apakah pesan sudah ada (untuk menghindari duplikasi)
            const messageExists = c.messages?.some(m => m.id === newMessage.id);
            if (messageExists) {
              return c;
            }
            
            return {
              ...c,
              lastMessage: event.message.message,
              lastMessageAt: event.message.created_at,
              messages: [...(c.messages || []), newMessage]
            };
          }
          // ✅ Update lastMessage untuk conversation lain juga (untuk ChatPage)
          if (c.id == event.conversation.id) {
            return {
              ...c,
              lastMessage: event.message.message,
              lastMessageAt: event.message.created_at
            };
          }
          return c;
        });
      });
    });

    // Listen untuk pesan yang diupdate
    channel.listen('.message.updated', (event) => {
      console.log('✏️ Message updated:', event);
      
      setConversations(prev => {
        return prev.map(c => {
          if (c.id == conversationId) {
            return {
              ...c,
              messages: (c.messages || []).map(msg => 
                msg.id === event.message.id 
                  ? { ...msg, text: event.message.message, isEdited: true }
                  : msg
              )
            };
          }
          return c;
        });
      });
    });

    // Listen untuk pesan yang dihapus
    channel.listen('.message.deleted', (event) => {
      console.log('🗑️ Message deleted:', event);
      
      setConversations(prev => {
        return prev.map(c => {
          if (c.id == conversationId) {
            return {
              ...c,
              messages: (c.messages || []).filter(msg => msg.id !== event.message_id)
            };
          }
          return c;
        });
      });
    });

    return () => {
      if (Echo && conversationId) {
        Echo.leave(`conversation.${conversationId}`);
      }
    };
  }, []);

  // ✅ Unsubscribe dari conversation channel
  const unsubscribeFromConversation = useCallback(() => {
    if (Echo && channelRef.current) {
      console.log(`🔕 Unsubscribing from conversation.${channelRef.current}`);
      Echo.leave(`conversation.${channelRef.current}`);
      channelRef.current = null;
    }
  }, []);

  // ✅ Set active conversation untuk real-time
  const setActiveConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);
    if (conversationId) {
      subscribeToConversation(conversationId);
    } else {
      unsubscribeFromConversation();
    }
  }, [subscribeToConversation, unsubscribeFromConversation]);

  // ✅ Cleanup saat unmount
  useEffect(() => {
    return () => {
      unsubscribeFromConversation();
    };
  }, [unsubscribeFromConversation]);

  return (
    <ChatContext.Provider value={{ 
      conversations, 
      loading,
      messagesLoading,
      fetchConversations,
      startChatAsBuyer,
      loadMessages,
      sendMessage,
      markAsRead,
      setActiveConversation, // Untuk subscribe/unsubscribe (ChatRoom)
      activeConversationId,
      subscribeToAllConversations, // Untuk ChatPage
      unsubscribeFromAllConversations // Untuk ChatPage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
