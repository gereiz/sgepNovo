<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comissoes', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 255);
            $table->string('descricao', 500)->nullable();
            $table->tinyInteger('tipo_comissao')->comment('1 = percentual, 2 = valor fixo');
            $table->decimal('valor', 15, 2);
            $table->string('aplicavel_a', 255)->nullable()->default('Vendas Gerais (Todos os Painéis)');
            $table->tinyInteger('status')->default(1)->comment('1 = ativo, 0 = inativo');
            $table->unsignedBigInteger('id_user')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('nome');
            $table->index('tipo_comissao');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comissoes');
    }
};
