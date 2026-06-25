<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

class StorefrontCache
{
    public const TAG = 'storefront';

    public static function get(string $key): mixed
    {
        return Cache::tags([self::TAG])->get($key);
    }

    public static function put(string $key, mixed $value, int $seconds): void
    {
        Cache::tags([self::TAG])->put($key, $value, now()->addSeconds($seconds));
    }

    public static function flush(): void
    {
        Cache::tags([self::TAG])->flush();
    }
}
