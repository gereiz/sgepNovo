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
        Schema::disableForeignKeyConstraints();

        Schema::create('lancamentos', function (Blueprint $table) {
            $table->id();
            $table->string('descricao');
            $table->decimal('valor');
            $table->date('dt_faturamento');
            $table->unsignedBigInteger('centro_custo');
            $table->foreign('centro_custo')->references('id')->on('centro_custo');
            $table->unsignedBigInteger('tipo_lancamento');
            $table->foreign('tipo_lancamento')->references('id')->on('tipo_lancamento');
            $table->integer('id_reserva');
            $table->text('observacoes');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lancamentos');
    }
};
