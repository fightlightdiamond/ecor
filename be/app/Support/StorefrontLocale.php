<?php

namespace App\Support;

use Illuminate\Http\Request;

class StorefrontLocale
{
    public static function fromRequest(Request $request): string
    {
        $lang = $request->query('lang')
            ?? $request->header('Accept-Language')
            ?? 'vi';

        $lang = strtolower(substr((string) $lang, 0, 2));

        return in_array($lang, ['vi', 'en'], true) ? $lang : 'vi';
    }

    public static function translate(mixed $value, string $locale): mixed
    {
        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $value = $decoded;
            } else {
                return $value;
            }
        }

        if (is_array($value)) {
            return $value[$locale] ?? $value['vi'] ?? reset($value) ?: '';
        }

        return $value;
    }
}
