<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Thăng Long Chè Việt — Storefront API',
    description: 'Public REST API for Nuxt storefront: products, blog, cart, orders, booking, contact. Admin UI uses Filament at /admin.',
    contact: new OA\Contact(email: 'admin@thanglongcheviet.vn')
)]
#[OA\Server(
    url: L5_SWAGGER_CONST_HOST,
    description: 'API Server'
)]
#[OA\SecurityScheme(
    securityScheme: 'customerBearer',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Sanctum',
    description: 'Customer API token (not admin token)'
)]
abstract class Controller
{
    //
}
