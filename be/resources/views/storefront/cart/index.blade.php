@extends('layouts.storefront')

@section('title', 'Your Cart')

@section('content')
<div class="mb-12 mt-8">
    <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-10">Your Cart</h1>

    @if($items->isEmpty())
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-16 text-center border border-white/40 shadow-xl shadow-slate-200/50">
            <svg class="w-16 h-16 mx-auto text-slate-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="text-2xl font-bold text-slate-700 mb-6">Your cart is empty</h3>
            <a href="{{ route('storefront.shop') }}" class="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200">Continue Shopping</a>
        </div>
    @else
        <div class="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-xl shadow-slate-200/50">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b-2 border-gray-200 text-slate-500">
                            <th class="py-4 px-4 font-bold uppercase tracking-wider text-sm">Product</th>
                            <th class="py-4 px-4 font-bold uppercase tracking-wider text-sm">Price</th>
                            <th class="py-4 px-4 font-bold uppercase tracking-wider text-sm">Quantity</th>
                            <th class="py-4 px-4 font-bold uppercase tracking-wider text-sm">Total</th>
                            <th class="py-4 px-4 font-bold uppercase tracking-wider text-sm"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @php $total = 0; @endphp
                        @foreach($items as $item)
                            @php 
                                $itemTotal = $item->quantity * $item->product->price;
                                $total += $itemTotal;
                            @endphp
                            <tr id="cart-item-{{ $item->id }}" class="group hover:bg-slate-50/50 transition-colors">
                                <td class="py-6 px-4">
                                    <div class="flex items-center gap-4">
                                        @if($item->product->getFeatureImageUrl())
                                            <img src="{{ $item->product->getFeatureImageUrl() }}" class="w-20 h-20 rounded-2xl object-cover shadow-sm bg-slate-100">
                                        @else
                                            <div class="w-20 h-20 rounded-2xl bg-slate-100 border border-gray-200"></div>
                                        @endif
                                        <a href="{{ route('storefront.product', $item->product->slug) }}" class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{{ $item->product->name }}</a>
                                    </div>
                                </td>
                                <td class="py-6 px-4 text-lg font-semibold text-slate-600">${{ number_format($item->product->price, 2) }}</td>
                                <td class="py-6 px-4">
                                    <input type="number" class="w-20 px-3 py-2 text-center font-bold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" value="{{ $item->quantity }}" min="1" max="{{ $item->product->stock }}" onchange="updateCart({{ $item->id }}, this.value)">
                                </td>
                                <td class="py-6 px-4"><strong class="text-xl text-indigo-600">${{ number_format($itemTotal, 2) }}</strong></td>
                                <td class="py-6 px-4 text-right">
                                    <button class="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" onclick="removeFromCart({{ $item->id }})">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            
            <div class="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="text-3xl font-black text-slate-900">
                    Total: <span class="text-indigo-600">${{ number_format($total, 2) }}</span>
                </div>
                <a href="{{ route('storefront.checkout') }}" class="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300">
                    Proceed to Checkout
                </a>
            </div>
        </div>
    @endif
</div>
@endsection
