# Chat API Documentation

## Overview
Backend API untuk fitur chat marketplace dengan dukungan real-time messaging menggunakan Laravel Broadcasting.

## Features
- ✅ Percakapan berbasis produk (buyer-seller)
- ✅ Kirim pesan real-time
- ✅ Edit pesan
- ✅ Hapus pesan (soft delete)
- ✅ Mark as read
- ✅ Unread message counter
- ✅ Broadcasting events untuk real-time updates

## Database Schema

### Table: conversations
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| product_id | bigint | Foreign key ke products |
| buyer_id | bigint | Foreign key ke users (pembeli) |
| seller_id | bigint | Foreign key ke users (penjual) |
| last_message | text | Cache pesan terakhir |
| last_message_at | timestamp | Waktu pesan terakhir |
| buyer_unread_count | integer | Jumlah pesan belum dibaca buyer |
| seller_unread_count | integer | Jumlah pesan belum dibaca seller |
| created_at | timestamp | |
| updated_at | timestamp | |

### Table: messages
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| conversation_id | bigint | Foreign key ke conversations |
| sender_id | bigint | Foreign key ke users |
| message | text | Isi pesan |
| is_read | boolean | Status sudah dibaca |
| is_edited | boolean | Status sudah diedit |
| edited_at | timestamp | Waktu terakhir diedit |
| deleted_at | timestamp | Soft delete timestamp |
| created_at | timestamp | |
| updated_at | timestamp | |

## API Endpoints

### 1. Get All Conversations
**Endpoint:** `GET /api/conversations`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "participant_type": "buyer",
      "product": {
        "id": 1,
        "name": "Samsung S24 Ultra",
        "price": "10800000.00",
        "images": ["image1.jpg"]
      },
      "other_participant": {
        "id": 2,
        "name": "John Doe"
      },
      "last_message": "Halo, masih tersedia?",
      "last_message_at": "2024-01-07T10:30:00.000000Z",
      "unread_count": 2,
      "created_at": "2024-01-07T09:00:00.000000Z"
    }
  ]
}
```

### 2. Create or Get Conversation
**Endpoint:** `POST /api/conversations`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 1
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "participant_type": "buyer",
    "product": {
      "id": 1,
      "name": "Samsung S24 Ultra",
      "price": "10800000.00",
      "images": ["image1.jpg"]
    },
    "other_participant": {
      "id": 2,
      "name": "John Doe"
    },
    "last_message": null,
    "last_message_at": "2024-01-07T10:30:00.000000Z",
    "unread_count": 0,
    "created_at": "2024-01-07T10:30:00.000000Z"
  }
}
```

### 3. Get Messages
**Endpoint:** `GET /api/conversations/{id}/messages`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "conversation_id": 1,
      "sender_id": 1,
      "message": "Halo, masih tersedia?",
      "is_read": true,
      "is_edited": false,
      "edited_at": null,
      "created_at": "2024-01-07T10:30:00.000000Z",
      "sender": {
        "id": 1,
        "name": "Jane Doe"
      },
      "is_own": true
    }
  ]
}
```

### 4. Send Message
**Endpoint:** `POST /api/conversations/{id}/messages`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Halo, masih tersedia?"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": {
    "id": 1,
    "conversation_id": 1,
    "sender_id": 1,
    "message": "Halo, masih tersedia?",
    "is_read": false,
    "is_edited": false,
    "edited_at": null,
    "created_at": "2024-01-07T10:30:00.000000Z",
    "sender": {
      "id": 1,
      "name": "Jane Doe"
    }
  }
}
```

### 5. Edit Message
**Endpoint:** `PUT /api/conversations/{conversationId}/messages/{messageId}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Halo, apakah masih tersedia?"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Pesan berhasil diubah",
  "data": {
    "id": 1,
    "message": "Halo, apakah masih tersedia?",
    "is_edited": true,
    "edited_at": "2024-01-07T10:35:00.000000Z"
  }
}
```

### 6. Delete Message
**Endpoint:** `DELETE /api/conversations/{conversationId}/messages/{messageId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Pesan berhasil dihapus"
}
```

### 7. Mark Conversation as Read
**Endpoint:** `POST /api/conversations/{id}/read`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Percakapan ditandai sudah dibaca"
}
```

### 8. Delete Conversation
**Endpoint:** `DELETE /api/conversations/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Percakapan berhasil dihapus"
}
```

## Broadcasting Events

### Event: MessageSent
**Channel:** `private-conversation.{conversationId}`
**Event Name:** `message.sent`

**Payload:**
```json
{
  "message": {
    "id": 1,
    "conversation_id": 1,
    "sender_id": 1,
    "message": "Halo",
    "is_read": false,
    "is_edited": false,
    "edited_at": null,
    "created_at": "2024-01-07T10:30:00.000000Z",
    "sender": {
      "id": 1,
      "name": "Jane Doe"
    }
  },
  "conversation": {
    "id": 1,
    "last_message": "Halo",
    "last_message_at": "2024-01-07T10:30:00.000000Z"
  }
}
```

### Event: MessageUpdated
**Channel:** `private-conversation.{conversationId}`
**Event Name:** `message.updated`

**Payload:**
```json
{
  "message": {
    "id": 1,
    "conversation_id": 1,
    "message": "Halo, updated",
    "is_edited": true,
    "edited_at": "2024-01-07T10:35:00.000000Z"
  }
}
```

### Event: MessageDeleted
**Channel:** `private-conversation.{conversationId}`
**Event Name:** `message.deleted`

**Payload:**
```json
{
  "message_id": 1,
  "conversation_id": 1
}
```

## Setup Instructions

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Configure Broadcasting (Optional - untuk Real-time)

**Install Pusher PHP SDK:**
```bash
composer require pusher/pusher-php-server
```

**Update .env:**
```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=your_cluster
```

**Update config/broadcasting.php:**
Pastikan konfigurasi Pusher sudah benar.

### 3. Frontend Setup (Laravel Echo)

**Install Laravel Echo & Pusher JS:**
```bash
npm install --save laravel-echo pusher-js
```

**Setup Echo (resources/js/bootstrap.js):**
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
});
```

### 4. Listen to Events (Frontend)

```javascript
// Subscribe to conversation channel
Echo.private(`conversation.${conversationId}`)
    .listen('.message.sent', (e) => {
        console.log('New message:', e.message);
        // Update UI with new message
    })
    .listen('.message.updated', (e) => {
        console.log('Message updated:', e.message);
        // Update message in UI
    })
    .listen('.message.deleted', (e) => {
        console.log('Message deleted:', e.message_id);
        // Remove message from UI
    });
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Anda tidak bisa chat dengan produk sendiri"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token tidak ditemukan"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Conversation not found"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "message": ["The message field is required."]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Gagal mengirim pesan",
  "error": "Error details..."
}
```

## Testing

### Using Postman/Thunder Client

1. **Login** terlebih dahulu untuk mendapatkan token
2. Gunakan token di header `Authorization: Bearer {token}`
3. Test semua endpoint sesuai dokumentasi di atas

### Example Flow:
1. User A login → dapat token
2. User A create conversation untuk product milik User B
3. User A send message
4. User B login → dapat token
5. User B get conversations → melihat conversation dari User A
6. User B get messages → melihat pesan dari User A
7. User B send message reply
8. User A get messages → melihat reply dari User B

## Notes

- Setiap conversation terikat dengan 1 produk
- 1 buyer dan 1 seller hanya bisa punya 1 conversation per produk
- Pesan menggunakan soft delete, jadi masih bisa di-restore jika diperlukan
- Unread counter otomatis ter-update saat kirim pesan dan mark as read
- Broadcasting events hanya dikirim ke participant lain (menggunakan `toOthers()`)
