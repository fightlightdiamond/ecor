<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StorefrontController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('storefront')->middleware('storefront.cache')->group(function () {
    Route::get('/site', [StorefrontController::class, 'getSite']);
    Route::get('/sitemap', [StorefrontController::class, 'getSitemap']);
    Route::get('/categories', [StorefrontController::class, 'getCategories']);
    Route::get('/products', [StorefrontController::class, 'getProducts']);
    Route::get('/products/featured', [StorefrontController::class, 'getFeaturedProducts']);
    Route::get('/products/{slug}', [StorefrontController::class, 'getProductBySlug']);
    
    Route::get('/posts', [StorefrontController::class, 'getPosts']);
    Route::get('/posts/latest', [StorefrontController::class, 'getLatestPosts']);
    Route::get('/posts/{slug}', [StorefrontController::class, 'getPostBySlug']);
    
    Route::get('/cart', [StorefrontController::class, 'getCartData']);
    Route::get('/orders/lookup', [StorefrontController::class, 'lookupOrder']);
    Route::post('/cart/add', [StorefrontController::class, 'addToCart'])->middleware('throttle:30,1');
    Route::post('/cart/update', [StorefrontController::class, 'updateCart'])->middleware('throttle:30,1');
    Route::post('/cart/remove', [StorefrontController::class, 'removeFromCart'])->middleware('throttle:30,1');

    Route::post('/checkout', [StorefrontController::class, 'checkout'])->middleware('throttle:10,1');
    Route::post('/contact', [StorefrontController::class, 'submitContact'])->middleware('throttle:20,1');
});
