<?php

// Test Admin Reports API Endpoint
echo "=== Testing Admin Reports API Endpoint ===\n\n";

// Konfigurasi
$apiUrl = 'http://127.0.0.1:8000/api';
$adminEmail = 'admin1@gmail.com';
$adminPassword = 'admin123'; // Ganti dengan password admin yang benar

echo "Step 1: Login Admin\n";
echo "-------------------\n";

$loginData = [
    'email' => $adminEmail,
    'password' => $adminPassword
];

$ch = curl_init("$apiUrl/admin/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $loginHttpCode\n";
echo "Response: $loginResponse\n\n";

if ($loginHttpCode !== 200) {
    echo "❌ Login gagal! Pastikan email dan password benar.\n";
    echo "   Email: $adminEmail\n";
    echo "   Coba cek di database: SELECT * FROM admins;\n";
    exit(1);
}

$loginResult = json_decode($loginResponse, true);
if (!isset($loginResult['token'])) {
    echo "❌ Token tidak ditemukan dalam response!\n";
    exit(1);
}

$token = $loginResult['token'];
echo "✅ Login berhasil!\n";
echo "🔑 Token: " . substr($token, 0, 20) . "...\n\n";

// Test Get Reports
echo "Step 2: Fetch Reports\n";
echo "---------------------\n";

$ch = curl_init("$apiUrl/admin/reports");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    'Accept: application/json'
]);

$reportsResponse = curl_exec($ch);
$reportsHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $reportsHttpCode\n";
echo "Response: $reportsResponse\n\n";

if ($reportsHttpCode !== 200) {
    echo "❌ Fetch reports gagal!\n";
    exit(1);
}

$reportsResult = json_decode($reportsResponse, true);
if (!$reportsResult['success']) {
    echo "❌ API returned error: " . $reportsResult['message'] . "\n";
    exit(1);
}

echo "✅ Fetch reports berhasil!\n";
echo "📊 Total reports: " . count($reportsResult['data']) . "\n\n";

if (count($reportsResult['data']) > 0) {
    echo "Sample Report:\n";
    echo "-------------\n";
    $report = $reportsResult['data'][0];
    echo "ID: " . $report['id'] . "\n";
    echo "Product: " . $report['product']['name'] . "\n";
    echo "Reporter: " . $report['reporter']['name'] . "\n";
    echo "Seller: " . $report['seller']['name'] . "\n";
    echo "Reason: " . $report['reason'] . "\n";
    echo "Status: " . $report['status'] . "\n";
    echo "Image: " . ($report['product']['images'][0] ?? 'No image') . "\n";
    echo "\nExpected Image URL:\n";
    echo "http://127.0.0.1:8000/storage/" . ($report['product']['images'][0] ?? '') . "\n\n";
}

echo "=== Test Complete ===\n";
echo "\n✅ Semua test berhasil!\n";
echo "\nNext Steps:\n";
echo "1. Buka browser dan login sebagai admin\n";
echo "2. Buka halaman /admin/reports\n";
echo "3. Buka Developer Console (F12)\n";
echo "4. Lihat log untuk debug info\n";
echo "5. Verifikasi reports muncul di tabel\n";
