<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Health', description: 'API health & metadata')]
#[OA\Tag(name: 'Site', description: 'Site content bundle (settings, team, services)')]
#[OA\Tag(name: 'Products', description: 'Product catalog')]
#[OA\Tag(name: 'Posts', description: 'Blog posts')]
#[OA\Tag(name: 'Cart', description: 'Shopping cart (session-based)')]
#[OA\Tag(name: 'Orders', description: 'Order lookup')]
#[OA\Tag(name: 'Coupons', description: 'Discount coupons')]
#[OA\Tag(name: 'Reviews', description: 'Product reviews')]
#[OA\Tag(name: 'Booking', description: 'Salon/spa booking requests')]
#[OA\Tag(name: 'Contact', description: 'Contact form submissions')]
class HealthController extends Controller
{
    #[OA\Get(
        path: '/api/health',
        operationId: 'getHealth',
        summary: 'API health check',
        tags: ['Health'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Service is up',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'string', example: 'ok'),
                        new OA\Property(property: 'version', type: 'string', example: '1.0.0'),
                        new OA\Property(property: 'timestamp', type: 'string', format: 'date-time'),
                    ]
                )
            ),
        ]
    )]
    public function __invoke()
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'redis' => $this->checkRedis(),
            'cache' => $this->checkCache(),
        ];

        $healthy = collect($checks)->every(fn (array $check) => $check['ok'] === true);

        return response()->json([
            'status' => $healthy ? 'ok' : 'degraded',
            'version' => '1.0.0',
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
        ], $healthy ? 200 : 503);
    }

    /**
     * @return array{ok: bool, message: string}
     */
    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();

            return ['ok' => true, 'message' => 'connected'];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * @return array{ok: bool, message: string}
     */
    private function checkRedis(): array
    {
        if (config('cache.default') !== 'redis' && config('queue.default') !== 'redis') {
            return ['ok' => true, 'message' => 'not required'];
        }

        try {
            Redis::connection()->ping();

            return ['ok' => true, 'message' => 'connected'];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * @return array{ok: bool, message: string}
     */
    private function checkCache(): array
    {
        try {
            $key = 'health_check_' . uniqid();
            Cache::put($key, 'ok', 10);
            $ok = Cache::get($key) === 'ok';
            Cache::forget($key);

            return ['ok' => $ok, 'message' => $ok ? 'read/write ok' : 'read failed'];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }
}
