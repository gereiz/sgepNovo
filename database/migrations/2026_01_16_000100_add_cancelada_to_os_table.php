<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('os', function (Blueprint $table) {
            $table->tinyInteger('cancelada')->default(0)->after('obs');
        });
    }

    public function down(): void
    {
        Schema::table('os', function (Blueprint $table) {
            $table->dropColumn('cancelada');
        });
    }
};
