@extends('layouts.storefront')

@section('title', is_array($post->title) ? ($post->title[app()->getLocale()] ?? current($post->title)) : $post->title)

@section('content')
<div class="mb-20 mt-8">
    <!-- Hero Image for Article -->
    <div class="max-w-5xl mx-auto px-4 lg:px-0 mb-12">
        <div class="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 mb-12 bg-slate-100">
            @if($post->getFirstMediaUrl('feature_image'))
                <img src="{{ $post->getFirstMediaUrl('feature_image') }}" alt="Feature" class="w-full h-full object-cover">
            @else
                <div class="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-xl">No Cover Image</div>
            @endif
        </div>

        <!-- Article Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
            <div class="inline-flex items-center gap-3 text-sm font-bold text-indigo-600 mb-6 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {{ $post->created_at->format('d/m/Y') }}
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 tracking-tight text-slate-900">{{ is_array($post->title) ? ($post->title[app()->getLocale()] ?? current($post->title)) : $post->title }}</h1>
            
            <div class="flex items-center justify-center gap-6 text-left">
                <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="Admin" class="w-14 h-14 rounded-full shadow-lg border-2 border-white">
                <div>
                    <div class="font-bold text-lg text-slate-900">Viết bởi Admin</div>
                    <div class="text-sm font-medium text-slate-500">Chuyên gia ẩm thực & Trà đạo</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Article Body & Sidebar layout -->
    <div class="max-w-5xl mx-auto px-4 lg:px-0">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            <!-- Main Content -->
            <div class="w-full lg:w-3/4">
                <div class="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div class="prose prose-slate prose-lg md:prose-xl max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight 
                        prose-h2:text-3xl prose-h3:text-2xl
                        prose-a:text-indigo-600 hover:prose-a:text-indigo-500 
                        prose-img:rounded-2xl prose-img:shadow-lg
                        prose-p:leading-relaxed text-slate-600">
                        {!! is_array($post->body) ? ($post->body[app()->getLocale()] ?? current($post->body)) : $post->body !!}
                    </div>
                </div>

                <!-- Tags & Share -->
                <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 py-6 border-t border-slate-200">
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-slate-900">Tags:</span>
                        <a href="#" class="px-4 py-1.5 bg-slate-100 text-slate-600 font-medium rounded-full hover:bg-slate-200 transition-colors">Trà Đạo</a>
                        <a href="#" class="px-4 py-1.5 bg-slate-100 text-slate-600 font-medium rounded-full hover:bg-slate-200 transition-colors">Sức Khỏe</a>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <span class="font-bold text-slate-900">Chia sẻ:</span>
                        <a href="#" class="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" class="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors shadow-lg">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="w-full lg:w-1/4">
                <div class="sticky top-8">
                    <div class="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 mb-8">
                        <h3 class="font-black text-xl text-slate-900 mb-4">Đăng ký nhận tin</h3>
                        <p class="text-slate-600 text-sm mb-6">Nhận thông báo về các bài viết mới nhất và ưu đãi đặc biệt.</p>
                        <form class="flex flex-col gap-3">
                            <input type="email" placeholder="Email của bạn" class="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                            <button type="button" class="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md">Đăng ký</button>
                        </form>
                    </div>

                    <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/30">
                        <h3 class="font-black text-xl text-slate-900 mb-6">Bài viết liên quan</h3>
                        <div class="flex flex-col gap-6">
                            <!-- Mock Related Posts -->
                            <a href="#" class="group flex gap-4 items-center">
                                <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?q=80&w=200&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">Bí quyết pha trà xanh chuẩn vị hoàng gia</h4>
                                    <span class="text-xs font-medium text-slate-500 mt-1">12/05/2026</span>
                                </div>
                            </a>
                            <a href="#" class="group flex gap-4 items-center">
                                <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?q=80&w=200&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">Công dụng tuyệt vời của trà đen</h4>
                                    <span class="text-xs font-medium text-slate-500 mt-1">05/05/2026</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
