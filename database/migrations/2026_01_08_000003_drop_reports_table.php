<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('reports');
    }

    public function down(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('report_reason_id')->constrained('report_reasons')->onDelete('cascade');
            $table->enum('type', ['iklan', 'pembelian']);
            $table->text('description')->nullable();
            $table->json('evidence_images')->nullable();
            $table->date('purchase_date')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'resolved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('admins')->onDelete('set null');
            $table->timestamp('handled_at')->nullable();
            $table->timestamps();
        });
    }
};
