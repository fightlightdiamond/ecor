<?php

namespace App\Support;

class StorefrontContent
{
    public static function load(string $name): array
    {
        $path = resource_path("data/storefront/{$name}.json");

        if (!is_file($path)) {
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
}
