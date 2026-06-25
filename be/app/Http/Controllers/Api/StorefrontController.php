<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Concerns\ManagesStorefrontExtras;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ContactInquiry;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\Storefront\CouponService;
use App\Services\Payment\VNPayService;
use App\Support\OrderPresenter;
use App\Support\ProductPresenter;
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
    use ManagesStorefrontExtras;

    #[OA\Get(
        path: '/api/storefront/site',
        operationId: 'getSiteBundle',
        summary: 'Get site content bundle',
        description: 'Returns settings, team, services, gallery and testimonials JSON for the storefront.',
        tags: ['Site'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/LangQuery')],
        responses: [new OA\Response(response: 200, description: 'Site bundle', content: new OA\JsonContent(ref: '#/components/schemas/ApiSuccessEnvelope'))]
    )]
    public function getSite()
    {
        return response()->json([
            'success' => true,
            'data' => StorefrontContent::all(),
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/sitemap',
        operationId: 'getSitemap',
        summary: 'Sitemap slugs',
        description: 'Product and blog post slugs with updated_at for XML sitemap generation.',
        tags: ['Site'],
        responses: [new OA\Response(response: 200, description: 'Sitemap data')]
    )]
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
        path: '/api/storefront/products/featured',
        operationId: 'getFeaturedProducts',
        summary: 'Get featured products',
        tags: ['Products'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/LangQuery')],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Featured products',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean'),
                        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Product')),
                    ]
                )
            ),
        ]
    )]
    public function getFeaturedProducts(Request $request)
    {
        $locale = StorefrontLocale::fromRequest($request);
        $products = Product::where('status', 'published')->latest()->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => $products->map(fn (Product $p) => $this->formatProduct($p, $locale)),
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/products',
        operationId: 'getProductsList',
        summary: 'List products',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
            new OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'category_id', in: 'query', schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer', default: 12, maximum: 100)),
        ],
        responses: [new OA\Response(response: 200, description: 'Paginated product list')]
    )]
    public function getProducts(Request $request)
    {
        $locale = StorefrontLocale::fromRequest($request);
        $query = Product::where('status', 'published');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('translations->vi->name', 'like', '%' . $search . '%')
                    ->orWhere('translations->en->name', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = min((int) $request->input('per_page', 12), 100);
        $products = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($products->items())->map(fn (Product $p) => $this->formatProduct($p, $locale)),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/products/{slug}',
        operationId: 'getProductBySlug',
        summary: 'Product detail',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
            new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Product with related items'),
            new OA\Response(response: 404, description: 'Not found'),
        ]
    )]
    public function getProductBySlug(Request $request, $slug)
    {
        $locale = StorefrontLocale::fromRequest($request);
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
            ->map(fn (Product $p) => $this->formatProduct($p, $locale));

        return response()->json([
            'success' => true,
            'data' => $this->formatProduct($product, $locale),
            'related' => $related,
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/categories',
        operationId: 'getCategories',
        summary: 'Product categories',
        tags: ['Products'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/LangQuery')],
        responses: [new OA\Response(response: 200, description: 'Category list')]
    )]
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
        path: '/api/storefront/posts/latest',
        operationId: 'getLatestPosts',
        summary: 'Latest blog posts',
        tags: ['Posts'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/LangQuery')],
        responses: [new OA\Response(response: 200, description: 'Latest posts')]
    )]
    public function getLatestPosts()
    {
        $posts = Post::where('is_published', true)->latest('published_at')->take(4)->get();

        return response()->json([
            'success' => true,
            'data' => $posts->map(fn (Post $p) => $this->formatPost($p)),
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/posts',
        operationId: 'getPostsList',
        summary: 'List blog posts',
        tags: ['Posts'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
            new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1)),
            new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer', default: 9, maximum: 50)),
        ],
        responses: [new OA\Response(response: 200, description: 'Paginated posts')]
    )]
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

    #[OA\Get(
        path: '/api/storefront/posts/{slug}',
        operationId: 'getPostBySlug',
        summary: 'Blog post detail',
        tags: ['Posts'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
            new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Post detail'),
            new OA\Response(response: 404, description: 'Not found'),
        ]
    )]
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

    #[OA\Get(
        path: '/api/storefront/cart',
        operationId: 'getCart',
        summary: 'Get cart',
        tags: ['Cart'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
            new OA\Parameter(ref: '#/components/parameters/SessionIdHeader'),
        ],
        responses: [new OA\Response(response: 200, description: 'Cart with line items')]
    )]
    public function getCartData(Request $request)
    {
        $locale = StorefrontLocale::fromRequest($request);
        $sessionId = $request->header('X-Session-ID') ?? $request->session_id ?? session()->getId();
        $cart = $this->getCart($sessionId);
        $items = $cart->items()->with('product')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'cart' => $cart,
                'items' => $items->map(function (CartItem $item) use ($locale) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'product' => $item->product ? $this->formatProduct($item->product, $locale) : null,
                    ];
                }),
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/storefront/cart/add',
        operationId: 'addToCart',
        summary: 'Add item to cart',
        tags: ['Cart'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/SessionIdHeader'),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['product_id'],
                properties: [
                    new OA\Property(property: 'product_id', type: 'integer'),
                    new OA\Property(property: 'quantity', type: 'integer', default: 1, minimum: 1),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Added'),
            new OA\Response(response: 400, description: 'Stock exceeded'),
            new OA\Response(response: 404, description: 'Product unavailable'),
        ]
    )]
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

    #[OA\Post(
        path: '/api/storefront/cart/update',
        operationId: 'updateCart',
        summary: 'Update cart line quantity',
        tags: ['Cart'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/SessionIdHeader')],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['item_id', 'quantity'],
                properties: [
                    new OA\Property(property: 'item_id', type: 'integer'),
                    new OA\Property(property: 'quantity', type: 'integer', description: 'Set 0 to remove'),
                ]
            )
        ),
        responses: [new OA\Response(response: 200, description: 'Updated')]
    )]
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

    #[OA\Post(
        path: '/api/storefront/cart/remove',
        operationId: 'removeFromCart',
        summary: 'Remove cart line',
        tags: ['Cart'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/SessionIdHeader')],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['item_id'],
                properties: [new OA\Property(property: 'item_id', type: 'integer')]
            )
        ),
        responses: [new OA\Response(response: 200, description: 'Removed')]
    )]
    public function removeFromCart(Request $request)
    {
        $item = CartItem::find($request->item_id);
        if ($item) {
            $item->delete();
        }

        return response()->json(['success' => true, 'message' => 'Đã xóa']);
    }

    #[OA\Post(
        path: '/api/storefront/checkout',
        operationId: 'checkout',
        summary: 'Place order from cart',
        tags: ['Cart', 'Orders'],
        parameters: [new OA\Parameter(ref: '#/components/parameters/SessionIdHeader')],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'phone', 'address'],
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'address', type: 'string'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', nullable: true),
                    new OA\Property(property: 'coupon_code', type: 'string', nullable: true),
                    new OA\Property(property: 'payment_method', type: 'string', enum: ['cod', 'vnpay'], nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Order created'),
            new OA\Response(response: 400, description: 'Empty cart or invalid coupon'),
        ]
    )]
    public function checkout(Request $request, CouponService $coupons, VNPayService $vnpay)
    {
        $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'email' => 'nullable|email|max:255',
            'coupon_code' => 'nullable|string|max:50',
            'payment_method' => 'nullable|in:cod,vnpay',
        ]);

        $paymentMethod = $request->input('payment_method', 'cod');

        if ($paymentMethod === 'vnpay' && ! $vnpay->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Thanh toán VNPay chưa được cấu hình',
            ], 400);
        }

        $sessionId = $request->header('X-Session-ID') ?? $request->session_id ?? session()->getId();
        $cart = $this->getCart($sessionId);
        $items = $cart->items()->with('product')->get();

        if ($items->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'Giỏ hàng trống'], 400);
        }

        $subtotal = $items->sum(fn ($item) => $item->quantity * $item->product->price);
        $discount = 0;
        $couponCode = null;

        if ($request->filled('coupon_code')) {
            $couponResult = $coupons->validate($request->coupon_code, $subtotal);
            if (!$couponResult['valid']) {
                return response()->json(['success' => false, 'message' => $couponResult['message'] ?? 'Mã giảm giá không hợp lệ'], 400);
            }
            $discount = $couponResult['discount'];
            $couponCode = $couponResult['code'];
        }

        $totalPrice = max(0, $subtotal - $discount);

        $authUser = auth('sanctum')->user();
        $customerId = $authUser instanceof Customer
            ? $authUser->id
            : Customer::query()->where('phone', Customer::normalizePhone($request->phone))->value('id');

        $customerEmail = $request->email
            ?? ($authUser instanceof Customer ? $authUser->email : null);

        $order = Order::create([
            'user_id' => $authUser instanceof \App\Models\User ? $authUser->id : null,
            'customer_id' => $customerId,
            'number' => 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'customer_name' => $request->name,
            'customer_email' => $customerEmail,
            'customer_phone' => $request->phone,
            'shipping_address' => $request->address,
            'total_price' => $totalPrice,
            'status' => 'new',
            'payment_method' => $paymentMethod,
            'payment_status' => 'pending',
            'shipping_fee' => 0,
            'notes' => $couponCode ? "Coupon: {$couponCode} (-{$discount})" : null,
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

        $payload = [
            'order_number' => $order->number,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total_price' => $totalPrice,
            'payment_method' => $paymentMethod,
        ];

        if ($paymentMethod === 'vnpay') {
            $payload['payment_url'] = $vnpay->createPaymentUrl($order, $request->ip() ?? '127.0.0.1');
        }

        return response()->json([
            'success' => true,
            'message' => $paymentMethod === 'vnpay'
                ? 'Chuyển đến cổng thanh toán VNPay...'
                : 'Đặt hàng thành công!',
            'data' => $payload,
        ]);
    }

    #[OA\Post(
        path: '/api/storefront/contact',
        operationId: 'submitContact',
        summary: 'Submit contact form',
        tags: ['Contact'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'phone'],
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', nullable: true),
                    new OA\Property(property: 'service', type: 'string', nullable: true),
                    new OA\Property(property: 'message', type: 'string', nullable: true),
                    new OA\Property(property: 'source', type: 'string', nullable: true, example: 'website'),
                ]
            )
        ),
        responses: [new OA\Response(response: 200, description: 'Submitted')]
    )]
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
            'type' => 'contact',
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

    #[OA\Get(
        path: '/api/storefront/orders/lookup',
        operationId: 'lookupOrder',
        summary: 'Lookup order by number and phone',
        tags: ['Orders'],
        parameters: [
            new OA\Parameter(name: 'number', in: 'query', required: true, schema: new OA\Schema(type: 'string', example: 'ORD-20260625-ABC123')),
            new OA\Parameter(name: 'phone', in: 'query', required: true, schema: new OA\Schema(type: 'string', example: '0901234567')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Order found'),
            new OA\Response(response: 404, description: 'Order not found'),
        ]
    )]
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
            'data' => OrderPresenter::forStorefront($order),
        ]);
    }

    #[OA\Post(
        path: '/api/storefront/orders/retry-payment',
        operationId: 'retryOrderPayment',
        summary: 'Get a new VNPay payment URL for a pending order',
        tags: ['Orders'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['number', 'phone'],
                properties: [
                    new OA\Property(property: 'number', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Payment URL issued'),
            new OA\Response(response: 400, description: 'Order not eligible'),
            new OA\Response(response: 404, description: 'Order not found'),
        ]
    )]
    public function retryOrderPayment(Request $request, VNPayService $vnpay)
    {
        $request->validate([
            'number' => 'required|string',
            'phone' => 'required|string',
        ]);

        if (! $vnpay->isConfigured()) {
            return response()->json(['success' => false, 'message' => 'Thanh toán VNPay chưa được cấu hình'], 400);
        }

        $phone = preg_replace('/\s+/', '', $request->phone);
        $order = Order::query()
            ->where('number', $request->number)
            ->where(function ($q) use ($request, $phone) {
                $q->where('customer_phone', $request->phone)
                    ->orWhere('customer_phone', $phone);
            })
            ->first();

        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $presented = OrderPresenter::forStorefront($order);

        if (! ($presented['can_retry_payment'] ?? false)) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng không thể thanh toán lại',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'payment_url' => $vnpay->createPaymentUrl($order, $request->ip() ?? '127.0.0.1'),
            ],
        ]);
    }

    private function formatProduct(Product $product, ?string $locale = null): array
    {
        return ProductPresenter::forStorefront(
            $product,
            $locale,
            fn (array $images) => $this->resolveImageUrls($images),
        );
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
