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
        Schema::create('pi', function (Blueprint $table) {
            $table->id();
            $table->integer('id_cliente');
            $table->json('id_paineis');
            $table->string('contato');
            $table->string('campanha');
            $table->integer('id_bisemana');
            $table->integer('vl_unit');
            $table->integer('vl_total');
            $table->integer('pago');
            $table->integer('forma_pagamento');
            $table->string('obs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pi');
    }
};
