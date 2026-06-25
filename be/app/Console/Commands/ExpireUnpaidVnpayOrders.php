<?php

namespace App\Console\Commands;

use App\Services\Storefront\OrderService;
use Illuminate\Console\Command;

class ExpireUnpaidVnpayOrders extends Command
{
    protected $signature = 'orders:expire-unpaid-vnpay';

    protected $description = 'Cancel unpaid VNPay orders past the payment window and restore stock';

    public function handle(OrderService $orders): int
    {
        $count = $orders->expireUnpaidVnpayOrders();

        $this->info("Cancelled {$count} unpaid VNPay order(s).");

        return self::SUCCESS;
    }
}
