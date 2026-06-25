<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use TomatoPHP\FilamentCms\Models\Post;
use Illuminate\Support\Facades\Session;

class StorefrontController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::where('status', 'published')->take(4)->get();
        $latestPosts = Post::where('is_published', true)->latest()->take(3)->get();
        return view('storefront.home', compact('featuredProducts', 'latestPosts'));
    }

    public function shop(Request $request)
    {
        $query = Product::where('status', 'published');
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $products = $query->paginate(12);
        return view('storefront.shop.index', compact('products'));
    }

    public function product($slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        return view('storefront.shop.show', compact('product'));
    }

    public function blog()
    {
        $posts = Post::where('is_published', true)->latest()->paginate(9);
        return view('storefront.blog.index', compact('posts'));
    }

    public function post($slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        return view('storefront.blog.show', compact('post'));
    }

    private function getCart()
    {
        $sessionId = Session::getId();
        $cart = Cart::firstOrCreate(['session_id' => $sessionId]);
        if (auth()->check() && !$cart->user_id) {
            $cart->update(['user_id' => auth()->id()]);
        }
        return $cart;
    }

    public function cart()
    {
        $cart = $this->getCart();
        $items = $cart->items()->with('product')->get();
        return view('storefront.cart.index', compact('cart', 'items'));
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1'
        ]);

        $cart = $this->getCart();
        $item = $cart->items()->where('product_id', $request->product_id)->first();

        if ($item) {
            $item->increment('quantity', $request->quantity ?? 1);
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity ?? 1
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Đã thêm vào giỏ hàng']);
    }

    public function updateCart(Request $request)
    {
        $item = CartItem::findOrFail($request->item_id);
        if ($request->quantity > 0) {
            $item->update(['quantity' => $request->quantity]);
        } else {
            $item->delete();
        }
        return response()->json(['success' => true]);
    }

    public function removeFromCart(Request $request)
    {
        $item = CartItem::findOrFail($request->item_id);
        $item->delete();
        return response()->json(['success' => true]);
    }

    public function checkout()
    {
        $cart = $this->getCart();
        $items = $cart->items()->with('product')->get();
        if ($items->isEmpty()) {
            return redirect()->route('storefront.cart')->with('error', 'Giỏ hàng trống');
        }
        return view('storefront.checkout.index', compact('cart', 'items'));
    }

    public function processCheckout(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'address' => 'required'
        ]);

        $cart = $this->getCart();
        $items = $cart->items()->with('product')->get();
        if ($items->isEmpty()) {
            return redirect()->route('storefront.cart')->with('error', 'Giỏ hàng trống');
        }

        $totalPrice = $items->sum(function($item) {
            return $item->quantity * $item->product->price;
        });

        $order = Order::create([
            'user_id' => auth()->id() ?? null,
            'total_price' => $totalPrice,
            'status' => 'new',
            'shipping_fee' => 0,
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->product->price,
            ]);
            // Reduce stock
            $item->product->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();

        return redirect()->route('storefront.home')->with('success', 'Đặt hàng thành công!');
    }
}
