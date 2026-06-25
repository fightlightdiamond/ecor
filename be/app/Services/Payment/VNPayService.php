<?php

namespace App\Services\Payment;

use App\Models\Order;
use Illuminate\Support\Carbon;

class VNPayService
{
    public function isConfigured(): bool
    {
        $cfg = config('payment.vnpay');

        return (bool) ($cfg['enabled']
            && $cfg['tmn_code']
            && $cfg['hash_secret']
            && $cfg['return_url']
            && $cfg['ipn_url']);
    }

    public function createPaymentUrl(Order $order, string $ipAddress): string
    {
        $cfg = config('payment.vnpay');
        $txnRef = (string) $order->id;
        $amount = (int) round((float) $order->total_price * 100);

        $params = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $cfg['tmn_code'],
            'vnp_Amount' => $amount,
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => $txnRef,
            'vnp_OrderInfo' => 'Thanh toan don hang ' . $order->number,
            'vnp_OrderType' => 'other',
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => $cfg['return_url'],
            'vnp_IpAddr' => $ipAddress,
            'vnp_CreateDate' => now()->format('YmdHis'),
            'vnp_ExpireDate' => now()->addMinutes(15)->format('YmdHis'),
        ];

        $params['vnp_SecureHash'] = $this->hash($params);

        return $cfg['url'] . '?' . http_build_query($params);
    }

    /**
     * @return array{success: bool, order?: Order, message: string, response_code?: string}
     */
    public function verifyReturn(array $input): array
    {
        if (! $this->isValidSignature($input)) {
            return ['success' => false, 'message' => 'Invalid signature'];
        }

        return $this->resolvePayment($input);
    }

    /**
     * @return array{RspCode: string, Message: string}
     */
    public function handleIpn(array $input): array
    {
        if (! $this->isValidSignature($input)) {
            return ['RspCode' => '97', 'Message' => 'Invalid signature'];
        }

        $result = $this->resolvePayment($input);

        if (! $result['success']) {
            return [
                'RspCode' => $result['response_code'] ?? '99',
                'Message' => $result['message'],
            ];
        }

        return ['RspCode' => '00', 'Message' => 'Confirm Success'];
    }

    /**
     * @return array{success: bool, order?: Order, message: string, response_code?: string}
     */
    private function resolvePayment(array $input): array
    {
        $txnRef = $input['vnp_TxnRef'] ?? null;
        $responseCode = $input['vnp_ResponseCode'] ?? null;
        $transactionNo = $input['vnp_TransactionNo'] ?? null;

        if (! $txnRef) {
            return ['success' => false, 'message' => 'Missing txn ref', 'response_code' => '01'];
        }

        $order = Order::query()->find($txnRef);

        if (! $order) {
            return ['success' => false, 'message' => 'Order not found', 'response_code' => '01'];
        }

        if ($order->payment_status === 'paid') {
            return ['success' => true, 'order' => $order, 'message' => 'Already confirmed'];
        }

        if ($responseCode !== '00') {
            $order->update([
                'payment_status' => 'failed',
                'payment_meta' => array_merge($order->payment_meta ?? [], [
                    'vnpay_response_code' => $responseCode,
                    'vnpay_transaction_no' => $transactionNo,
                    'failed_at' => Carbon::now()->toIso8601String(),
                ]),
            ]);

            return [
                'success' => false,
                'order' => $order,
                'message' => 'Payment failed',
                'response_code' => $responseCode ?? '99',
            ];
        }

        $expectedAmount = (int) round((float) $order->total_price * 100);
        $paidAmount = (int) ($input['vnp_Amount'] ?? 0);

        if ($paidAmount !== $expectedAmount) {
            return ['success' => false, 'message' => 'Invalid amount', 'response_code' => '04'];
        }

        $order->update([
            'payment_status' => 'paid',
            'payment_method' => 'vnpay',
            'status' => $order->status === 'new' ? 'processing' : $order->status,
            'payment_meta' => array_merge($order->payment_meta ?? [], [
                'vnpay_transaction_no' => $transactionNo,
                'vnpay_bank_code' => $input['vnp_BankCode'] ?? null,
                'vnpay_pay_date' => $input['vnp_PayDate'] ?? null,
                'paid_at' => Carbon::now()->toIso8601String(),
            ]),
        ]);

        return ['success' => true, 'order' => $order, 'message' => 'Payment confirmed'];
    }

    private function isValidSignature(array $input): bool
    {
        $secureHash = $input['vnp_SecureHash'] ?? '';
        unset($input['vnp_SecureHash'], $input['vnp_SecureHashType']);

        $input = array_filter($input, fn ($v) => $v !== null && $v !== '');

        return hash_equals($secureHash, $this->hash($input));
    }

    /**
     * @param  array<string, scalar|null>  $params
     */
    private function hash(array $params): string
    {
        ksort($params);
        $hashData = '';

        foreach ($params as $key => $value) {
            $hashData .= urlencode((string) $key) . '=' . urlencode((string) $value) . '&';
        }

        $hashData = rtrim($hashData, '&');

        return hash_hmac('sha512', $hashData, config('payment.vnpay.hash_secret'));
    }
}
