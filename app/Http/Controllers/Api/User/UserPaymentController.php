<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\PaymentLog;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Midtrans\Config;
use Midtrans\Snap;

class UserPaymentController extends Controller
{
    public function __construct()
    {
      
        Config::$serverKey = config('midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = filter_var(config('midtrans.is_production') ?? env('MIDTRANS_IS_PRODUCTION', false), FILTER_VALIDATE_BOOLEAN);
        Config::$isSanitized = config('midtrans.is_sanitized') ?? env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = config('midtrans.is_3ds') ?? env('MIDTRANS_IS_3DS', true);
    }

   
    public function checkout(Request $request)
    {
        if (empty(Config::$serverKey)) {
            return response()->json([
                'success' => false,
                'message' => 'Midtrans Server Key belum dikonfigurasi. Cek file .env Anda.'
            ], 500);
        }

        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user = Auth::user();
            $product = Product::with('user')->findOrFail($request->product_id);

            // Cek apakah user membeli produk sendiri
            if ($product->user_id == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak bisa membeli produk sendiri'
                ], 400);
            }

            // Cek apakah produk masih tersedia (status aktif)
            if ($product->status !== 'aktif') {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk tidak tersedia untuk dibeli'
                ], 400);
            }

            // Cek apakah sudah ada transaksi pending untuk produk ini oleh user ini
            $pendingTransaction = Transaction::where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->where('status', 'pending')
                ->first();

            if ($pendingTransaction) {
                return response()->json([
                    'success' => true,
                    'message' => 'Anda memiliki transaksi tertunda untuk produk ini',
                    'data' => [
                        'transaction_id' => $pendingTransaction->id,
                        'order_id' => $pendingTransaction->order_id,
                        'snap_token' => $pendingTransaction->snap_token,
                        'amount' => $pendingTransaction->amount,
                        'product_name' => $product->name,
                    ]
                ], 200);
            }

            // 2. Buat Order ID Unik
            // Format: TRX-{USER_ID}-{TIMESTAMP}-{RANDOM}
            $orderId = 'TRX-' . $user->id . '-' . time() . '-' . rand(100, 999);

            // 3. Simpan Transaksi ke Database (Status: Pending)
            $transaction = Transaction::create([
                'order_id' => $orderId,
                'user_id' => $user->id,
                'product_id' => $product->id,
                'seller_id' => $product->user_id,
                'amount' => $product->price,
                'status' => 'pending',
            ]);

            // 4. Siapkan Parameter untuk Midtrans Snap
            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $product->price,
                ],
                'customer_details' => array_filter([
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? null,
                ]),
                'item_details' => [
                    [
                        'id' => (string) $product->id,
                        'price' => (int) $product->price,
                        'quantity' => 1,
                        'name' => substr($product->name, 0, 50), // Midtrans limit name length 50 chars
                    ]
                ]
            ];

            // 5. Request Snap Token ke Midtrans
            $snapToken = Snap::getSnapToken($params);

            // 6. Update Snap Token di Database
            $transaction->update(['snap_token' => $snapToken]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dibuat',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'order_id' => $orderId,
                    'snap_token' => $snapToken,
                    'amount' => $transaction->amount,
                    'product_name' => $product->name,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses checkout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Midtrans Webhook Notification
     */
    public function notificationHandler(Request $request)
    {
        try {
            // Config::$serverKey sudah diset di __construct
            
            // Instance notifikasi Midtrans (akan membaca php://input)
            $notif = new \Midtrans\Notification();

            $transaction = $notif->transaction_status;
            $type = $notif->payment_type;
            $orderId = $notif->order_id;
            $fraud = $notif->fraud_status;

            // Cari transaksi berdasarkan order_id
            $trx = Transaction::where('order_id', $orderId)->first();

            if (!$trx) {
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            // Simpan log pembayaran
            PaymentLog::create([
                'order_id' => $orderId,
                'transaction_status' => $transaction,
                'payment_type' => $type,
                'raw_response' => $request->all()
            ]);

            // Tentukan status baru
            $status = null;

            if ($transaction == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $status = 'challenge';
                    } else {
                        $status = 'paid';
                    }
                }
            } else if ($transaction == 'settlement') {
                $status = 'paid';
            } else if ($transaction == 'pending') {
                $status = 'pending';
            } else if ($transaction == 'deny') {
                $status = 'failed';
            } else if ($transaction == 'expire') {
                $status = 'expired';
            } else if ($transaction == 'cancel') {
                $status = 'canceled';
            }

            // Update status transaksi jika ada perubahan status
            if ($status) {
                $trx->update([
                    'status' => $status,
                    'payment_type' => $type,
                    'payment_details' => $request->all()
                ]);

                // ✅ UPDATE: Jika pembayaran berhasil, ubah status produk menjadi 'terjual'
                if ($status === 'paid') {
                    $product = Product::find($trx->product_id);
                    if ($product) {
                        $product->update(['status' => 'terjual']);
                    }
                }
            }

            return response()->json(['message' => 'Notification processed']);

        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }

    /**
     * Get user transaction history
     */
    public function index()
    {
        $user = Auth::user();
        $transactions = Transaction::with(['product', 'seller'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }
}