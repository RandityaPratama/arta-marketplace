<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Activity;
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

            if ($product->user_id == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak bisa membeli produk sendiri'
                ], 400);
            }

            if ($product->status !== 'aktif') {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk tidak tersedia untuk dibeli'
                ], 400);
            }

            $existingTransaction = Transaction::where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->whereIn('status', ['pending', 'challenge'])
                ->first();

            if ($existingTransaction) {
                return response()->json([
                    'success' => true,
                    'message' => 'Anda memiliki transaksi tertunda untuk produk ini',
                    'data' => [
                        'transaction_id' => $existingTransaction->id,
                        'order_id' => $existingTransaction->order_id,
                        'snap_token' => $existingTransaction->snap_token,
                        'amount' => $existingTransaction->amount,
                        'product_name' => $product->name,
                    ]
                ], 200);
            }

            $orderId = 'TRX-' . $user->id . '-' . time() . '-' . rand(100, 999);

            $transaction = Transaction::create([
                'order_id' => $orderId,
                'user_id' => $user->id,
                'product_id' => $product->id,
                'seller_id' => $product->user_id,
                'amount' => $product->price,
                'status' => 'pending',
            ]);

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
                        'name' => substr($product->name, 0, 50),
                    ]
                ]
            ];

            $snapToken = Snap::getSnapToken($params);
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

    public function notificationHandler(Request $request)
    {
        try {
            $requestData = $request->all();

            $transaction = $requestData['transaction_status'] ?? null;
            $type = $requestData['payment_type'] ?? null;
            $orderId = $requestData['order_id'] ?? null;
            $fraud = $requestData['fraud_status'] ?? null;

            if (!$orderId || !$transaction) {
                try {
                    $notif = new \Midtrans\Notification();
                    if (!$orderId) $orderId = $notif->order_id ?? null;
                    if (!$transaction) $transaction = $notif->transaction_status ?? null;
                    if (!$type) $type = $notif->payment_type ?? null;
                    if (!isset($fraud)) $fraud = $notif->fraud_status ?? null;
                } catch (\Exception $e) {
                    Log::warning('Midtrans SDK failed, using request data only', [
                        'error' => $e->getMessage(),
                        'request_data' => $requestData
                    ]);
                }
            }

            if (!$orderId) {
                Log::warning('Midtrans notification received without order_id', [
                    'request_data' => $requestData
                ]);
                return response()->json(['message' => 'Invalid notification data: missing order_id'], 400);
            }

            if (!$transaction) {
                Log::warning('Midtrans notification received without transaction_status', [
                    'order_id' => $orderId,
                    'request_data' => $requestData
                ]);
                return response()->json(['message' => 'Invalid notification data: missing transaction_status'], 400);
            }

            $trx = Transaction::where('order_id', $orderId)->first();

            if (!$trx) {
                Log::warning('Transaction not found for order_id: ' . $orderId);
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            PaymentLog::create([
                'order_id' => $orderId,
                'transaction_status' => $transaction,
                'payment_type' => $type,
                'raw_response' => $request->all()
            ]);

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

            if ($status) {
                $trx->update([
                    'status' => $status,
                    'payment_type' => $type,
                    'payment_details' => $request->all()
                ]);

                if ($status === 'paid') {
                    $product = Product::find($trx->product_id);
                    if ($product) {
                        $product->update(['status' => 'terjual']);

                        \App\Services\NotificationService::createPaymentSuccessNotification(
                            $trx->user_id,
                            $product->name
                        );

                        \App\Services\NotificationService::createProductSoldNotification(
                            $trx->seller_id,
                            $product->name
                        );

                        try {
                            $user = \App\Models\User::find($trx->user_id);
                            if ($user) {
                                Activity::create([
                                    'user_id' => $user->id,
                                    'action' => $user->name . ' membeli produk ' . $product->name,
                                    'type' => 'transaksi',
                                ]);
                            }
                        } catch (\Exception $e) {
                            Log::error('Gagal mencatat aktivitas pembelian', ['error' => $e->getMessage()]);
                        }
                    }
                }
            }

            return response()->json(['message' => 'Notification processed']);

        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }

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
