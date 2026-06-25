<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Order extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id', 'customer_id', 'number', 'customer_name', 'customer_email', 'customer_phone',
        'shipping_address', 'status', 'payment_method', 'payment_status', 'payment_meta',
        'shipping_fee', 'tax_fee', 'total_price', 'notes', 'tracking_number', 'carrier',
    ];

    protected function casts(): array
    {
        return [
            'payment_meta' => 'array',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
