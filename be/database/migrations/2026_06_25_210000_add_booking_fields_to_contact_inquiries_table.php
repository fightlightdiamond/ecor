<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->string('type')->default('contact')->after('id');
            $table->timestamp('preferred_at')->nullable()->after('message');
            $table->json('metadata')->nullable()->after('preferred_at');
        });
    }

    public function down(): void
    {
        Schema::table('contact_inquiries', function (Blueprint $table) {
            $table->dropColumn(['type', 'preferred_at', 'metadata']);
        });
    }
};
