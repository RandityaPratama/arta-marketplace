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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Relasi ke penjual
            $table->string('name');
            $table->string('category');
            $table->decimal('price', 15, 2); // Harga jual (setelah diskon jika ada)
            $table->decimal('original_price', 15, 2)->nullable(); // Harga asli sebelum diskon
            $table->integer('discount')->nullable(); // Persentase diskon
            $table->string('location');
            $table->string('condition'); // Contoh: Baru, Bekas, Mulus, Bekas Baik
            $table->text('description');
            $table->json('images')->nullable(); // Menyimpan array path gambar
            $table->enum('status', ['menunggu', 'aktif', 'terjual', 'ditolak'])->default('menunggu');
            $table->text('rejection_reason')->nullable(); // Alasan jika ditolak admin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};