<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'product_id',
        'seller_id',
        'report_reason_id',
        'status',
        'admin_notes',
        'handled_by',
        'handled_at',
    ];

    protected $casts = [
        'handled_at' => 'datetime',
    ];

    /**
     * Relasi ke User (reporter)
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /**
     * Relasi ke Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relasi ke User (seller)
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Relasi ke ReportReason
     */
    public function reportReason()
    {
        return $this->belongsTo(ReportReason::class);
    }

    /**
     * Relasi ke Admin (handler)
     */
    public function handler()
    {
        return $this->belongsTo(Admin::class, 'handled_by');
    }
}
