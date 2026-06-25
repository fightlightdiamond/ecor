<?php

namespace App\Http\Middleware;

use App\Support\StorefrontLocale;
use App\Support\StorefrontCache;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheStorefrontApi
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->isMethod('GET') || $request->is('api/storefront/cart')) {
            return $next($request);
        }

        $locale = StorefrontLocale::fromRequest($request);
        $cacheKey = 'storefront:' . md5($request->getRequestUri() . '|' . $locale);

        $cached = StorefrontCache::get($cacheKey);
        if (is_array($cached)) {
            return response()->json($cached);
        }

        $response = $next($request);

        if ($response->isSuccessful()) {
            $payload = json_decode($response->getContent(), true);
            if (is_array($payload) && ($payload['success'] ?? false)) {
                StorefrontCache::put($cacheKey, $payload, 120);
            }
        }

        return $response;
    }
}
