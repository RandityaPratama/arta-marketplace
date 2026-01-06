<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->boolean('is_super_admin')->default(false);            
            $table->boolean('is_active')->default(true);            
            $table->timestamp('last_login_at')->nullable();           
            $table->timestamp('email_verified_at')->nullable();                       
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });               
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_personal_access_tokens');
        Schema::dropIfExists('admins');
    }
};