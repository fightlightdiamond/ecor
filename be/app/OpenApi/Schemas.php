<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'ApiSuccessEnvelope',
    properties: [
        new OA\Property(property: 'success', type: 'boolean', example: true),
        new OA\Property(property: 'data', type: 'object'),
        new OA\Property(property: 'message', type: 'string', nullable: true),
    ]
)]
#[OA\Schema(
    schema: 'ApiErrorEnvelope',
    properties: [
        new OA\Property(property: 'success', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Not found'),
    ]
)]
#[OA\Schema(
    schema: 'PaginationMeta',
    properties: [
        new OA\Property(property: 'current_page', type: 'integer', example: 1),
        new OA\Property(property: 'last_page', type: 'integer', example: 5),
        new OA\Property(property: 'total', type: 'integer', example: 48),
        new OA\Property(property: 'per_page', type: 'integer', example: 12),
    ]
)]
#[OA\Schema(
    schema: 'Product',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'slug', type: 'string'),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'price', type: 'number', format: 'float'),
        new OA\Property(property: 'stock', type: 'integer'),
        new OA\Property(property: 'in_stock', type: 'boolean'),
        new OA\Property(property: 'sku', type: 'string', nullable: true),
        new OA\Property(property: 'category_id', type: 'integer', nullable: true),
        new OA\Property(property: 'image', type: 'string', nullable: true),
        new OA\Property(property: 'images', type: 'array', items: new OA\Items(type: 'string')),
        new OA\Property(property: 'features', type: 'array', items: new OA\Items(type: 'string')),
    ]
)]
#[OA\Schema(
    schema: 'Post',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'slug', type: 'string'),
        new OA\Property(property: 'title', type: 'string'),
        new OA\Property(property: 'short_description', type: 'string', nullable: true),
        new OA\Property(property: 'body', type: 'string', nullable: true),
        new OA\Property(property: 'image', type: 'string', nullable: true),
        new OA\Property(property: 'published_at', type: 'string', format: 'date-time', nullable: true),
    ]
)]
#[OA\Schema(
    schema: 'Review',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'rating', type: 'integer', maximum: 5, minimum: 1),
        new OA\Property(property: 'comment', type: 'string', nullable: true),
        new OA\Property(property: 'author', type: 'string'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
class Schemas
{
}
