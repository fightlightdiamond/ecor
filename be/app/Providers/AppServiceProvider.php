<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Appointment;
use App\Models\ContactInquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\StorefrontSection;
use App\Observers\AppointmentObserver;
use App\Observers\ContactInquiryObserver;
use App\Observers\OrderObserver;
use App\Observers\StorefrontSectionObserver;
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
        Appointment::observe(AppointmentObserver::class);
        Order::observe(OrderObserver::class);
        ContactInquiry::observe(ContactInquiryObserver::class);
        StorefrontSection::observe(StorefrontSectionObserver::class);

        LanguageSwitch::configureUsing(function (LanguageSwitch $switch) {
            $switch
                ->locales(['en', 'vi', 'fr'])
                ->visible(outsidePanels: true);
        });
    }
}
