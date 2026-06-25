<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ice Tea - @yield('title', 'Premium Store')</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col relative selection:bg-indigo-500 selection:text-white">

    <!-- Ambient background -->
    <div class="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-rose-100/30"></div>

    <header class="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <a href="{{ route('storefront.home') }}" class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500 tracking-tight">
                    Ice Tea
                </a>
                
                <!-- Nav Links -->
                <nav class="hidden md:flex gap-8 items-center">
                    <a href="{{ route('storefront.home') }}" class="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Home</a>
                    <a href="{{ route('storefront.shop') }}" class="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Shop</a>
                    <a href="{{ route('storefront.blog') }}" class="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Blog</a>
                    
                    @auth
                        <a href="{{ url('/admin') }}" class="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Dashboard</a>
                    @else
                        <a href="{{ url('/admin/login') }}" class="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">Login</a>
                    @endauth

                    <a href="{{ route('storefront.cart') }}" class="relative text-slate-600 hover:text-indigo-600 transition-colors p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span id="cart-count" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-rose-500 rounded-full">
                            {{ \App\Models\Cart::where('session_id', \Illuminate\Support\Facades\Session::getId())->first()?->items()->sum('quantity') ?? 0 }}
                        </span>
                    </a>
                </nav>
            </div>
        </div>
    </header>

    <main class="flex-1 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            @if(session('success'))
                <div class="mb-8 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 font-medium shadow-sm">
                    {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-8 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 font-medium shadow-sm">
                    {{ session('error') }}
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    <footer class="bg-white/80 border-t border-gray-200/60 mt-auto backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 font-medium">
            <p>&copy; {{ date('Y') }} Ice Tea. All rights reserved.</p>
        </div>
    </footer>

    <script src="{{ asset('js/storefront.js') }}"></script>
</body>
</html>
