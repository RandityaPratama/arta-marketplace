<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'transaction_status',
        'payment_type',
        'raw_response',
    ];

    protected $casts = [
        'raw_response' => 'array',
    ];

    /**
     * Relasi ke Transaction
     */
    public function transaction()
    {
        // Relasi balik ke Transaction menggunakan order_id
        return $this->belongsTo(Transaction::class, 'order_id', 'order_id');
    }
}