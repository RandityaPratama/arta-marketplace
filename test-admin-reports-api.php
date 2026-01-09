<?php

// Test Admin Reports API
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Report;

echo "=== Testing Admin Reports API ===\n\n";

try {
    echo "1. Checking reports count: ";
    $count = Report::count();
    echo "$count reports found\n\n";

    echo "2. Fetching report with relations:\n";
    $report = Report::with(['reporter', 'product', 'seller', 'reportReason', 'handler'])->first();
    
    if ($report) {
        echo "   Report ID: {$report->id}\n";
        echo "   Reporter: {$report->reporter->name} ({$report->reporter->email})\n";
        echo "   Product: {$report->product->name}\n";
        echo "   Seller: {$report->seller->name} ({$report->seller->email})\n";
        echo "   Reason: {$report->reportReason->reason}\n";
        echo "   Status: {$report->status}\n";
        echo "   Created: {$report->created_at}\n\n";
        
        echo "3. Testing formatted data (like controller):\n";
        $formatted = [
            'id' => $report->id,
            'reporter' => [
                'id' => $report->reporter->id,
                'name' => $report->reporter->name,
                'email' => $report->reporter->email,
            ],
            'product' => [
                'id' => $report->product->id,
                'name' => $report->product->name,
                'price' => $report->product->price,
                'images' => $report->product->images,
            ],
            'seller' => [
                'id' => $report->seller->id,
                'name' => $report->seller->name,
                'email' => $report->seller->email,
            ],
            'reason' => $report->reportReason->reason,
            'status' => $report->status,
            'admin_notes' => $report->admin_notes,
            'handler' => $report->handler ? [
                'id' => $report->handler->id,
                'name' => $report->handler->name,
            ] : null,
            'created_at' => $report->created_at->format('Y-m-d H:i:s'),
            'handled_at' => $report->handled_at ? $report->handled_at->format('Y-m-d H:i:s') : null,
        ];
        
        echo json_encode($formatted, JSON_PRETTY_PRINT) . "\n\n";
        
        echo "✅ All relations loaded successfully!\n";
        echo "✅ Data formatting works correctly!\n\n";
        
        echo "4. Checking if product has images:\n";
        if ($report->product->images && count($report->product->images) > 0) {
            echo "   Product has " . count($report->product->images) . " image(s)\n";
            echo "   First image: {$report->product->images[0]}\n";
        } else {
            echo "   ⚠️  Product has no images\n";
        }
        
    } else {
        echo "❌ No report found!\n";
    }
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
}

echo "\n=== Test Complete ===\n";
