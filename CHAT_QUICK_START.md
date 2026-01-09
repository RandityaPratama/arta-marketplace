# 🚀 Chat Feature - Quick Start Guide

## ⚡ Langkah Cepat (5 Menit)

### 1️⃣ Verifikasi Database
```bash
# Cek apakah migrations sudah jalan
php artisan migrate:status

# Jika belum, jalankan:
php artisan migrate
```

✅ **Status:** Migrations sudah berhasil dijalankan!

---

### 2️⃣ Start Laravel Server
```bash
php artisan serve
```

Server akan berjalan di: `http://localhost:8000`

---

### 3️⃣ Test API dengan cURL (Terminal)

**A. Register User Buyer:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Buyer",
    "email": "buyer@test.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**B. Login & Simpan Token:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@test.com",
    "password": "password123"
  }'
```

Copy token dari response, contoh: `1|abc123xyz...`

**C. Test Create Conversation:**
```bash
# Ganti YOUR_TOKEN dengan token dari step B
# Ganti PRODUCT_ID dengan ID produk yang ada

curl -X POST http://localhost:8000/api/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1
  }'
```

**D. Send Message:**
```bash
# Ganti CONVERSATION_ID dengan ID dari step C

curl -X POST http://localhost:8000/api/conversations/CONVERSATION_ID/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Halo, test message!"
  }'
```

---

### 4️⃣ Test dengan Postman/Thunder Client

1. **Import Collection** dari `CHAT_TESTING_EXAMPLES.md`
2. **Set Variables:**
   - `base_url`: `http://localhost:8000/api`
   - `token_buyer`: (dari login response)
   - `token_seller`: (dari login response)
3. **Run Tests** sesuai urutan di documentation

---

## 📋 API Endpoints Cheat Sheet

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/conversations` | List conversations |
| `POST` | `/api/conversations` | Create conversation |
| `GET` | `/api/conversations/{id}/messages` | Get messages |
| `POST` | `/api/conversations/{id}/messages` | Send message |
| `PUT` | `/api/conversations/{cId}/messages/{mId}` | Edit message |
| `DELETE` | `/api/conversations/{cId}/messages/{mId}` | Delete message |
| `POST` | `/api/conversations/{id}/read` | Mark as read |
| `DELETE` | `/api/conversations/{id}` | Delete conversation |

**Note:** Semua endpoint memerlukan header:
```
Authorization: Bearer {your_token}
Content-Type: application/json
```

---

## 🎯 Common Use Cases

### Use Case 1: Buyer Ingin Chat dengan Seller

```javascript
// 1. Create conversation
POST /api/conversations
Body: { "product_id": 1 }

// 2. Send message
POST /api/conversations/1/messages
Body: { "message": "Halo, masih tersedia?" }

// 3. Get messages (untuk melihat reply)
GET /api/conversations/1/messages
```

### Use Case 2: Seller Melihat Chat Masuk

```javascript
// 1. Get all conversations
GET /api/conversations

// 2. Get messages dari conversation tertentu
GET /api/conversations/1/messages

// 3. Mark as read
POST /api/conversations/1/read

// 4. Send reply
POST /api/conversations/1/messages
Body: { "message": "Ya, masih tersedia" }
```

### Use Case 3: Edit Pesan yang Salah

```javascript
// Edit message
PUT /api/conversations/1/messages/5
Body: { "message": "Pesan yang sudah diperbaiki" }
```

### Use Case 4: Hapus Pesan

```javascript
// Delete message
DELETE /api/conversations/1/messages/5
```

---

## 🔧 Troubleshooting

### ❌ Error: "Unauthenticated"
**Solusi:** Pastikan token valid dan ada di header Authorization

### ❌ Error: "Conversation not found"
**Solusi:** Cek conversation_id yang digunakan

### ❌ Error: "Unauthorized"
**Solusi:** User bukan participant conversation tersebut

### ❌ Error: "Anda tidak bisa chat dengan produk sendiri"
**Solusi:** Gunakan user lain yang bukan pemilik produk

### ❌ Error: "The message field is required"
**Solusi:** Pastikan field "message" ada dan tidak kosong

---

## 📱 Frontend Integration (React)

### Setup API Service

```javascript
// services/chatService.js
const API_URL = 'http://localhost:8000/api';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const chatService = {
  // Get all conversations
  getConversations: async () => {
    const response = await fetch(`${API_URL}/conversations`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  // Create or get conversation
  createConversation: async (productId) => {
    const response = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ product_id: productId })
    });
    return response.json();
  },

  // Get messages
  getMessages: async (conversationId) => {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
      headers: getAuthHeader()
    });
    return response.json();
  },

  // Send message
  sendMessage: async (conversationId, message) => {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ message })
    });
    return response.json();
  },

  // Edit message
  editMessage: async (conversationId, messageId, message) => {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/${messageId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ message })
    });
    return response.json();
  },

  // Delete message
  deleteMessage: async (conversationId, messageId) => {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return response.json();
  },

  // Mark as read
  markAsRead: async (conversationId) => {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/read`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return response.json();
  }
};
```

### Update ChatContext.jsx

```javascript
import { chatService } from '../services/chatService';

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load conversations
  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await chatService.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start chat
  const startChat = async (productId) => {
    try {
      const response = await chatService.createConversation(productId);
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Send message
  const sendMessage = async (conversationId, message) => {
    try {
      const response = await chatService.sendMessage(conversationId, message);
      if (response.success) {
        // Update local state or reload messages
        return response.data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <ChatContext.Provider value={{
      conversations,
      loading,
      loadConversations,
      startChat,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
```

---

## 🎨 UI Integration Example

```javascript
// ChatPage.jsx
import { useChat } from './context/ChatContext';

function ChatPage() {
  const { conversations, loading } = useChat();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Chats</h1>
      {conversations.map(conv => (
        <div key={conv.id} onClick={() => openChat(conv.id)}>
          <h3>{conv.product.name}</h3>
          <p>{conv.other_participant.name}</p>
          <p>{conv.last_message}</p>
          {conv.unread_count > 0 && (
            <span className="badge">{conv.unread_count}</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔥 Real-time Setup (Optional)

Jika ingin real-time messaging, ikuti panduan di:
- **`CHAT_REALTIME_SETUP.md`** - Setup lengkap Pusher/Reverb

Atau gunakan **polling** untuk alternatif sederhana:
```javascript
// Poll messages every 3 seconds
useEffect(() => {
  const interval = setInterval(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, 3000);
  
  return () => clearInterval(interval);
}, [currentConversation]);
```

---

## 📚 Documentation Files

1. **`CHAT_API_DOCUMENTATION.md`** - API reference lengkap
2. **`CHAT_REALTIME_SETUP.md`** - Setup real-time broadcasting
3. **`CHAT_TESTING_EXAMPLES.md`** - Testing examples & Postman collection
4. **`CHAT_IMPLEMENTATION_SUMMARY.md`** - Summary implementasi
5. **`CHAT_QUICK_START.md`** - File ini

---

## ✅ Checklist

- [x] Database migrations created & run
- [x] Models created (Conversation, Message)
- [x] Controller created (UserChatController)
- [x] Routes registered (8 endpoints)
- [x] Broadcasting events created
- [x] Documentation completed
- [ ] API tested with Postman
- [ ] Frontend integrated
- [ ] Real-time setup (optional)
- [ ] Production deployment

---

## 🎉 Next Steps

1. **Test API** menggunakan Postman/cURL
2. **Integrate Frontend** dengan ChatContext
3. **Setup Real-time** (optional) untuk better UX
4. **Deploy** ke production

---

## 💡 Tips

- Gunakan 2 browser/incognito untuk test buyer-seller interaction
- Simpan tokens untuk testing yang lebih mudah
- Monitor Laravel logs: `tail -f storage/logs/laravel.log`
- Gunakan `php artisan route:list` untuk cek routes
- Clear cache jika ada masalah: `php artisan cache:clear`

---

## 🆘 Need Help?

- Check **`CHAT_API_DOCUMENTATION.md`** untuk API details
- Check **`CHAT_TESTING_EXAMPLES.md`** untuk testing examples
- Check Laravel logs untuk error details
- Check browser console untuk frontend errors

---

**Happy Coding! 🚀**

Backend chat feature sudah siap digunakan!
