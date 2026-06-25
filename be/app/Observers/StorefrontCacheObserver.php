<?php

namespace App\Observers;

use App\Support\StorefrontCache;

class StorefrontCacheObserver
{
    public function saved(object $model): void
    {
        StorefrontCache::flush();
    }

    public function deleted(object $model): void
    {
        StorefrontCache::flush();
    }
}
