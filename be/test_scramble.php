<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$routes = app('router')->getRoutes();
foreach ($routes as $route) {
    try {
        $info = new \Dedoc\Scramble\Support\RouteInfo($route);
        $node = $info->methodNode();
    } catch (\Throwable $e) {
        echo "Error on route " . $route->uri() . ": " . $e->getMessage() . "\n";
    }
}
echo "Done\n";
