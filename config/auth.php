<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | This option defines the default authentication "guard" and password
    | reset "broker" for your application.
    |
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'), // Default untuk web (users)
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Guards untuk user dan admin TERPISAH
    |
    */

    'guards' => [
        // 👤 GUARD UNTUK USER BIASA (Website/Member)
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        // 🔐 GUARD UNTUK USER API (React/Angular/Vue)
        'api' => [
            'driver' => 'sanctum',
            'provider' => 'users',
            'hash' => false,
        ],

        // 👑 GUARD UNTUK ADMIN (Web Interface - jika ada)
        'admin' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],

        // 🔐 GUARD UNTUK ADMIN API (Admin Dashboard React)
        'admin-api' => [
            'driver' => 'sanctum',
            'provider' => 'admins',
            'hash' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | Provider untuk users dan admins TERPISAH
    |
    */

    'providers' => [
        // 👤 PROVIDER UNTAK USER BIASA
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],

        // 👑 PROVIDER UNTUK ADMIN (TABLE TERPISAH!)
        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Admin::class,
        ],

        // Opsional: Jika mau pakai database provider
        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
        // 'admins' => [
        //     'driver' => 'database',
        //     'table' => 'admins',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | Password reset untuk users dan admins TERPISAH
    |
    */

    'passwords' => [
        // 👤 PASSWORD RESET UNTUK USER BIASA
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],

        // 👑 PASSWORD RESET UNTUK ADMIN (TERPISAH)
        'admins' => [
            'provider' => 'admins',
            'table' => 'admin_password_reset_tokens', // Table khusus admin
            'expire' => 30, // Waktu lebih pendek untuk admin
            'throttle' => 30,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];