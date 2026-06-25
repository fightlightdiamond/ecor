<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price', 'stock', 'sku', 'images', 'status', 'category_id', 'custom_fields',
    ];

    protected $casts = [
        'images' => 'array',
        'custom_fields' => 'array',
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(\TomatoPHP\FilamentCms\Models\Category::class, 'category_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function getFeatureImageUrl(): ?string
    {
        if (!empty($this->images)) {
            $firstId = is_array($this->images) ? ($this->images[0] ?? null) : null;
            if ($firstId) {
                $media = \Awcodes\Curator\Models\Media::find($firstId);
                return $media ? $media->url : null;
            }
        }
        return null;
    }
}
