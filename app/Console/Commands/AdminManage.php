<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AdminManage extends Command
{
    protected $signature = 'admin:manage 
                            {action : create|list|update|delete|password}
                            {--email= : Admin email}
                            {--name= : Admin name}
                            {--password= : Admin password}
                            {--super : Make super admin}';
    
    protected $description = 'Manage admin accounts via CLI';
    
    public function handle()
    {
        $action = $this->argument('action');
        
        switch ($action) {
            case 'create':
                $this->createAdmin();
                break;
            case 'list':
                $this->listAdmins();
                break;
            case 'update':
                $this->updateAdmin();
                break;
            case 'delete':
                $this->deleteAdmin();
                break;
            case 'password':
                $this->changePassword();
                break;
            default:
                $this->error("Action tidak valid. Pilih: create, list, update, delete, password");
                break;
        }
    }
    
    /**
     * Create new admin
     */
    private function createAdmin()
    {
        $this->info('🔐 Membuat admin baru...');
        
        // Get inputs
        $email = $this->option('email') ?? $this->ask('Email admin:');
        $name = $this->option('name') ?? $this->ask('Nama admin:');
        $password = $this->option('password') ?? $this->secret('Password admin:');
        $isSuper = $this->option('super') ?? $this->confirm('Jadikan super admin?', false);
        
        // Validation
        $validator = Validator::make([
            'email' => $email,
            'name' => $name,
            'password' => $password,
        ], [
            'email' => 'required|email|unique:admins,email',
            'name' => 'required|string|max:255',
            'password' => ['required', Password::defaults()],
        ]);
        
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return;
        }
        
        // Confirm password if not provided via option
        if (!$this->option('password')) {
            $confirmPassword = $this->secret('Konfirmasi password:');
            
            if ($password !== $confirmPassword) {
                $this->error('Password tidak cocok!');
                return;
            }
        }
        
        // Create admin
        try {
            $admin = Admin::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'is_super_admin' => $isSuper,
                'email_verified_at' => now(),
            ]);
            
            $this->info('✅ Admin berhasil dibuat!');
            $this->table(
                ['ID', 'Nama', 'Email', 'Super Admin', 'Dibuat'],
                [[
                    $admin->id,
                    $admin->name,
                    $admin->email,
                    $admin->is_super_admin ? '✅ Ya' : '❌ Tidak',
                    $admin->created_at->format('Y-m-d H:i:s'),
                ]]
            );
            
            $this->newLine();
            $this->warn('⚠️  Simpan informasi berikut:');
            $this->line("Email: {$email}");
            $this->line("Password: {$password}");
            $this->line("Super Admin: " . ($isSuper ? 'Ya' : 'Tidak'));
            
        } catch (\Exception $e) {
            $this->error('Gagal membuat admin: ' . $e->getMessage());
        }
    }
    
    /**
     * List all admins
     */
    private function listAdmins()
    {
        $admins = Admin::all(['id', 'name', 'email', 'is_super_admin', 'last_login_at', 'created_at']);
        
        if ($admins->isEmpty()) {
            $this->info('📭 Tidak ada admin terdaftar.');
            return;
        }
        
        $this->info('📋 Daftar Admin:');
        
        $tableData = $admins->map(function ($admin) {
            return [
                $admin->id,
                $admin->name,
                $admin->email,
                $admin->is_super_admin ? '✅ Super' : '🔐 Regular',
                $admin->last_login_at ? $admin->last_login_at->diffForHumans() : 'Belum login',
                $admin->created_at->format('Y-m-d'),
            ];
        })->toArray();
        
        $this->table(
            ['ID', 'Nama', 'Email', 'Tipe', 'Terakhir Login', 'Dibuat'],
            $tableData
        );
        
        $this->newLine();
        $this->line("Total admin: {$admins->count()}");
        $this->line("Super admin: {$admins->where('is_super_admin', true)->count()}");
        $this->line("Regular admin: {$admins->where('is_super_admin', false)->count()}");
    }
    
    /**
     * Update admin
     */
    private function updateAdmin()
    {
        $email = $this->option('email') ?? $this->ask('Email admin yang akan diupdate:');
        
        $admin = Admin::where('email', $email)->first();
        
        if (!$admin) {
            $this->error("Admin dengan email '{$email}' tidak ditemukan.");
            return;
        }
        
        $this->info("Mengupdate admin: {$admin->name} ({$admin->email})");
        
        $name = $this->option('name') ?? $this->ask('Nama baru (kosongkan jika tidak berubah):', $admin->name);
        $isSuper = $this->option('super') ?? $this->confirm('Jadikan super admin?', $admin->is_super_admin);
        
        // Update
        $admin->update([
            'name' => $name ?: $admin->name,
            'is_super_admin' => $isSuper,
        ]);
        
        $this->info('✅ Admin berhasil diupdate!');
        $this->table(
            ['Field', 'Value Lama', 'Value Baru'],
            [
                ['Nama', $admin->getOriginal('name'), $admin->name],
                ['Super Admin', $admin->getOriginal('is_super_admin') ? 'Ya' : 'Tidak', $admin->is_super_admin ? 'Ya' : 'Tidak'],
            ]
        );
    }
    
    /**
     * Delete admin
     */
    private function deleteAdmin()
    {
        $email = $this->option('email') ?? $this->ask('Email admin yang akan dihapus:');
        
        $admin = Admin::where('email', $email)->first();
        
        if (!$admin) {
            $this->error("Admin dengan email '{$email}' tidak ditemukan.");
            return;
        }
        
        $this->warn("⚠️  PERINGATAN: Akan menghapus admin:");
        $this->table(
            ['ID', 'Nama', 'Email', 'Super Admin', 'Dibuat'],
            [[
                $admin->id,
                $admin->name,
                $admin->email,
                $admin->is_super_admin ? '✅ Ya' : '❌ Tidak',
                $admin->created_at->format('Y-m-d H:i:s'),
            ]]
        );
        
        // ✅ TAMBAH PERINGATAN EXTRA
        $this->newLine();
        $this->error('🚨 HATI-HATI!');
        $this->line('• Penghapusan tidak dapat dibatalkan');
        $this->line('• Semua akses admin akan hilang');
        $this->line('• Pastikan ini bukan akun yang sedang aktif digunakan');
        $this->newLine();
        
        if ($this->confirm('YAKIN ingin menghapus admin ini?', false)) {
            if ($this->confirm('SANGAT YAKIN? Ini adalah langkah terakhir!', false)) {
                $admin->delete();
                $this->info('✅ Admin berhasil dihapus!');
            } else {
                $this->info('Penghapusan dibatalkan.');
            }
        } else {
            $this->info('Penghapusan dibatalkan.');
        }
    }
    
    /**
     * Change admin password
     */
    private function changePassword()
    {
        $email = $this->option('email') ?? $this->ask('Email admin:');
        
        $admin = Admin::where('email', $email)->first();
        
        if (!$admin) {
            $this->error("Admin dengan email '{$email}' tidak ditemukan.");
            return;
        }
        
        $this->info("Mengganti password untuk: {$admin->name}");
        
        $password = $this->option('password') ?? $this->secret('Password baru:');
        
        if (!$this->option('password')) {
            $confirmPassword = $this->secret('Konfirmasi password baru:');
            
            if ($password !== $confirmPassword) {
                $this->error('Password tidak cocok!');
                return;
            }
        }
        
        // Validate password
        $validator = Validator::make(['password' => $password], [
            'password' => ['required', Password::defaults()],
        ]);
        
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return;
        }
        
        // Update password
        $admin->update([
            'password' => Hash::make($password)
        ]);
        
        // Revoke all tokens (force logout semua device)
        $admin->tokens()->delete();
        
        $this->info('✅ Password berhasil diubah!');
        $this->warn('⚠️  Admin akan logout dari semua device.');
        $this->newLine();
        $this->line("📧 Email: {$email}");
        $this->line("🔑 Password baru: {$password}");
        $this->newLine();
        $this->warn('⚠️  SIMPAN PASSWORD INI DENGAN AMAN!');
    }
}