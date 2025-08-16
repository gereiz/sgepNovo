<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // adiciona a coluna arquivo na tabela pi
        Schema::table('pi', function (Blueprint $table) {
            $table->string('arquivo')->after('id_cliente')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // remove a coluna arquivo da tabela pi
        Schema::table('pi', function (Blueprint $table) {
            $table->dropColumn('arquivo');
        });
    }
};
