<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use App\Models\Activity;
use App\Events\MessageSent;
use App\Events\MessageUpdated;
use App\Events\MessageDeleted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UserChatController extends Controller
{
 
    public function getConversations(Request $request)
    {
        try {
            $user = $request->user();
            
            $conversations = Conversation::where('buyer_id', $user->id)
                ->orWhere('seller_id', $user->id)
                ->with(['product', 'buyer', 'seller'])
                ->orderBy('last_message_at', 'desc')
                ->get()
                ->map(function ($conversation) use ($user) {
                    $otherParticipant = $conversation->getOtherParticipant($user->id);
                    $participantType = $conversation->getParticipantType($user->id);
                    
                    
                    $images = $conversation->product->images;
                    if (is_string($images)) {
                        $images = json_decode($images, true);
                    }

                    return [
                        'id' => $conversation->id,
                        'participant_type' => $participantType,
                        'product' => [
                            'id' => $conversation->product->id,
                            'name' => $conversation->product->name,
                            'price' => $conversation->product->price,
                            'images' => is_array($images) ? $images : [],
                            'location' => $conversation->product->location,
                        ],
                        'other_participant' => [
                            'id' => $otherParticipant->id,
                            'name' => $otherParticipant->name,
                            'avatar' => $otherParticipant->avatar,
                        ],
                        'last_message' => $conversation->last_message,
                        'last_message_at' => $conversation->last_message_at,
                        'unread_count' => $conversation->getUnreadCount($user->id),
                        'created_at' => $conversation->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $conversations
            ]);

        } catch (\Exception $e) {
            Log::error('Get conversations error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil daftar percakapan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get or create conversation
     */
    public function getOrCreateConversation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $product = Product::findOrFail($request->product_id);

            // Cek apakah user adalah pemilik produk
            if ($product->user_id == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak bisa chat dengan produk sendiri'
                ], 400);
            }

            // Cari atau buat conversation
            $conversation = Conversation::where('product_id', $product->id)
                ->where(function ($query) use ($user, $product) {
                    $query->where(function ($q) use ($user, $product) {
                        $q->where('buyer_id', $user->id)
                          ->where('seller_id', $product->user_id);
                    });
                })
                ->first();

            if (!$conversation) {
                $conversation = Conversation::create([
                    'product_id' => $product->id,
                    'buyer_id' => $user->id,
                    'seller_id' => $product->user_id,
                    'last_message_at' => now(),
                ]);

                // ✅ Catat aktivitas ketika pembeli menghubungi penjual
                try {
                    Activity::create([
                        'user_id' => $user->id,
                        'action' => $user->name . ' menghubungi penjual untuk produk \'' . $product->name . '\'',
                        'type' => 'chat',
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Failed to log chat contact activity: ' . $e->getMessage());
                }
            }

            // Load relationships
            $conversation->load(['product', 'buyer', 'seller']);

            $otherParticipant = $conversation->getOtherParticipant($user->id);
            $participantType = $conversation->getParticipantType($user->id);

            // ✅ Pastikan images di-decode
            $images = $conversation->product->images;
            if (is_string($images)) {
                $images = json_decode($images, true);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $conversation->id,
                    'participant_type' => $participantType,
                    'product' => [
                        'id' => $conversation->product->id,
                        'name' => $conversation->product->name,
                        'price' => $conversation->product->price,
                        'images' => is_array($images) ? $images : [],
                        'location' => $conversation->product->location,
                    ],
                    'other_participant' => [
                        'id' => $otherParticipant->id,
                        'name' => $otherParticipant->name,
                        'avatar' => $otherParticipant->avatar,
                    ],
                    'last_message' => $conversation->last_message,
                    'last_message_at' => $conversation->last_message_at,
                    'unread_count' => $conversation->getUnreadCount($user->id),
                    'created_at' => $conversation->created_at,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create conversation error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat percakapan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get messages for a conversation
     */
    public function getMessages(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            
            $conversation = Conversation::findOrFail($conversationId);

            // Cek apakah user adalah participant
            if ($conversation->buyer_id != $user->id && $conversation->seller_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $messages = Message::where('conversation_id', $conversationId)
                ->with('sender')
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($message) use ($user) {
                    return [
                        'id' => $message->id,
                        'conversation_id' => $message->conversation_id,
                        'sender_id' => $message->sender_id,
                        'message' => $message->message,
                        'is_read' => $message->is_read,
                        'is_edited' => $message->is_edited,
                        'edited_at' => $message->edited_at,
                        'created_at' => $message->created_at,
                        'sender' => [
                            'id' => $message->sender->id,
                            'name' => $message->sender->name,
                        ],
                        'is_own' => $message->sender_id == $user->id,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);

        } catch (\Exception $e) {
            Log::error('Get messages error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil pesan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request, $conversationId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $conversation = Conversation::findOrFail($conversationId);

            // Cek apakah user adalah participant
            if ($conversation->buyer_id != $user->id && $conversation->seller_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            DB::beginTransaction();

            // Buat message baru
            $message = Message::create([
                'conversation_id' => $conversationId,
                'sender_id' => $user->id,
                'message' => $request->message,
            ]);

            // Update conversation
            $conversation->updateLastMessage($request->message);
            $conversation->incrementUnreadCount($user->id);

            DB::commit();

            // Load sender relationship
            $message->load('sender');

            // Broadcast event untuk real-time
            broadcast(new MessageSent($message, $conversation))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil dikirim',
                'data' => [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'sender_id' => $message->sender_id,
                    'message' => $message->message,
                    'is_read' => $message->is_read,
                    'is_edited' => $message->is_edited,
                    'edited_at' => $message->edited_at,
                    'created_at' => $message->created_at,
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                    ],
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Send message error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim pesan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Edit a message
     */
    public function editMessage(Request $request, $conversationId, $messageId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $message = Message::where('id', $messageId)
                ->where('conversation_id', $conversationId)
                ->firstOrFail();

            // Cek apakah user adalah pengirim pesan
            if (!$message->canEdit($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak bisa mengedit pesan ini'
                ], 403);
            }

            // Edit message
            $message->editMessage($request->message);

            // Update last message di conversation jika ini adalah pesan terakhir
            $conversation = $message->conversation;
            $latestMessage = $conversation->messages()->latest()->first();
            if ($latestMessage->id == $message->id) {
                $conversation->updateLastMessage($request->message);
            }

            // Broadcast event untuk real-time
            broadcast(new MessageUpdated($message))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil diubah',
                'data' => [
                    'id' => $message->id,
                    'message' => $message->message,
                    'is_edited' => $message->is_edited,
                    'edited_at' => $message->edited_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Edit message error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengedit pesan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a message
     */
    public function deleteMessage(Request $request, $conversationId, $messageId)
    {
        try {
            $user = $request->user();
            $message = Message::where('id', $messageId)
                ->where('conversation_id', $conversationId)
                ->firstOrFail();

            // Cek apakah user adalah pengirim pesan
            if (!$message->canDelete($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak bisa menghapus pesan ini'
                ], 403);
            }

            $conversation = $message->conversation;

            // Soft delete message
            $message->delete();

            // Update last message di conversation jika ini adalah pesan terakhir
            $latestMessage = $conversation->messages()->latest()->first();
            if ($latestMessage) {
                $conversation->updateLastMessage($latestMessage->message);
            } else {
                $conversation->last_message = null;
                $conversation->save();
            }

            // Broadcast event untuk real-time
            broadcast(new MessageDeleted($messageId, $conversationId))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete message error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pesan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark conversation as read
     */
    public function markAsRead(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            $conversation = Conversation::findOrFail($conversationId);

            // Cek apakah user adalah participant
            if ($conversation->buyer_id != $user->id && $conversation->seller_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Mark as read
            $conversation->markAsRead($user->id);

            return response()->json([
                'success' => true,
                'message' => 'Percakapan ditandai sudah dibaca'
            ]);

        } catch (\Exception $e) {
            Log::error('Mark as read error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menandai percakapan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete conversation
     */
    public function deleteConversation(Request $request, $conversationId)
    {
        try {
            $user = $request->user();
            $conversation = Conversation::findOrFail($conversationId);

            // Cek apakah user adalah participant
            if ($conversation->buyer_id != $user->id && $conversation->seller_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Delete conversation (akan cascade delete messages)
            $conversation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Percakapan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete conversation error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus percakapan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
