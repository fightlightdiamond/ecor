@extends('layouts.storefront')

@section('title', 'Cửa hàng')

@section('content')

<!-- Shop Hero Banner -->
<section class="relative bg-indigo-900 rounded-[3rem] p-12 md:p-24 mb-16 overflow-hidden shadow-2xl shadow-indigo-900/20 mt-8 mx-4 lg:mx-0">
    <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=2000&auto=format&fit=crop" alt="Shop Banner" class="w-full h-full object-cover opacity-30 mix-blend-overlay">
        <div class="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/60 to-transparent"></div>
    </div>
    <div class="relative z-10 text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">Cửa Hàng Ice Tea</h1>
        <p class="text-lg md:text-xl text-indigo-200">Khám phá thế giới trà đa dạng với chất lượng thượng hạng, mang đến trải nghiệm tuyệt vời nhất cho bạn.</p>
    </div>
</section>

<div class="container mx-auto px-4 mb-24">
    <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-1/4 flex-shrink-0">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 sticky top-8">
                <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Bộ Lọc
                </h3>
                
                <form method="GET" action="{{ route('storefront.shop') }}">
                    <!-- Search -->
                    <div class="mb-8">
                        <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Tìm kiếm</label>
                        <div class="relative">
                            <input type="text" name="search" class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-shadow outline-none" placeholder="Tên sản phẩm..." value="{{ request('search') }}">
                            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <!-- Categories (Static Mock) -->
                    <div class="mb-8">
                        <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Danh mục</label>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked>
                                <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">Tất cả sản phẩm</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                                <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">Trà Xanh (12)</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                                <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">Trà Đen (8)</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                                <span class="text-slate-600 group-hover:text-indigo-600 transition-colors">Trà Thảo Mộc (15)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Price Range (Static Mock) -->
                    <div class="mb-8">
                        <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Mức giá</label>
                        <div class="space-y-4">
                            <input type="range" min="0" max="100" class="w-full accent-indigo-600">
                            <div class="flex items-center justify-between text-sm text-slate-500 font-medium">
                                <span>$0</span>
                                <span>$100+</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">Áp Dụng Chỉnh Sửa</button>
                </form>
            </div>
        </aside>

        <!-- Product Grid -->
        <main class="w-full lg:w-3/4">
            <!-- Top Bar -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div class="text-slate-500 font-medium">
                    Hiển thị <span class="font-bold text-slate-900">{{ $products->count() }}</span> / <span class="font-bold text-slate-900">{{ $products->total() }}</span> sản phẩm
                </div>
                <div class="flex items-center gap-4">
                    <label class="text-slate-600 font-medium">Sắp xếp theo:</label>
                    <select class="pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700 cursor-pointer">
                        <option value="newest">Mới nhất</option>
                        <option value="price_asc">Giá: Thấp đến Cao</option>
                        <option value="price_desc">Giá: Cao đến Thấp</option>
                        <option value="popular">Bán chạy nhất</option>
                    </select>
                </div>
            </div>

            @if($products->isEmpty())
                <div class="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h3>
                    <p class="text-slate-500">Vui lòng thử nghiệm với từ khóa hoặc bộ lọc khác.</p>
                </div>
            @else
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($products as $product)
                        <div class="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                            <!-- Badges -->
                            <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                @if($loop->first)
                                    <span class="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">Hot</span>
                                @endif
                            </div>

                            <div class="relative overflow-hidden aspect-[4/5] bg-slate-50">
                                @if($product->getFeatureImageUrl())
                                    <img src="{{ $product->getFeatureImageUrl() }}" alt="{{ $product->name }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                @else
                                    <div class="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                @endif
                                
                                <!-- Quick Actions Overlay -->
                                <div class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                    <button onclick="addToCart({{ $product->id }})" class="w-12 h-12 flex items-center justify-center bg-white text-indigo-600 rounded-full shadow-xl hover:bg-indigo-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 tooltip" title="Thêm vào giỏ">
                                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </button>
                                    <a href="{{ route('storefront.product', $product->slug) }}" class="w-12 h-12 flex items-center justify-center bg-white text-slate-700 rounded-full shadow-xl hover:bg-slate-800 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="Xem chi tiết">
                                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </a>
                                </div>
                            </div>

                            <div class="p-6 flex flex-col flex-1">
                                <!-- Category mock -->
                                <div class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Trà Hảo Hạng</div>
                                <a href="{{ route('storefront.product', $product->slug) }}">
                                    <h3 class="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{{ $product->name }}</h3>
                                </a>
                                <div class="flex items-center gap-1 mb-4 text-yellow-400">
                                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <svg class="w-4 h-4 fill-current text-slate-300" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                </div>
                                <div class="mt-auto flex items-end justify-between">
                                    <div>
                                        <div class="text-sm text-slate-500 line-through mb-1">${{ number_format($product->price * 1.2, 2) }}</div>
                                        <div class="text-2xl font-black text-slate-900">${{ number_format($product->price, 2) }}</div>
                                    </div>
                                    <button onclick="addToCart({{ $product->id }})" class="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-lg">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="mt-16 flex justify-center">
                    {{ $products->links() }}
                </div>
            @endif
        </main>
    </div>
</div>
@endsection
