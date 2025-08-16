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
        Schema::table('comissao_venda', function (Blueprint $table) {
            $table->double('valor_comissao')->after('agente_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comissao_venda', function (Blueprint $table) {
            $table->dropColumn('valor_comisssao');
        });
    }
};
