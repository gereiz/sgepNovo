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
        // altera o tipo da coluna parcelas da tabela lancamentos para string
        Schema::table('lancamentos', function (Blueprint $table) {
            $table->string('parcelas')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // reverte o tipo da coluna parcelas da tabela lancamentos para integer
        Schema::table('lancamentos', function (Blueprint $table) {
            $table->integer('parcelas')->change();
        });
    }
};
