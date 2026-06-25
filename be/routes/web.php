<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StorefrontController;

Route::get('/', [StorefrontController::class, 'index'])->name('storefront.home');
Route::get('/shop', [StorefrontController::class, 'shop'])->name('storefront.shop');
Route::get('/shop/{slug}', [StorefrontController::class, 'product'])->name('storefront.product');
Route::get('/blog', [StorefrontController::class, 'blog'])->name('storefront.blog');
Route::get('/blog/{slug}', [StorefrontController::class, 'post'])->name('storefront.post');
Route::get('/cart', [StorefrontController::class, 'cart'])->name('storefront.cart');
Route::post('/cart/add', [StorefrontController::class, 'addToCart'])->name('storefront.cart.add');
Route::post('/cart/update', [StorefrontController::class, 'updateCart'])->name('storefront.cart.update');
Route::post('/cart/remove', [StorefrontController::class, 'removeFromCart'])->name('storefront.cart.remove');
Route::get('/checkout', [StorefrontController::class, 'checkout'])->name('storefront.checkout');
Route::post('/checkout', [StorefrontController::class, 'processCheckout'])->name('storefront.checkout.process');
