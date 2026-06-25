<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    protected $fillable = [
        'type',
        'name',
        'phone',
        'email',
        'service',
        'message',
        'source',
        'preferred_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'preferred_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
