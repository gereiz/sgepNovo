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
        Schema::create('comissao_venda', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pi_id');
            $table->unsignedBigInteger('comissao_id');
            $table->unsignedBigInteger('agente_id');
            $table->foreign('pi_id')->references('id')->on('pi')->onDelete('cascade');
            $table->foreign('comissao_id')->references('id')->on('comissao')->onDelete('cascade');
            $table->foreign('agente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comissao_venda');
    }
};
