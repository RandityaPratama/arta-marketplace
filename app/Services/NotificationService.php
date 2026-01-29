<?php

namespace App\Services;

use App\Models\Notification;
use App\Events\NotificationSent;

class NotificationService
{
    const TYPE_CHAT = 'chat';
    const TYPE_LIKE = 'like';
    const TYPE_OFFER = 'offer';
    const TYPE_TRANSACTION = 'transaction';
    const TYPE_SYSTEM = 'system';

    protected static $templates = [
        self::TYPE_CHAT => [
            'title' => 'Pesan Baru',
            'message' => '{sender_name} mengirim pesan baru',
            'link' => '/chat/{conversation_id}',
        ],
        self::TYPE_LIKE => [
            'title' => 'Produk Disukai',
            'message' => 'Produk \'{product_name}\' Anda disukai oleh {user_name}',
            'link' => '/product/{product_id}',
        ],
        self::TYPE_OFFER => [
            'title' => 'Penawaran Baru',
            'message' => '{buyer_name} memberikan penawaran untuk produk \'{product_name}\'',
            'link' => '/product/{product_id}',
        ],
        self::TYPE_TRANSACTION => [
            'title' => 'Transaksi Baru',
            'message' => 'Produk \'{product_name}\' Anda memiliki pembeli baru',
            'link' => '/profile',
        ],
        self::TYPE_SYSTEM => [
            'title' => 'Notifikasi Sistem',
            'message' => '{message}',
            'link' => '/profile',
        ],
    ];

    public static function create($userId, $type, $data = [])
    {
        if (!isset(self::$templates[$type])) {
            throw new \InvalidArgumentException("Invalid notification type: {$type}");
        }

        $template = self::$templates[$type];

        // ✅ Allow title override from data, otherwise use template
        $title = isset($data['title']) ? $data['title'] : $template['title'];
        $message = isset($data['message']) ? $data['message'] : $template['message'];
        $link = isset($data['link']) ? $data['link'] : $template['link'];

        // Apply placeholder replacement
        $title = self::replacePlaceholders($title, $data);
        $message = self::replacePlaceholders($message, $data);
        $link = self::replacePlaceholders($link, $data);

        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'link' => $link,
        ]);

        broadcast(new NotificationSent($notification));

        return $notification;
    }

    public static function createChatNotification($recipientId, $senderName, $conversationId)
    {
        return self::create($recipientId, self::TYPE_CHAT, [
            'sender_name' => $senderName,
            'conversation_id' => $conversationId,
        ]);
    }

    public static function createLikeNotification($sellerId, $userName, $productName, $productId)
    {
        return self::create($sellerId, self::TYPE_LIKE, [
            'user_name' => $userName,
            'product_name' => $productName,
            'product_id' => $productId,
        ]);
    }

    public static function createOfferNotification($sellerId, $buyerName, $productName, $productId)
    {
        return self::create($sellerId, self::TYPE_OFFER, [
            'buyer_name' => $buyerName,
            'product_name' => $productName,
            'product_id' => $productId,
        ]);
    }

    public static function createTransactionNotification($sellerId, $productName)
    {
        return self::create($sellerId, self::TYPE_TRANSACTION, [
            'product_name' => $productName,
        ]);
    }

    public static function createPaymentSuccessNotification($buyerId, $productName)
    {
        return self::create($buyerId, self::TYPE_TRANSACTION, [
            'title' => 'Pembayaran Berhasil',
            'message' => 'Pembayaran untuk produk \'{product_name}\' telah berhasil. Silakan cek riwayat pembelian.',
            'link' => '/history',
            'product_name' => $productName,
        ]);
    }

    public static function createProductSoldNotification($sellerId, $productName)
    {
        return self::create($sellerId, self::TYPE_TRANSACTION, [
            'title' => 'Produk Terjual',
            'message' => 'Produk \'{product_name}\' Anda telah terjual',
            'link' => '/profile',
            'product_name' => $productName,
        ]);
    }

    public static function createSystemNotification($userId, $message, $link = '/profile')
    {
        return self::create($userId, self::TYPE_SYSTEM, [
            'message' => $message,
            'link' => $link,
        ]);
    }

    public static function createReportResolvedNotification($reporterId)
    {
        return self::create($reporterId, self::TYPE_SYSTEM, [
            'title' => 'Laporan Direspons',
            'message' => 'Laporan Anda telah ditangani oleh admin',
            'link' => '/profile',
        ]);
    }

    protected static function replacePlaceholders($template, $data)
    {
        foreach ($data as $key => $value) {
            $template = str_replace('{' . $key . '}', $value, $template);
        }
        return $template;
    }
}
