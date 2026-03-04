<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Tambahkan kolom jika belum ada
            if (!Schema::hasColumn('transactions', 'shipping_address')) {
                $table->string('shipping_address')->nullable()->after('amount');
            }
            if (!Schema::hasColumn('transactions', 'courier')) {
                $table->string('courier')->nullable()->after('shipping_address');
            }
            if (!Schema::hasColumn('transactions', 'courier_name')) {
                $table->string('courier_name')->nullable()->after('courier');
            }
            if (!Schema::hasColumn('transactions', 'shipping_cost')) {
                $table->decimal('shipping_cost', 10, 2)->default(0)->after('courier_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['shipping_address', 'courier', 'courier_name', 'shipping_cost']);
        });
    }
};