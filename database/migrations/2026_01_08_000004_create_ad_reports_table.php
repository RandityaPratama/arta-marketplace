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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade'); // User yang melaporkan
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Produk yang dilaporkan
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade'); // Penjual produk
            $table->foreignId('report_reason_id')->constrained('report_reasons')->onDelete('cascade'); // Alasan laporan
            $table->enum('status', ['pending', 'in_progress', 'resolved', 'rejected'])->default('pending'); // Status laporan
            $table->text('admin_notes')->nullable(); // Catatan dari admin
            $table->foreignId('handled_by')->nullable()->constrained('admins')->onDelete('set null'); // Admin yang menangani
            $table->timestamp('handled_at')->nullable(); // Waktu ditangani
            $table->timestamps();
            
            // Index untuk performa query
            $table->index('reporter_id');
            $table->index('product_id');
            $table->index('seller_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
