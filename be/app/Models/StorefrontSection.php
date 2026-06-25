<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StorefrontSection extends Model
{
    public const KEYS = [
        'settings' => 'Site settings',
        'team' => 'Team members',
        'services' => 'Services menu',
        'gallery' => 'Gallery',
        'testimonials' => 'Testimonials',
    ];

    protected $fillable = [
        'key',
        'label',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }
}
