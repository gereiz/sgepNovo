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
        Schema::create('comissao', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_funcionario');
            $table->bigInteger('id_servico');
            $table->float('valor');
            $table->smallInteger('tipo_comissao');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->bigInteger('id_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comissao');
    }
};
