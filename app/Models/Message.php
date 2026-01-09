<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message',
        'is_read',
        'is_edited',
        'edited_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_edited' => 'boolean',
        'edited_at' => 'datetime',
    ];

    /**
     * Relationship: Message belongs to a Conversation
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Relationship: Message belongs to a Sender (User)
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Mark message as read
     */
    public function markAsRead()
    {
        if (!$this->is_read) {
            $this->is_read = true;
            $this->save();
        }
    }

    /**
     * Edit message
     */
    public function editMessage($newMessage)
    {
        $this->message = $newMessage;
        $this->is_edited = true;
        $this->edited_at = now();
        $this->save();
    }

    /**
     * Check if user can edit this message
     */
    public function canEdit($userId)
    {
        return $this->sender_id == $userId;
    }

    /**
     * Check if user can delete this message
     */
    public function canDelete($userId)
    {
        return $this->sender_id == $userId;
    }
}
