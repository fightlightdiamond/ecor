<?php

namespace App\Support;

use App\Models\Product;
use Awcodes\Curator\Models\Media;

class ProductPresenter
{
    /**
     * @param  callable(array<int|string, mixed>): array<int, string>  $resolveImageUrls
     * @return array<string, mixed>
     */
    public static function forStorefront(Product $product, ?string $locale = null, ?callable $resolveImageUrls = null): array
    {
        $locale = $locale ?? StorefrontLocale::fromRequest(request());
        $images = $resolveImageUrls
            ? $resolveImageUrls($product->images ?? [])
            : self::defaultResolveImageUrls($product->images ?? []);

        return [
            'id' => $product->id,
            'name' => $product->localized('name', $locale),
            'slug' => $product->slug,
            'description' => $product->localized('description', $locale),
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

    /**
     * @param  array<int|string, mixed>  $images
     * @return array<int, string>
     */
    private static function defaultResolveImageUrls(array $images): array
    {
        return collect($images)
            ->map(function ($image) {
                if (is_string($image) && filter_var($image, FILTER_VALIDATE_URL)) {
                    return $image;
                }

                if (is_numeric($image)) {
                    return Media::find($image)?->url;
                }

                return null;
            })
            ->filter()
            ->values()
            ->all();
    }
}
