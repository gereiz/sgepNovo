<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Passo 1: Remover foreign keys antigas que ligam a tabela legada comissao SINGULAR e clientes (agente_id).
        // A nova arquitetura usa pessoa_tipo + pessoa_id, cols antigas sao descontinuadas.
        try {
            Schema::table('comissao_venda', function (Blueprint $table) {
                $table->dropForeign('comissao_venda_comissao_id_foreign');
            });
        } catch (\Throwable $e) { /* ja foi removida em ambiente anterior */ }
        try {
            Schema::table('comissao_venda', function (Blueprint $table) {
                $table->dropForeign('comissao_venda_agente_id_foreign');
            });
        } catch (\Throwable $e) { /* ja foi removida */ }
        try {
            Schema::table('comissao_venda', function (Blueprint $table) {
                $table->dropForeign(['comissao_id']);
            });
        } catch (\Throwable $e) { /* ja foi */ }
        try {
            Schema::table('comissao_venda', function (Blueprint $table) {
                $table->dropForeign(['agente_id']);
            });
        } catch (\Throwable $e) { /* ja foi */ }

        // Passo 2: Transformar ambas colunas NULLABLE (estratégia retrocompatibilidade).
        DB::statement("ALTER TABLE `comissao_venda` MODIFY COLUMN `comissao_id` BIGINT UNSIGNED NULL DEFAULT NULL;");
        DB::statement("ALTER TABLE `comissao_venda` MODIFY COLUMN `agente_id`   BIGINT UNSIGNED NULL DEFAULT NULL;");
    }

    public function down(): void
    {
        // Down: Voltar NOT NULL. Atencao: vai falhar se houver rows novas com NULL.
        DB::statement("UPDATE `comissao_venda` SET `comissao_id` = 0 WHERE `comissao_id` IS NULL;");
        DB::statement("UPDATE `comissao_venda` SET `agente_id`   = 0 WHERE `agente_id`   IS NULL;");

        DB::statement("ALTER TABLE `comissao_venda` MODIFY COLUMN `comissao_id` BIGINT UNSIGNED NOT NULL DEFAULT 0;");
        DB::statement("ALTER TABLE `comissao_venda` MODIFY COLUMN `agente_id`   BIGINT UNSIGNED NOT NULL DEFAULT 0;");

        try {
            Schema::table('comissao_venda', function (Blueprint $table) {
                $table->foreign('comissao_id')->references('id')->on('comissao')->onDelete('no action')->onUpdate('no action');
                $table->foreign('agente_id')->references('id')->on('clientes')->onDelete('no action')->onUpdate('no action');
            });
        } catch (\Throwable $e) { /* tabela comissao ou clientes pode nao ter ids 0 etc */ }
    }
};
