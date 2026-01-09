# Chat API Testing Examples

## Prerequisites
1. Pastikan server Laravel sudah running: `php artisan serve`
2. Pastikan database migrations sudah dijalankan
3. Punya 2 user accounts untuk testing (User A sebagai buyer, User B sebagai seller)
4. Punya minimal 1 product yang dibuat oleh User B

---

## Setup Testing Environment

### 1. Create Test Users (via API atau Tinker)

**User A (Buyer):**
```bash
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "Buyer User",
  "email": "buyer@test.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567890",
  "location": "Jakarta"
}
```

**User B (Seller):**
```bash
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "Seller User",
  "email": "seller@test.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "081234567891",
  "location": "Bandung"
}
```

### 2. Login to Get Tokens

**Login User A:**
```bash
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "buyer@test.com",
  "password": "password123"
}

# Save the token from response
# Example: TOKEN_A = "1|abc123..."
```

**Login User B:**
```bash
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "seller@test.com",
  "password": "password123"
}

# Save the token from response
# Example: TOKEN_B = "2|def456..."
```

### 3. Create a Product (as User B - Seller)

```bash
POST http://localhost:8000/api/products
Authorization: Bearer {TOKEN_B}
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "category": "Elektronik",
  "price": 15000000,
  "original_price": 18000000,
  "discount": 17,
  "location": "Bandung",
  "condition": "Baru",
  "description": "iPhone 15 Pro Max 256GB, warna Natural Titanium",
  "images": ["iphone1.jpg", "iphone2.jpg"]
}

# Save the product_id from response
# Example: PRODUCT_ID = 1
```

---

## Testing Flow

### Test 1: Create Conversation (User A as Buyer)

```bash
POST http://localhost:8000/api/conversations
Authorization: Bearer {TOKEN_A}
Content-Type: application/json

{
  "product_id": 1
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "participant_type": "buyer",
    "product": {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "price": "15000000.00",
      "images": ["iphone1.jpg", "iphone2.jpg"]
    },
    "other_participant": {
      "id": 2,
      "name": "Seller User"
    },
    "last_message": null,
    "last_message_at": "2024-01-07T10:30:00.000000Z",
    "unread_count": 0,
    "created_at": "2024-01-07T10:30:00.000000Z"
  }
}
```

**Save CONVERSATION_ID = 1**

---

### Test 2: Send First Message (User A as Buyer)

```bash
POST http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_A}
Content-Type: application/json

{
  "message": "Halo, apakah iPhone ini masih tersedia?"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": {
    "id": 1,
    "conversation_id": 1,
    "sender_id": 1,
    "message": "Halo, apakah iPhone ini masih tersedia?",
    "is_read": false,
    "is_edited": false,
    "edited_at": null,
    "created_at": "2024-01-07T10:31:00.000000Z",
    "sender": {
      "id": 1,
      "name": "Buyer User"
    }
  }
}
```

---

### Test 3: Get Conversations (User B as Seller)

```bash
GET http://localhost:8000/api/conversations
Authorization: Bearer {TOKEN_B}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "participant_type": "seller",
      "product": {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "price": "15000000.00",
        "images": ["iphone1.jpg", "iphone2.jpg"]
      },
      "other_participant": {
        "id": 1,
        "name": "Buyer User"
      },
      "last_message": "Halo, apakah iPhone ini masih tersedia?",
      "last_message_at": "2024-01-07T10:31:00.000000Z",
      "unread_count": 1,
      "created_at": "2024-01-07T10:30:00.000000Z"
    }
  ]
}
```

**Note:** User B melihat unread_count = 1

---

### Test 4: Get Messages (User B as Seller)

```bash
GET http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_B}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "conversation_id": 1,
      "sender_id": 1,
      "message": "Halo, apakah iPhone ini masih tersedia?",
      "is_read": false,
      "is_edited": false,
      "edited_at": null,
      "created_at": "2024-01-07T10:31:00.000000Z",
      "sender": {
        "id": 1,
        "name": "Buyer User"
      },
      "is_own": false
    }
  ]
}
```

---

### Test 5: Mark as Read (User B as Seller)

```bash
POST http://localhost:8000/api/conversations/1/read
Authorization: Bearer {TOKEN_B}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Percakapan ditandai sudah dibaca"
}
```

**Verify:** Get conversations lagi, unread_count harus jadi 0

---

### Test 6: Send Reply (User B as Seller)

```bash
POST http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_B}
Content-Type: application/json

{
  "message": "Ya, masih tersedia. Minat?"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": {
    "id": 2,
    "conversation_id": 1,
    "sender_id": 2,
    "message": "Ya, masih tersedia. Minat?",
    "is_read": false,
    "is_edited": false,
    "edited_at": null,
    "created_at": "2024-01-07T10:35:00.000000Z",
    "sender": {
      "id": 2,
      "name": "Seller User"
    }
  }
}
```

---

### Test 7: Edit Message (User A as Buyer)

```bash
PUT http://localhost:8000/api/conversations/1/messages/1
Authorization: Bearer {TOKEN_A}
Content-Type: application/json

{
  "message": "Halo, apakah iPhone 15 Pro Max ini masih tersedia?"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Pesan berhasil diubah",
  "data": {
    "id": 1,
    "message": "Halo, apakah iPhone 15 Pro Max ini masih tersedia?",
    "is_edited": true,
    "edited_at": "2024-01-07T10:36:00.000000Z"
  }
}
```

---

### Test 8: Get Messages Again (Verify Edit)

```bash
GET http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_A}
```

**Expected:** Message dengan id=1 harus sudah berubah dan is_edited=true

---

### Test 9: Delete Message (User A as Buyer)

```bash
DELETE http://localhost:8000/api/conversations/1/messages/1
Authorization: Bearer {TOKEN_A}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Pesan berhasil dihapus"
}
```

---

### Test 10: Get Messages Again (Verify Delete)

```bash
GET http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_A}
```

**Expected:** Message dengan id=1 tidak muncul lagi (soft deleted)

---

### Test 11: Delete Conversation (User A as Buyer)

```bash
DELETE http://localhost:8000/api/conversations/1
Authorization: Bearer {TOKEN_A}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Percakapan berhasil dihapus"
}
```

---

## Error Testing

### Test 12: Unauthorized Access (Wrong User)

**Create User C:**
```bash
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "User C",
  "email": "userc@test.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Try to access conversation 1 with User C token:**
```bash
GET http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_C}
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### Test 13: Validation Error (Empty Message)

```bash
POST http://localhost:8000/api/conversations/1/messages
Authorization: Bearer {TOKEN_A}
Content-Type: application/json

{
  "message": ""
}
```

**Expected Response (422):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "message": ["The message field is required."]
  }
}
```

---

### Test 14: Not Found (Invalid Conversation ID)

```bash
GET http://localhost:8000/api/conversations/999/messages
Authorization: Bearer {TOKEN_A}
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Conversation not found"
}
```

---

### Test 15: Cannot Chat with Own Product

**User B tries to create conversation with their own product:**
```bash
POST http://localhost:8000/api/conversations
Authorization: Bearer {TOKEN_B}
Content-Type: application/json

{
  "product_id": 1
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Anda tidak bisa chat dengan produk sendiri"
}
```

---

## Postman Collection

Anda bisa import collection ini ke Postman:

```json
{
  "info": {
    "name": "Chat API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api"
    },
    {
      "key": "token_buyer",
      "value": ""
    },
    {
      "key": "token_seller",
      "value": ""
    },
    {
      "key": "conversation_id",
      "value": ""
    },
    {
      "key": "message_id",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "1. Create Conversation",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token_buyer}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"product_id\": 1\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/conversations",
          "host": ["{{base_url}}"],
          "path": ["conversations"]
        }
      }
    }
  ]
}
```

---

## Quick Test Script (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:8000/api"

# Login as buyer
BUYER_TOKEN=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@test.com","password":"password123"}' \
  | jq -r '.data.token')

echo "Buyer Token: $BUYER_TOKEN"

# Create conversation
CONV_ID=$(curl -s -X POST "$BASE_URL/conversations" \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1}' \
  | jq -r '.data.id')

echo "Conversation ID: $CONV_ID"

# Send message
curl -X POST "$BASE_URL/conversations/$CONV_ID/messages" \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message"}' \
  | jq '.'
```

---

## Testing Checklist

- [ ] ✅ Create conversation
- [ ] ✅ Get conversations list
- [ ] ✅ Send message
- [ ] ✅ Get messages
- [ ] ✅ Edit message
- [ ] ✅ Delete message
- [ ] ✅ Mark as read
- [ ] ✅ Delete conversation
- [ ] ✅ Unread counter works
- [ ] ✅ Authorization checks work
- [ ] ✅ Validation errors work
- [ ] ✅ Cannot chat with own product
- [ ] ✅ Soft delete works for messages

---

## Notes

- Gunakan tools seperti Postman, Insomnia, atau Thunder Client untuk testing
- Simpan tokens dan IDs untuk digunakan di request berikutnya
- Test dengan 2 user berbeda untuk simulasi buyer-seller interaction
- Perhatikan unread_count yang berubah saat send message dan mark as read
- Pesan yang dihapus tidak muncul di get messages (soft delete)

**Happy Testing! 🚀**
