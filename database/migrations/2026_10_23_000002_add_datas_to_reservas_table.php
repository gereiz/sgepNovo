<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            if (!Schema::hasColumn('reservas', 'dt_inicio')) {
                $table->date('dt_inicio')->nullable()->after('bisemana_id');
            }
            if (!Schema::hasColumn('reservas', 'dt_fim')) {
                $table->date('dt_fim')->nullable()->after('dt_inicio');
            }
        });

        // Torna bisemana_id nullable para permitir reservas de LED puramente por datas
        DB::statement("ALTER TABLE `reservas` MODIFY COLUMN `bisemana_id` BIGINT UNSIGNED NULL DEFAULT NULL;");

        // Backfill de dt_inicio e dt_fim para reservas existentes a partir da tabela bisemanas
        try {
            DB::statement("
                UPDATE reservas r
                JOIN bisemanas b ON r.bisemana_id = b.id
                SET r.dt_inicio = b.inicio,
                    r.dt_fim = b.fim
                WHERE r.dt_inicio IS NULL AND r.dt_fim IS NULL
            ");
        } catch (\Throwable $e) {
            // Ignora se não houver registros
        }
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            if (Schema::hasColumn('reservas', 'dt_fim')) {
                $table->dropColumn('dt_fim');
            }
            if (Schema::hasColumn('reservas', 'dt_inicio')) {
                $table->dropColumn('dt_inicio');
            }
        });

        DB::statement("ALTER TABLE `reservas` MODIFY COLUMN `bisemana_id` BIGINT UNSIGNED NOT NULL DEFAULT 1;");
    }
};
