<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_logs', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->index(); // Referensi ke transactions.order_id
            $table->string('transaction_status'); // Status mentah dari Midtrans
            $table->string('payment_type')->nullable(); // Tipe pembayaran
            $table->json('raw_response'); // Response lengkap JSON dari webhook Midtrans
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
    }
};
