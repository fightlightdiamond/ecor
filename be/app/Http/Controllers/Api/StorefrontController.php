<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ContactInquiry;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Support\StorefrontContent;
use App\Support\StorefrontLocale;
use App\Support\StorefrontCache;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;
use TomatoPHP\FilamentCms\Models\Category;
use TomatoPHP\FilamentCms\Models\Post;

class StorefrontController extends Controller
{
    public function getSite()
    {
        return response()->json([
            'success' => true,
            'data' => StorefrontContent::all(),
        ]);
    }

    public function getSitemap()
    {
        $products = Product::query()
            ->where('status', 'published')
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at'])
            ->map(fn (Product $p) => [
                'slug' => $p->slug,
                'updated_at' => $p->updated_at,
            ]);

        $posts = Post::query()
            ->where('is_published', true)
            ->orderByDesc('updated_at')
            ->get(['slug', 'updated_at'])
            ->map(fn (Post $p) => [
                'slug' => $p->slug,
                'updated_at' => $p->updated_at,
            ]);

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products,
                'posts' => $posts,
            ],
        ]);
    }

    #[OA\Get(
        path: "/api/storefront/products/featured",
        operationId: "getFeaturedProducts",
        summary: "Get featured products",
        description: "Returns list of featured products",
        tags: ["Products"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function getFeaturedProducts()
    {
        $products = Product::where('status', 'published')->latest()->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => $products->map(fn (Product $p) => $this->formatProduct($p)),
        ]);
    }

    #[OA\Get(
        path: "/api/storefront/products",
        operationId: "getProductsList",
        summary: "Get list of products",
        description: "Returns list of products",
        tags: ["Products"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function getProducts(Request $request)
    {
        $query = Product::where('status', 'published');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = min((int) $request->input('per_page', 12), 100);
        $products = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($products->items())->map(fn (Product $p) => $this->formatProduct($p)),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ],
        ]);
    }

    public function getProductBySlug($slug)
    {
        $product = Product::where('slug', $slug)->where('status', 'published')->first();
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        $related = Product::query()
            ->where('status', 'published')
            ->where('slug', '!=', $slug)
            ->when($product->category_id, fn ($q) => $q->where('category_id', $product->category_id))
            ->latest()
            ->take(3)
            ->get()
            ->map(fn (Product $p) => $this->formatProduct($p));

        return response()->json([
            'success' => true,
            'data' => $this->formatProduct($product),
            'related' => $related,
        ]);
    }

    public function getCategories(Request $request)
    {
        $locale = StorefrontLocale::fromRequest($request);
        $categories = Category::query()
            ->where('for', 'products')
            ->where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'slug' => $c->slug,
                'name' => StorefrontLocale::translate($c->getRawOriginal('name'), $locale),
            ]);

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    #[OA\Get(
        path: "/api/storefront/posts/latest",
        operationId: "getLatestPosts",
        summary: "Get latest posts",
        description: "Returns latest 3 posts",
        tags: ["Posts"],
        responses: [
            new OA\Response(response: 200, description: "Successful operation")
        ]
    )]
    public function getLatestPosts()
    {
        $posts = Post::where('is_published', true)->latest('published_at')->take(4)->get();

        return response()->json([
            'success' => true,
            'data' => $posts->map(fn (Post $p) => $this->formatPost($p)),
        ]);
    }

    public function getPosts(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 9), 50);
        $posts = Post::where('is_published', true)->latest('published_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($posts->items())->map(fn (Post $p) => $this->formatPost($p)),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
            ],
        ]);
    }

    public function getPostBySlug($slug)
    {
        $post = Post::where('slug', $slug)->where('is_published', true)->first();
        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatPost($post),
        ]);
    }

    private function getCart(string $sessionId): Cart
    {
        $cart = Cart::firstOrCreate(['session_id' => $sessionId]);
        if (auth('sanctum')->check() && !$cart->user_id) {
            $cart->update(['user_id' => auth('sanctum')->id()]);
        }

        return $cart;
    }

    public function getCartData(Request $request)
    {
        $sessionId = $request->header('X-Session-ID') ?? $request->session_id ?? session()->getId();
        $cart = $this->getCart($sessionId);
        $items = $cart->items()->with('product')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'cart' => $cart,
                'items' => $items->map(function (CartItem $item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'product' => $item->product ? $this->formatProduct($item->product) : null,
                    ];
                }),
            ],
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $product = Product::where('id', $request->product_id)->where('status', 'published')->first();
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Sản phẩm không khả dụng'], 404);
        }

        $quantity = (int) ($request->quantity ?? 1);
        $sessionId = $request->header('X-Session-ID') ?? $request->session_id ?? session()->getId();
        $cart = $this->getCart($sessionId);
        $item = $cart->items()->where('product_id', $request->product_id)->first();
        $nextQty = ($item?->quantity ?? 0) + $quantity;

        if ($nextQty > $product->stock) {
            return response()->json(['success' => false, 'message' => 'Số lượng vượt quá tồn kho'], 400);
        }

        if ($item) {
            $item->update(['quantity' => $nextQty]);
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $quantity,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Đã thêm vào giỏ hàng']);
    }

    public function updateCart(Request $request)
    {
        $item = CartItem::with('product')->find($request->item_id);
        if (!$item) {
            return response()->json(['success' => false, 'message' => 'Item not found'], 404);
        }

        if ($request->quantity > 0) {
            if ($item->product && $request->quantity > $item->product->stock) {
                return response()->json(['success' => false, 'message' => 'Số lượng vượt quá tồn kho'], 400);
            }
            $item->update(['quantity' => $request->quantity]);
        } else {
            $item->delete();
        }

        return response()->json(['success' => true, 'message' => 'Cập nhật thành công']);
    }

    public function removeFromCart(Request $request)
    {
        $item = CartItem::find($request->item_id);
        if ($item) {
            $item->delete();
        }

        return response()->json(['success' => true, 'message' => 'Đã xóa']);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'address' => 'required',
        ]);

        $sessionId = $request->header('X-Session-ID') ?? $request->session_id ?? session()->getId();
        $cart = $this->getCart($sessionId);
        $items = $cart->items()->with('product')->get();

        if ($items->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'Giỏ hàng trống'], 400);
        }

        $totalPrice = $items->sum(fn ($item) => $item->quantity * $item->product->price);

        $order = Order::create([
            'user_id' => auth('sanctum')->id(),
            'number' => 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'customer_name' => $request->name,
            'customer_phone' => $request->phone,
            'shipping_address' => $request->address,
            'total_price' => $totalPrice,
            'status' => 'new',
            'shipping_fee' => 0,
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'qty' => $item->quantity,
                'price' => $item->product->price,
            ]);
            $item->product->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();

        StorefrontCache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Đặt hàng thành công!',
            'data' => [
                'order_number' => $order->number,
            ],
        ]);
    }

    public function submitContact(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'service' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:5000',
            'source' => 'nullable|string|max:50',
        ]);

        ContactInquiry::create([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'service' => $data['service'] ?? null,
            'message' => $data['message'] ?? null,
            'source' => $data['source'] ?? 'website',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn! Chúng tôi sẽ liên hệ với bạn sớm.',
        ]);
    }

    public function lookupOrder(Request $request)
    {
        $request->validate([
            'number' => 'required|string',
            'phone' => 'required|string',
        ]);

        $phone = preg_replace('/\s+/', '', $request->phone);
        $order = Order::query()
            ->where('number', $request->number)
            ->where(function ($q) use ($request, $phone) {
                $q->where('customer_phone', $request->phone)
                    ->orWhere('customer_phone', $phone);
            })
            ->with(['items.product'])
            ->first();

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'number' => $order->number,
                'status' => $order->status,
                'total_price' => $order->total_price,
                'customer_name' => $order->customer_name,
                'shipping_address' => $order->shipping_address,
                'created_at' => $order->created_at,
                'items' => $order->items->map(fn (OrderItem $item) => [
                    'product_name' => $item->product?->name,
                    'quantity' => $item->qty,
                    'price' => $item->price,
                ]),
            ],
        ]);
    }

    private function formatProduct(Product $product): array
    {
        $images = $this->resolveImageUrls($product->images ?? []);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'in_stock' => $product->stock > 0,
            'sku' => $product->sku,
            'status' => $product->status,
            'category_id' => $product->category_id,
            'custom_fields' => $product->custom_fields ?? [],
            'features' => $product->custom_fields['features'] ?? [],
            'images' => $images,
            'image' => $images[0] ?? null,
        ];
    }

    private function formatPost(Post $post, ?string $locale = null): array
    {
        $locale = $locale ?? StorefrontLocale::fromRequest(request());
        $image = null;
        if (!empty($post->meta) && is_array($post->meta) && !empty($post->meta['image'])) {
            $image = $post->meta['image'];
        }

        if (!$image) {
            $image = 'https://images.unsplash.com/photo-1544787219-7f47ccb7fae6?q=80&w=800';
        }

        return [
            'id' => $post->id,
            'slug' => $post->slug,
            'title' => StorefrontLocale::translate($post->getRawOriginal('title'), $locale),
            'short_description' => StorefrontLocale::translate($post->getRawOriginal('short_description'), $locale),
            'body' => StorefrontLocale::translate($post->getRawOriginal('body'), $locale),
            'is_published' => $post->is_published,
            'published_at' => $post->published_at,
            'created_at' => $post->created_at,
            'image' => $image,
        ];
    }

    private function resolveImageUrls(?array $images): array
    {
        if (empty($images)) {
            return [];
        }

        return collect($images)
            ->map(function ($item) {
                if (is_string($item) && (str_starts_with($item, 'http://') || str_starts_with($item, 'https://'))) {
                    return $item;
                }
                if (is_numeric($item)) {
                    $media = \Awcodes\Curator\Models\Media::find($item);

                    return $media?->url;
                }

                return null;
            })
            ->filter()
            ->values()
            ->all();
    }
}
