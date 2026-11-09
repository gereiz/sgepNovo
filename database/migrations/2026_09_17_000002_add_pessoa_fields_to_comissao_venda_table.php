<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comissao_venda', function (Blueprint $table) {
            $table->unsignedBigInteger('comissao_cadastro_id')->nullable()->after('agente_id');
            $table->enum('pessoa_tipo', ['user', 'cliente'])->nullable()->after('comissao_cadastro_id');
            $table->unsignedBigInteger('pessoa_id')->nullable()->after('pessoa_tipo');
            $table->index(['pi_id', 'pessoa_tipo', 'pessoa_id'], 'idx_cv_pi_pessoa');
        });
    }

    public function down(): void
    {
        Schema::table('comissao_venda', function (Blueprint $table) {
            $table->dropIndex('idx_cv_pi_pessoa');
            $table->dropColumn([
                'comissao_cadastro_id',
                'pessoa_tipo',
                'pessoa_id',
            ]);
        });
    }
};
