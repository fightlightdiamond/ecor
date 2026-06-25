<?php

use App\Http\Controllers\Api\CustomerAppointmentController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\CustomerOrderController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StorefrontController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::get('/payments/vnpay/return', [PaymentController::class, 'vnpayReturn']);
Route::post('/payments/vnpay/ipn', [PaymentController::class, 'vnpayIpn']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('customer')->group(function () {
    Route::post('/register', [CustomerAuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/login', [CustomerAuthController::class, 'login'])->middleware('throttle:20,1');

    Route::middleware(['auth:sanctum', 'customer'])->group(function () {
        Route::post('/logout', [CustomerAuthController::class, 'logout']);
        Route::get('/profile', [CustomerAuthController::class, 'profile']);
        Route::get('/appointments', [CustomerAppointmentController::class, 'index']);
        Route::delete('/appointments/{id}', [CustomerAppointmentController::class, 'destroy']);
        Route::get('/orders', [CustomerOrderController::class, 'index']);
    });
});

Route::prefix('storefront')->middleware('storefront.cache')->group(function () {
    Route::get('/site', [StorefrontController::class, 'getSite']);
    Route::get('/sitemap', [StorefrontController::class, 'getSitemap']);
    Route::get('/categories', [StorefrontController::class, 'getCategories']);

    Route::get('/products', [StorefrontController::class, 'getProducts']);
    Route::get('/products/featured', [StorefrontController::class, 'getFeaturedProducts']);
    Route::get('/products/{slug}/reviews', [StorefrontController::class, 'getProductReviews']);
    Route::get('/products/{slug}', [StorefrontController::class, 'getProductBySlug']);

    Route::get('/posts', [StorefrontController::class, 'getPosts']);
    Route::get('/posts/latest', [StorefrontController::class, 'getLatestPosts']);
    Route::get('/posts/{slug}', [StorefrontController::class, 'getPostBySlug']);

    Route::get('/cart', [StorefrontController::class, 'getCartData']);
    Route::get('/orders/lookup', [StorefrontController::class, 'lookupOrder']);
    Route::post('/orders/retry-payment', [StorefrontController::class, 'retryOrderPayment'])->middleware('throttle:10,1');
    Route::get('/payment-methods', [StorefrontController::class, 'getPaymentMethods']);

    Route::post('/coupons/validate', [StorefrontController::class, 'validateCoupon'])->middleware('throttle:30,1');
    Route::get('/booking/availability', [StorefrontController::class, 'getBookingAvailability']);
    Route::post('/booking', [StorefrontController::class, 'submitBooking'])->middleware('throttle:20,1');

    Route::post('/cart/add', [StorefrontController::class, 'addToCart'])->middleware('throttle:30,1');
    Route::post('/cart/update', [StorefrontController::class, 'updateCart'])->middleware('throttle:30,1');
    Route::post('/cart/remove', [StorefrontController::class, 'removeFromCart'])->middleware('throttle:30,1');

    Route::post('/checkout', [StorefrontController::class, 'checkout'])->middleware(['sanctum.optional', 'throttle:10,1']);
    Route::post('/contact', [StorefrontController::class, 'submitContact'])->middleware('throttle:20,1');
});
