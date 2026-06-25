<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Thang Long Che Viet API",
    description: "API Documentation for Thang Long Che Viet Storefront",
    contact: new OA\Contact(email: "admin@thanglongcheviet.vn")
)]
#[OA\Server(
    url: L5_SWAGGER_CONST_HOST,
    description: "API Server"
)]
abstract class Controller
{
    //
}
