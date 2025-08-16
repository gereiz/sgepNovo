<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up(): void
    {
        // adiciona a coluna vl_custo na tabela pi
        Schema::table('pi', function (Blueprint $table) {
            $table->decimal('vl_custo')->after('vl_desc')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // remove a coluna vl_custo da tabela pi
        Schema::table('pi', function (Blueprint $table) {
            $table->dropColumn('vl_custo');
        });
    }
};
