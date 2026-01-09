<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'buyer_id',
        'seller_id',
        'last_message',
        'last_message_at',
        'buyer_unread_count',
        'seller_unread_count',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    /**
     * Relationship: Conversation belongs to a Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relationship: Conversation belongs to a Buyer (User)
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Relationship: Conversation belongs to a Seller (User)
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Relationship: Conversation has many Messages
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get the other participant in the conversation
     */
    public function getOtherParticipant($userId)
    {
        if ($this->buyer_id == $userId) {
            return $this->seller;
        }
        return $this->buyer;
    }

    /**
     * Get participant type (buyer or seller)
     */
    public function getParticipantType($userId)
    {
        if ($this->buyer_id == $userId) {
            return 'buyer';
        }
        return 'seller';
    }

    /**
     * Get unread count for specific user
     */
    public function getUnreadCount($userId)
    {
        if ($this->buyer_id == $userId) {
            return $this->buyer_unread_count;
        }
        return $this->seller_unread_count;
    }

    /**
     * Mark messages as read for specific user
     */
    public function markAsRead($userId)
    {
        if ($this->buyer_id == $userId) {
            $this->buyer_unread_count = 0;
        } else {
            $this->seller_unread_count = 0;
        }
        $this->save();

        // Mark all unread messages as read
        $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    /**
     * Increment unread count for recipient
     */
    public function incrementUnreadCount($senderId)
    {
        if ($this->buyer_id == $senderId) {
            $this->seller_unread_count++;
        } else {
            $this->buyer_unread_count++;
        }
        $this->save();
    }

    /**
     * Update last message info
     */
    public function updateLastMessage($message)
    {
        $this->last_message = $message;
        $this->last_message_at = now();
        $this->save();
    }
}
