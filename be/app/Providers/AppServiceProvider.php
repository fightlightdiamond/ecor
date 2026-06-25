<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Product;
use App\Observers\StorefrontCacheObserver;
use BezhanSalleh\FilamentLanguageSwitch\LanguageSwitch;
use TomatoPHP\FilamentCms\Models\Category;
use TomatoPHP\FilamentCms\Models\Post;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Product::observe(StorefrontCacheObserver::class);
        Post::observe(StorefrontCacheObserver::class);
        Category::observe(StorefrontCacheObserver::class);

        LanguageSwitch::configureUsing(function (LanguageSwitch $switch) {
            $switch
                ->locales(['en', 'vi', 'fr'])
                ->visible(outsidePanels: true);
        });
    }
}
