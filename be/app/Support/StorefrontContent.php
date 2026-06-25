<?php

namespace App\Support;

use App\Models\StorefrontSection;

class StorefrontContent
{
    public static function load(string $name): array
    {
        $section = StorefrontSection::query()->where('key', $name)->first();

        if ($section && is_array($section->content) && $section->content !== []) {
            return $section->content;
        }

        $path = resource_path("data/storefront/{$name}.json");

        if (! is_file($path)) {
            return [];
        }

        $decoded = json_decode((string) file_get_contents($path), true);

        return is_array($decoded) ? $decoded : [];
    }

    public static function all(): array
    {
        return [
            'settings' => self::load('settings'),
            'team' => self::load('team'),
            'services' => self::load('services'),
            'gallery' => self::load('gallery'),
            'testimonials' => self::load('testimonials'),
        ];
    }

    /**
     * @return array<string, array>
     */
    public static function importFromFiles(): array
    {
        $imported = [];

        foreach (StorefrontSection::KEYS as $key => $label) {
            $path = resource_path("data/storefront/{$key}.json");

            if (! is_file($path)) {
                continue;
            }

            $decoded = json_decode((string) file_get_contents($path), true);

            if (! is_array($decoded)) {
                continue;
            }

            StorefrontSection::query()->updateOrCreate(
                ['key' => $key],
                ['label' => $label, 'content' => $decoded],
            );

            $imported[] = $key;
        }

        StorefrontCache::flush();

        return $imported;
    }
}
