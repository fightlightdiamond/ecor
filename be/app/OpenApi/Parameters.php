<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Parameter(
    parameter: 'LangQuery',
    name: 'lang',
    in: 'query',
    required: false,
    description: 'Locale for translatable content (vi | en)',
    schema: new OA\Schema(type: 'string', enum: ['vi', 'en'], default: 'vi')
)]
#[OA\Parameter(
    parameter: 'SessionIdHeader',
    name: 'X-Session-ID',
    in: 'header',
    required: false,
    description: 'Anonymous cart session UUID (required for cart/checkout)',
    schema: new OA\Schema(type: 'string', format: 'uuid')
)]
#[OA\Parameter(
    parameter: 'AcceptLanguageHeader',
    name: 'Accept-Language',
    in: 'header',
    required: false,
    description: 'Preferred locale (vi | en)',
    schema: new OA\Schema(type: 'string', example: 'vi')
)]
class Parameters
{
}
