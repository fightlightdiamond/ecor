<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Payment\VNPayService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function vnpayReturn(Request $request, VNPayService $vnpay)
    {
        $result = $vnpay->verifyReturn($request->query());
        $feUrl = rtrim(config('payment.frontend_url'), '/');
        $orderNumber = $result['order']?->number ?? '';

        if ($result['success']) {
            return redirect("{$feUrl}/thanh-toan/ket-qua?status=success&order=" . urlencode($orderNumber));
        }

        return redirect("{$feUrl}/thanh-toan/ket-qua?status=failed&order=" . urlencode($orderNumber));
    }

    public function vnpayIpn(Request $request, VNPayService $vnpay)
    {
        $result = $vnpay->handleIpn($request->all());

        return response("RspCode={$result['RspCode']}&Message={$result['Message']}");
    }
}
