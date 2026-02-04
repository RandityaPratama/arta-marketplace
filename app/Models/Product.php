<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'price',
        'original_price',
        'discount',
        'stock',
        'location',
        'condition',
        'description',
        'images',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Product has many conversations
     */
    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * Relationship: Product has many favorites
     */
    public function favorites()
    {
        return $this->hasMany(Favorites::class, 'product_id');
    }
}
