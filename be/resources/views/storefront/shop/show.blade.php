@extends('layouts.storefront')

@section('title', $product->name)

@section('content')
<div class="mb-12 mt-8">
    <!-- Breadcrumb -->
    <nav class="flex text-sm text-slate-500 font-medium mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
                <a href="{{ route('storefront.home') }}" class="hover:text-indigo-600 transition-colors">Trang chủ</a>
            </li>
            <li>
                <div class="flex items-center">
                    <svg class="w-4 h-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    <a href="{{ route('storefront.shop') }}" class="hover:text-indigo-600 transition-colors">Cửa hàng</a>
                </div>
            </li>
            <li aria-current="page">
                <div class="flex items-center">
                    <svg class="w-4 h-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    <span class="text-slate-900">{{ $product->name }}</span>
                </div>
            </li>
        </ol>
    </nav>

    <div class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        <!-- Image Gallery -->
        <div class="w-full lg:w-1/2">
            <div class="bg-white rounded-[2rem] p-4 sm:p-8 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
                <div class="absolute top-6 left-6 z-10">
                    <span class="px-4 py-2 bg-white/90 backdrop-blur-sm text-indigo-600 font-black text-sm uppercase tracking-wider rounded-full shadow-lg">Mới Hái</span>
                </div>
                
                <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    @if($product->getFeatureImageUrl())
                        <img src="{{ $product->getFeatureImageUrl() }}" alt="{{ $product->name }}" id="main-product-image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    @else
                        <div class="w-full h-full flex items-center justify-center text-slate-400 font-medium text-lg">No Image</div>
                    @endif
                </div>

                <!-- Thumbnails (Static Mock for now, use loop if multiple images exist) -->
                <div class="grid grid-cols-4 gap-4">
                    @if($product->getFeatureImageUrl())
                        <div class="aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 border-indigo-600 cursor-pointer">
                            <img src="{{ $product->getFeatureImageUrl() }}" class="w-full h-full object-cover opacity-100">
                        </div>
                        <div class="aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 border-transparent hover:border-indigo-300 cursor-pointer opacity-70 hover:opacity-100 transition-all">
                            <img src="https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?q=80&w=200&auto=format&fit=crop" class="w-full h-full object-cover">
                        </div>
                        <div class="aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 border-transparent hover:border-indigo-300 cursor-pointer opacity-70 hover:opacity-100 transition-all">
                            <img src="https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?q=80&w=200&auto=format&fit=crop" class="w-full h-full object-cover">
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Product Info -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center">
            <!-- Review Mock -->
            <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center text-yellow-400">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <span class="text-sm text-slate-500 font-medium">(128 Đánh giá)</span>
            </div>

            <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{{ $product->name }}</h1>
            
            <div class="flex items-end gap-4 mb-8">
                <div class="text-4xl font-black text-indigo-600">${{ number_format($product->price, 2) }}</div>
                <div class="text-xl font-medium text-slate-400 line-through mb-1">${{ number_format($product->price * 1.2, 2) }}</div>
            </div>
            
            <!-- Quick features -->
            <ul class="space-y-3 mb-10 text-slate-600 font-medium">
                <li class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    100% Nguyên liệu hữu cơ tự nhiên
                </li>
                <li class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Quy trình thu hoạch thủ công
                </li>
                <li class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Đóng gói cao cấp, giữ trọn hương vị
                </li>
            </ul>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
                <div class="flex items-center gap-4 mb-4">
                    @if($product->stock > 0)
                        <div class="flex items-center gap-2 text-green-700 font-bold bg-green-100 px-3 py-1.5 rounded-lg text-sm">
                            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Còn Hàng ({{ $product->stock }})
                        </div>
                    @else
                        <div class="flex items-center gap-2 text-red-700 font-bold bg-red-100 px-3 py-1.5 rounded-lg text-sm">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Hết Hàng
                        </div>
                    @endif
                    <div class="text-sm font-medium text-slate-500 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Giao hàng trong 24h
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Số lượng</label>
                        <div class="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden h-14 w-32">
                            <button type="button" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors" onclick="document.getElementById('qty-{{ $product->id }}').stepDown()">-</button>
                            <input type="number" id="qty-{{ $product->id }}" class="w-12 h-full text-center font-bold text-lg text-slate-900 border-none focus:ring-0 appearance-none bg-transparent" value="1" min="1" max="{{ $product->stock }}">
                            <button type="button" class="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors" onclick="document.getElementById('qty-{{ $product->id }}').stepUp()">+</button>
                        </div>
                    </div>
                    <button class="flex-1 h-14 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1" onclick="addToCart({{ $product->id }})" @if($product->stock <= 0) disabled @endif>
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Thêm Vào Giỏ
                    </button>
                </div>
            </div>

            <!-- Trust Badges -->
            <div class="grid grid-cols-2 gap-4 py-6 border-t border-b border-slate-200 mb-8">
                <div class="flex items-center gap-3 text-slate-600 font-medium">
                    <svg class="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Thanh toán an toàn
                </div>
                <div class="flex items-center gap-3 text-slate-600 font-medium">
                    <svg class="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    Đổi trả trong 7 ngày
                </div>
            </div>

        </div>
    </div>

    <!-- Product Details Tabs -->
    <div class="mt-24 max-w-4xl mx-auto">
        <div class="flex items-center justify-center gap-8 border-b border-slate-200 mb-10 px-4">
            <button class="pb-4 text-lg font-black text-indigo-600 border-b-4 border-indigo-600">Mô Tả Sản Phẩm</button>
            <button class="pb-4 text-lg font-bold text-slate-400 hover:text-slate-600 border-b-4 border-transparent transition-colors">Thông Số Chi Tiết</button>
            <button class="pb-4 text-lg font-bold text-slate-400 hover:text-slate-600 border-b-4 border-transparent transition-colors">Hướng Dẫn Pha Trà</button>
        </div>
        <div class="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed px-4">
            {!! $product->description !!}
        </div>
    </div>
</div>
@endsection
