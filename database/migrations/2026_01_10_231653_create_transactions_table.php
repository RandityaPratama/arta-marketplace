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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // ID Unik untuk Midtrans (misal: TRX-12345)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Pembeli
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Produk yang dibeli
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Penjual (untuk kemudahan query)
            $table->decimal('amount', 15, 2); // Total harga yang harus dibayar
            $table->string('status')->default('pending'); // pending, paid, expired, failed, canceled
            $table->string('snap_token')->nullable(); // Token untuk popup Snap Midtrans
            $table->string('payment_type')->nullable(); // credit_card, gopay, bank_transfer, dll
            $table->json('payment_details')->nullable(); // Menyimpan info VA, QR Code, dll
            $table->timestamps();

            // Index untuk optimasi query riwayat transaksi
            $table->index(['user_id', 'status']);
            $table->index(['seller_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
