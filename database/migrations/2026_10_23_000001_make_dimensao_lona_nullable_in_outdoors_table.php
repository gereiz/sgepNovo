<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE `outdoors` MODIFY COLUMN `dimensao_lona` VARCHAR(255) NULL DEFAULT NULL;");
        DB::statement("ALTER TABLE `outdoors` MODIFY COLUMN `ident_antiga` VARCHAR(10) NULL DEFAULT NULL;");
        DB::statement("ALTER TABLE `outdoors` MODIFY COLUMN `ponto_referencia` VARCHAR(255) NULL DEFAULT NULL;");
        DB::statement("ALTER TABLE `outdoors` MODIFY COLUMN `latitude` VARCHAR(255) NULL DEFAULT NULL;");
        DB::statement("ALTER TABLE `outdoors` MODIFY COLUMN `longitude` VARCHAR(255) NULL DEFAULT NULL;");
    }

    public function down(): void
    {
        DB::statement("UPDATE `outdoors` SET `dimensao_lona` = '' WHERE `dimensao_lona` IS NULL;");
        DB::statement("ALTER TABLE `outdoors` MODIFY COLUMN `dimensao_lona` VARCHAR(255) NOT NULL;");
    }
};
