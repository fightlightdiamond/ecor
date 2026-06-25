<?php

return [
    'frontend_url' => env('STOREFRONT_FRONTEND_URL', 'http://localhost:3000'),

    'vnpay' => [
        'enabled' => env('VNPAY_ENABLED', false),
        'tmn_code' => env('VNPAY_TMN_CODE'),
        'hash_secret' => env('VNPAY_HASH_SECRET'),
        'url' => env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
        'return_url' => env('VNPAY_RETURN_URL'),
        'ipn_url' => env('VNPAY_IPN_URL'),
        'expiry_minutes' => (int) env('VNPAY_EXPIRY_MINUTES', 15),
    ],
];
