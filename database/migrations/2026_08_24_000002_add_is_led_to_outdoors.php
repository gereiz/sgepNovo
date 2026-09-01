<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('outdoors', function (Blueprint $table) {
            if (!Schema::hasColumn('outdoors', 'is_led')) {
                $table->tinyInteger('is_led')->default(0)->after('tipo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('outdoors', function (Blueprint $table) {
            if (Schema::hasColumn('outdoors', 'is_led')) {
                $table->dropColumn('is_led');
            }
        });
    }
};
