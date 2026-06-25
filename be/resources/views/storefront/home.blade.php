@extends('layouts.storefront')

@section('content')

<!-- 1.1 Hero Section -->
<section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mb-16">
    <div class="absolute inset-0 z-0">
        <!-- Abstract Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
        <div class="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-indigo-300/30 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-48 -mb-48 w-[40rem] h-[40rem] rounded-full bg-purple-300/30 blur-3xl"></div>
    </div>
    <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div class="w-full lg:w-1/2 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-6 shadow-sm border border-indigo-200">
                    <span class="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                    Mùa Trà Mới Đã Về
                </div>
                <h1 class="text-5xl lg:text-7xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
                    Khơi Dậy <br/>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Tinh Hoa</span> Trà Đạo
                </h1>
                <p class="text-lg lg:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">Khám phá bộ sưu tập trà thượng hạng được tuyển chọn kỹ lưỡng, mang đến cho bạn những phút giây thư thái và trọn vẹn nhất.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a href="{{ route('storefront.shop') }}" class="inline-flex justify-center items-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300">
                        Mua Ngay
                        <svg class="w-5 h-5 ml-2 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                    <a href="#categories" class="inline-flex justify-center items-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300">
                        Tìm Hiểu Thêm
                    </a>
                </div>
            </div>
            <div class="w-full lg:w-1/2 relative">
                <!-- Decorative Image Layout -->
                <div class="relative w-full aspect-square max-w-lg mx-auto">
                    <div class="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-[3rem] rotate-6 scale-105 opacity-50 blur-lg"></div>
                    <div class="relative h-full w-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[3rem] overflow-hidden p-4">
                        <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop" alt="Premium Tea" class="w-full h-full object-cover rounded-3xl">
                    </div>
                    <!-- Floating Badge -->
                    <div class="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 animate-bounce" style="animation-duration: 3s;">
                        <div class="flex items-center gap-4">
                            <div class="bg-green-100 p-3 rounded-full text-green-600">
                                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <div class="text-2xl font-black text-slate-900">100%</div>
                                <div class="text-sm font-semibold text-slate-500">Hữu cơ tự nhiên</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 1.2 Trust Indicators -->
<section class="mb-24 container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Miễn Phí Vận Chuyển</h3>
            <p class="text-slate-500">Cho mọi đơn hàng trên $50. Giao hàng toàn quốc.</p>
        </div>
        <div class="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Chất Lượng Thượng Hạng</h3>
            <p class="text-slate-500">100% nguyên liệu hữu cơ, an toàn cho sức khỏe.</p>
        </div>
        <div class="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Hỗ Trợ 24/7</h3>
            <p class="text-slate-500">Đội ngũ chuyên gia luôn sẵn sàng giải đáp.</p>
        </div>
        <div class="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/40 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Thanh Toán Bảo Mật</h3>
            <p class="text-slate-500">Giao dịch an toàn 100% với mã hóa SSL.</p>
        </div>
    </div>
</section>

<!-- 1.3 Shop by Category -->
<section id="categories" class="mb-24 container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
            <h2 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Khám Phá Danh Mục</h2>
            <p class="text-lg text-slate-500">Các dòng sản phẩm nổi bật của chúng tôi.</p>
        </div>
        <a href="{{ route('storefront.shop') }}" class="text-indigo-600 font-bold hover:text-indigo-800 flex items-center">
            Xem Tất Cả Danh Mục
            <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </a>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Category Card -->
        <a href="{{ route('storefront.shop', ['search' => 'Xanh']) }}" class="relative group h-80 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 block">
            <img src="https://images.unsplash.com/photo-1627492275468-b7787fbcc3b4?q=80&w=800&auto=format&fit=crop" alt="Trà Xanh" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-8 w-full">
                <h3 class="text-3xl font-black text-white mb-2">Trà Xanh</h3>
                <p class="text-slate-200 font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Thanh lọc cơ thể, tươi trẻ mỗi ngày</p>
            </div>
        </a>
        <a href="{{ route('storefront.shop', ['search' => 'Đen']) }}" class="relative group h-80 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 block">
            <img src="https://images.unsplash.com/photo-1571934811356-5cc50f160cb2?q=80&w=800&auto=format&fit=crop" alt="Trà Đen" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-8 w-full">
                <h3 class="text-3xl font-black text-white mb-2">Trà Đen</h3>
                <p class="text-slate-200 font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Hương vị đậm đà, đánh thức giác quan</p>
            </div>
        </a>
        <a href="{{ route('storefront.shop', ['search' => 'Thảo']) }}" class="relative group h-80 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 block sm:col-span-2 lg:col-span-1">
            <img src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop" alt="Trà Thảo Mộc" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-8 w-full">
                <h3 class="text-3xl font-black text-white mb-2">Trà Thảo Mộc</h3>
                <p class="text-slate-200 font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Thư giãn tinh thần, dễ đi vào giấc ngủ</p>
            </div>
        </a>
    </div>
</section>

<!-- 1.4 Featured Products -->
<section class="mb-24 container mx-auto px-4">
    <div class="flex flex-col items-center text-center mb-12">
        <h2 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Sản Phẩm Bán Chạy</h2>
        <div class="h-1 w-20 bg-indigo-600 rounded-full mb-6"></div>
        <p class="text-lg text-slate-500 max-w-2xl">Những sự lựa chọn tuyệt vời nhất được khách hàng của Ice Tea yêu thích và đánh giá cao.</p>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        @foreach($featuredProducts as $product)
            <div class="group flex flex-col bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/40 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                <!-- Badges -->
                <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    @if($loop->first)
                        <span class="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">Best Seller</span>
                    @endif
                    @if($product->stock < 10 && $product->stock > 0)
                        <span class="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">Sắp Hết</span>
                    @endif
                </div>

                <div class="relative overflow-hidden aspect-square bg-slate-100">
                    @if($product->getFeatureImageUrl())
                        <img src="{{ $product->getFeatureImageUrl() }}" alt="{{ $product->name }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    @else
                        <div class="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    @endif
                    
                    <!-- Quick Actions Overlay -->
                    <div class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                        <button onclick="addToCart({{ $product->id }})" class="p-4 bg-white text-indigo-600 rounded-full shadow-xl hover:bg-indigo-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 tooltip" title="Thêm vào giỏ">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                        <a href="{{ route('storefront.product', $product->slug) }}" class="p-4 bg-white text-slate-700 rounded-full shadow-xl hover:bg-slate-800 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="Xem chi tiết">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </a>
                    </div>
                </div>

                <div class="p-6 flex flex-col flex-1">
                    <a href="{{ route('storefront.product', $product->slug) }}">
                        <h3 class="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{{ $product->name }}</h3>
                    </a>
                    <!-- Rating Stars (Mock) -->
                    <div class="flex items-center gap-1 mb-4 text-yellow-400">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <svg class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span class="text-xs text-slate-400 ml-1">(24)</span>
                    </div>
                    <div class="mt-auto flex items-center justify-between">
                        <div class="text-2xl font-black text-indigo-600">${{ number_format($product->price, 2) }}</div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</section>

<!-- 1.5 Testimonials -->
<section class="py-24 bg-gradient-to-b from-transparent to-slate-50 mb-24 rounded-[3rem] container mx-auto px-4 relative overflow-hidden">
    <div class="absolute -right-20 -top-20 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl"></div>
    <div class="absolute -left-20 bottom-0 w-80 h-80 bg-indigo-200/50 rounded-full blur-3xl"></div>
    
    <div class="relative z-10 text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Khách Hàng Nói Về Ice Tea</h2>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">Hơn 10.000 khách hàng đã trải nghiệm và hài lòng với chất lượng sản phẩm của chúng tôi.</p>
    </div>
    
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div class="flex items-center gap-1 mb-6 text-yellow-400">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-slate-600 text-lg italic mb-6 leading-relaxed">"Trà Oolong ở đây thực sự xuất sắc. Hương vị rất tinh tế và thơm lâu. Chắc chắn tôi sẽ quay lại mua thêm."</p>
            <div class="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" class="w-12 h-12 rounded-full object-cover">
                <div>
                    <h4 class="font-bold text-slate-900">Hoàng Kim</h4>
                    <p class="text-sm text-slate-500">Doanh nhân</p>
                </div>
            </div>
        </div>
        <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div class="flex items-center gap-1 mb-6 text-yellow-400">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-slate-600 text-lg italic mb-6 leading-relaxed">"Giao hàng rất nhanh, đóng gói đẹp và sang trọng. Mình đã dùng làm quà biếu sếp và sếp rất ưng ý."</p>
            <div class="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" class="w-12 h-12 rounded-full object-cover">
                <div>
                    <h4 class="font-bold text-slate-900">Thanh Hương</h4>
                    <p class="text-sm text-slate-500">Trưởng phòng Nhân sự</p>
                </div>
            </div>
        </div>
        <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div class="flex items-center gap-1 mb-6 text-yellow-400">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-slate-600 text-lg italic mb-6 leading-relaxed">"Mình có thói quen uống trà thảo mộc mỗi tối. Từ khi biết đến Ice Tea, chất lượng giấc ngủ của mình đã cải thiện đáng kể."</p>
            <div class="flex items-center gap-4">
                <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" class="w-12 h-12 rounded-full object-cover">
                <div>
                    <h4 class="font-bold text-slate-900">Đức Minh</h4>
                    <p class="text-sm text-slate-500">Nhiếp ảnh gia</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 1.6 Latest from our Blog -->
<section class="mb-24 container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
            <h2 class="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Câu Chuyện Trà Đạo</h2>
            <p class="text-lg text-slate-500">Khám phá những kiến thức bổ ích và câu chuyện thú vị.</p>
        </div>
        <a href="{{ route('storefront.blog') }}" class="text-indigo-600 font-bold hover:text-indigo-800 flex items-center">
            Đọc Tất Cả Bài Viết
            <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        @foreach($latestPosts as $post)
            <a href="{{ route('storefront.post', $post->slug) }}" class="group flex flex-col bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/40 shadow-xl shadow-slate-200/50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div class="relative overflow-hidden aspect-[4/3]">
                    @if($post->getFirstMediaUrl('feature_image'))
                        <img src="{{ $post->getFirstMediaUrl('feature_image') }}" alt="{{ $post->title }}" class="w-full h-full object-cover bg-slate-100 group-hover:scale-110 transition-transform duration-700">
                    @else
                        <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">No Image</div>
                    @endif
                    <div class="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 font-bold text-xs uppercase tracking-wider rounded-full">
                        {{ $post->created_at->format('M d, Y') }}
                    </div>
                </div>
                <div class="p-8 flex flex-col flex-1">
                    <h3 class="text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{{ is_array($post->title) ? ($post->title[app()->getLocale()] ?? current($post->title)) : $post->title }}</h3>
                    <div class="text-slate-500 line-clamp-2 mb-6">{{ is_array($post->short_description) ? ($post->short_description[app()->getLocale()] ?? current($post->short_description)) : $post->short_description }}</div>
                    <div class="mt-auto font-bold text-indigo-600 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        Đọc tiếp <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                </div>
            </a>
        @endforeach
    </div>
</section>

<!-- 1.7 Newsletter -->
<section class="container mx-auto px-4 mb-24">
    <div class="bg-indigo-600 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl shadow-indigo-500/40 text-center">
        <!-- Abstract Bg -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div class="relative z-10 max-w-2xl mx-auto">
            <h2 class="text-4xl md:text-5xl font-black text-white mb-6">Nhận Ưu Đãi Đặc Quyền</h2>
            <p class="text-indigo-100 text-lg mb-10">Đăng ký email để nhận mã giảm giá 15% cho đơn hàng đầu tiên và cập nhật những thông tin mới nhất về trà.</p>
            <form class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input type="email" placeholder="Địa chỉ Email của bạn" class="flex-1 px-6 py-4 rounded-full border-none focus:ring-4 focus:ring-white/30 text-slate-900 text-lg outline-none" required>
                <button type="submit" class="px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg">Đăng Ký</button>
            </form>
        </div>
    </div>
</section>
@endsection
