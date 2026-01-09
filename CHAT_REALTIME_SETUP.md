# Setup Real-time Chat dengan Laravel Broadcasting

## Pilihan 1: Menggunakan Pusher (Recommended untuk Production)

### 1. Install Pusher PHP SDK
```bash
composer require pusher/pusher-php-server
```

### 2. Daftar di Pusher
1. Buat akun di [https://pusher.com](https://pusher.com)
2. Buat aplikasi baru
3. Dapatkan credentials (App ID, Key, Secret, Cluster)

### 3. Update .env
```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=your_cluster

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 4. Uncomment BroadcastServiceProvider
Di file `config/app.php`, uncomment:
```php
App\Providers\BroadcastServiceProvider::class,
```

### 5. Setup Routes untuk Broadcasting Auth
File `routes/channels.php` sudah ada, tambahkan:
```php
use App\Models\Conversation;

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);
    
    if (!$conversation) {
        return false;
    }
    
    // User harus menjadi participant (buyer atau seller)
    return $conversation->buyer_id === $user->id || $conversation->seller_id === $user->id;
});
```

### 6. Frontend Setup (React)

**Install dependencies:**
```bash
npm install --save laravel-echo pusher-js
```

**Update resources/js/bootstrap.js atau buat file baru:**
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

export default window.Echo;
```

**Import di app.jsx:**
```javascript
import './bootstrap';
```

### 7. Gunakan di ChatContext.jsx

```javascript
import Echo from '../bootstrap';
import { useEffect } from 'react';

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    if (currentConversation) {
      // Subscribe to conversation channel
      const channel = Echo.private(`conversation.${currentConversation.id}`);
      
      channel.listen('.message.sent', (e) => {
        console.log('New message received:', e.message);
        // Update messages state
        setMessages(prev => [...prev, e.message]);
        
        // Update conversation last message
        updateConversationLastMessage(e.conversation);
      });
      
      channel.listen('.message.updated', (e) => {
        console.log('Message updated:', e.message);
        // Update specific message in state
        setMessages(prev => prev.map(msg => 
          msg.id === e.message.id ? { ...msg, ...e.message } : msg
        ));
      });
      
      channel.listen('.message.deleted', (e) => {
        console.log('Message deleted:', e.message_id);
        // Remove message from state
        setMessages(prev => prev.filter(msg => msg.id !== e.message_id));
      });

      // Cleanup on unmount
      return () => {
        Echo.leave(`conversation.${currentConversation.id}`);
      };
    }
  }, [currentConversation]);

  // ... rest of your code
};
```

---

## Pilihan 2: Menggunakan Laravel Reverb (Laravel 11+)

### 1. Install Laravel Reverb
```bash
php artisan install:broadcasting
```

### 2. Update .env
```env
BROADCAST_DRIVER=reverb

REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

### 3. Start Reverb Server
```bash
php artisan reverb:start
```

### 4. Frontend Setup
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
});
```

---

## Pilihan 3: Tanpa Real-time (Polling)

Jika tidak ingin setup broadcasting, Anda bisa menggunakan polling:

```javascript
// Poll messages setiap 3 detik
useEffect(() => {
  if (currentConversation) {
    const interval = setInterval(() => {
      fetchMessages(currentConversation.id);
    }, 3000);

    return () => clearInterval(interval);
  }
}, [currentConversation]);
```

---

## Testing Real-time

### 1. Test dengan 2 Browser/Incognito
1. Login sebagai User A di browser 1
2. Login sebagai User B di browser 2
3. User A kirim pesan
4. User B harus menerima pesan secara real-time tanpa refresh

### 2. Check Console
Pastikan tidak ada error di console browser dan Laravel log

### 3. Debug Mode
Aktifkan debug di Pusher dashboard untuk melihat events yang dikirim

---

## Troubleshooting

### Error: "Unable to connect to Pusher"
- Cek credentials di .env
- Pastikan VITE variables sudah benar
- Restart Vite dev server: `npm run dev`

### Error: "403 Forbidden" saat subscribe channel
- Cek routes/channels.php authorization
- Pastikan token valid di header Authorization
- Cek apakah user adalah participant conversation

### Messages tidak real-time
- Cek apakah broadcasting driver sudah benar
- Cek Laravel log untuk error
- Pastikan Echo sudah di-import dan di-setup dengan benar
- Untuk Reverb, pastikan server running: `php artisan reverb:start`

### CORS Error
Tambahkan di `config/cors.php`:
```php
'paths' => ['api/*', 'broadcasting/auth', 'sanctum/csrf-cookie'],
```

---

## Production Checklist

- [ ] Setup Pusher atau Reverb dengan credentials production
- [ ] Update .env dengan credentials production
- [ ] Test real-time functionality
- [ ] Setup queue worker untuk broadcasting: `php artisan queue:work`
- [ ] Monitor Pusher/Reverb usage dan limits
- [ ] Setup error logging untuk broadcasting failures
- [ ] Consider using Redis for better performance

---

## Alternative: Socket.io (Advanced)

Jika ingin kontrol penuh, bisa gunakan Socket.io dengan Laravel:
1. Install `laravel-echo-server`
2. Setup Socket.io server
3. Configure Laravel untuk broadcast ke Socket.io

Dokumentasi: [https://github.com/tlaverdure/laravel-echo-server](https://github.com/tlaverdure/laravel-echo-server)
