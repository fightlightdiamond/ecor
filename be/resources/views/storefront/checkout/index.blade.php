@extends('layouts.storefront')

@section('title', 'Checkout')

@section('content')
<div class="mb-12 mt-8">
    <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-10">Checkout</h1>

    <div class="flex flex-col lg:flex-row gap-12 items-start">
        <div class="w-full lg:w-2/3">
            <div class="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-xl shadow-slate-200/50">
                <h3 class="text-2xl font-bold text-slate-900 mb-8">Shipping Details</h3>
                <form action="{{ route('storefront.checkout.process') }}" method="POST">
                    @csrf
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input type="text" name="name" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required value="{{ auth()->user()->name ?? '' }}">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                        <input type="text" name="phone" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required>
                    </div>
                    <div class="mb-10">
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
                        <textarea name="address" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" rows="3" required></textarea>
                    </div>
                    
                    <h3 class="text-2xl font-bold text-slate-900 mb-6">Payment Method</h3>
                    <div class="mb-10">
                        <label class="flex items-center gap-4 p-6 border-2 border-indigo-500 rounded-2xl bg-indigo-50/50 cursor-pointer">
                            <input type="radio" name="payment_method" value="cod" checked class="w-5 h-5 text-indigo-600 focus:ring-indigo-500">
                            <span class="font-bold text-lg text-slate-900">Cash on Delivery (COD)</span>
                        </label>
                    </div>

                    <button type="submit" class="w-full py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200">
                        Complete Order
                    </button>
                </form>
            </div>
        </div>
        
        <div class="w-full lg:w-1/3 sticky top-24">
            <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl shadow-slate-200/50">
                <h3 class="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                <div class="flex flex-col gap-4 mb-8">
                    @php $total = 0; @endphp
                    @foreach($items as $item)
                        @php $total += $item->quantity * $item->product->price; @endphp
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                @if($item->product->getFeatureImageUrl())
                                    <img src="{{ $item->product->getFeatureImageUrl() }}" class="w-12 h-12 rounded-xl object-cover">
                                @endif
                                <div class="font-semibold text-slate-600">{{ $item->product->name }} <span class="text-sm text-indigo-600 font-bold ml-1">x{{ $item->quantity }}</span></div>
                            </div>
                            <div class="font-bold text-slate-900">${{ number_format($item->quantity * $item->product->price, 2) }}</div>
                        </div>
                    @endforeach
                </div>
                
                <div class="pt-6 border-t border-dashed border-gray-300 flex justify-between items-center text-xl font-black">
                    <div class="text-slate-900">Total</div>
                    <div class="text-indigo-600 text-2xl">${{ number_format($total, 2) }}</div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
