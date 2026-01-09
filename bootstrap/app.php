<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php', // ✅ Enable broadcasting channels
        health: '/up',
        then: function () {
            // Daftarkan route admin dengan middleware 'api'
            Route::middleware('api')
                ->prefix('api/admin') // Opsional: agar URL jadi /api/admin/...
                ->group(base_path('routes/admin.php'));
        },
    )

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'isAdmin' => \App\Http\Middleware\IsAdminMiddleware::class,   
            'isUser' => \App\Http\Middleware\IsUserMiddleware::class,        
        ]);
        
        $middleware->statefulApi();
        
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'admin/*', 
            'sanctum/csrf-cookie'
        ]);
    })
   ->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(function ($request, $e) {
        if ($request->is('api/*') || $request->is('admin/*')) {
            return true;
        }

        return $request->expectsJson();
    });
})
->create();