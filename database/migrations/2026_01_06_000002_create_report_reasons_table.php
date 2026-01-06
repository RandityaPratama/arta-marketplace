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
        Schema::create('report_reasons', function (Blueprint $table) {
            $table->id();
            $table->string('reason'); // Isi alasan (misal: Penipuan, Barang Palsu)
            $table->string('type')->default('general'); // Opsional: untuk membedakan laporan iklan vs user
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_reasons');
    }
};