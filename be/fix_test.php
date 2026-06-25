<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use TomatoPHP\FilamentCms\Filament\Resources\PostResource;

$reflection = new ReflectionClass(PostResource::class);
$property = $reflection->getProperty('recordRouteKeyName');
$property->setAccessible(true);
$property->setValue(null, 'id');

echo "RouteKeyName is: " . PostResource::getRecordRouteKeyName() . "\n";
