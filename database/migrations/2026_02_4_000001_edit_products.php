<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE products 
            MODIFY status ENUM(
                'menunggu',
                'aktif',
                'terjual',
                'ditolak',
                'disembunyikan'
            ) NOT NULL DEFAULT 'menunggu'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE products 
            MODIFY status ENUM(
                'menunggu',
                'aktif',
                'terjual',
                'ditolak'
            ) NOT NULL DEFAULT 'menunggu'
        ");
    }
};
