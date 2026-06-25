@extends('layouts.storefront')

@section('title', 'Blog & Tin Tức')

@section('content')
<!-- Blog Hero Banner -->
<section class="relative bg-slate-900 rounded-[3rem] p-12 md:p-24 mb-16 overflow-hidden shadow-2xl shadow-slate-900/20 mt-8 mx-4 lg:mx-0">
    <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop" alt="Blog Banner" class="w-full h-full object-cover opacity-30 mix-blend-overlay">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
    </div>
    <div class="relative z-10 text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">Blog & Tin Tức</h1>
        <p class="text-lg md:text-xl text-slate-300">Khám phá những câu chuyện thú vị về trà, bí quyết pha chế và các xu hướng thưởng thức trà mới nhất.</p>
    </div>
</section>

<div class="container mx-auto px-4 mb-24">
    @if($posts->isEmpty())
        <div class="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" /></svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-2">Chưa có bài viết nào</h3>
            <p class="text-slate-500">Chúng tôi đang chuẩn bị những bài viết hấp dẫn. Vui lòng quay lại sau.</p>
        </div>
    @else
        <!-- Featured Post (first post) -->
        @php $featuredPost = $posts->first(); @endphp
        <div class="mb-16">
            <a href="{{ route('storefront.post', $featuredPost->slug) }}" class="group flex flex-col lg:flex-row bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                <div class="lg:w-1/2 relative overflow-hidden bg-slate-50 aspect-[4/3] lg:aspect-auto">
                    @if($featuredPost->getFirstMediaUrl('feature_image'))
                        <img src="{{ $featuredPost->getFirstMediaUrl('feature_image') }}" alt="{{ is_array($featuredPost->title) ? ($featuredPost->title[app()->getLocale()] ?? current($featuredPost->title)) : $featuredPost->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    @else
                        <div class="w-full h-full flex items-center justify-center text-slate-400 font-medium text-lg">No Image</div>
                    @endif
                    <div class="absolute top-6 left-6 z-10">
                        <span class="px-4 py-2 bg-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-full shadow-lg">Nổi Bật</span>
                    </div>
                </div>
                <div class="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                    <div class="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wide">
                        <span class="text-indigo-600 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {{ $featuredPost->created_at->format('d/m/Y') }}
                        </span>
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span>5 phút đọc</span>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight group-hover:text-indigo-600 transition-colors">{{ is_array($featuredPost->title) ? ($featuredPost->title[app()->getLocale()] ?? current($featuredPost->title)) : $featuredPost->title }}</h2>
                    <p class="text-lg text-slate-600 line-clamp-3 mb-8 leading-relaxed">{{ is_array($featuredPost->short_description) ? ($featuredPost->short_description[app()->getLocale()] ?? current($featuredPost->short_description)) : $featuredPost->short_description }}</p>
                    
                    <div class="mt-auto flex items-center gap-4">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="Admin" class="w-12 h-12 rounded-full shadow-md">
                        <div>
                            <div class="font-bold text-slate-900">Admin</div>
                            <div class="text-sm text-slate-500">Chuyên gia về trà</div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-900">Bài Viết Mới Nhất</h3>
            <div class="h-px flex-1 bg-slate-200 mx-6"></div>
        </div>

        <!-- Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($posts->skip(1) as $post)
                <a href="{{ route('storefront.post', $post->slug) }}" class="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                    <div class="relative overflow-hidden aspect-[4/3] bg-slate-50">
                        @if($post->getFirstMediaUrl('feature_image'))
                            <img src="{{ $post->getFirstMediaUrl('feature_image') }}" alt="{{ is_array($post->title) ? ($post->title[app()->getLocale()] ?? current($post->title)) : $post->title }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        @else
                            <div class="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Image</div>
                        @endif
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-8 flex flex-col flex-1 relative bg-white">
                        <!-- Author badge float -->
                        <div class="absolute -top-6 right-6 p-1 bg-white rounded-full shadow-lg">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="Admin" class="w-10 h-10 rounded-full">
                        </div>
                        
                        <div class="text-xs font-bold text-indigo-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {{ $post->created_at->format('d/m/Y') }}
                        </div>
                        <h3 class="text-2xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{{ is_array($post->title) ? ($post->title[app()->getLocale()] ?? current($post->title)) : $post->title }}</h3>
                        <p class="text-slate-500 line-clamp-3 mb-6">{{ is_array($post->short_description) ? ($post->short_description[app()->getLocale()] ?? current($post->short_description)) : $post->short_description }}</p>
                        
                        <div class="mt-auto inline-flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-3 transition-all">
                            Đọc tiếp
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>

        <div class="mt-16 flex justify-center">
            {{ $posts->links() }}
        </div>
    @endif
</div>
@endsection
