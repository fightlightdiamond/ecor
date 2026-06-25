<?php

namespace App\Observers;

use App\Models\StorefrontSection;
use App\Support\StorefrontCache;

class StorefrontSectionObserver
{
    public function saved(StorefrontSection $section): void
    {
        StorefrontCache::flush();
    }

    public function deleted(StorefrontSection $section): void
    {
        StorefrontCache::flush();
    }
}
