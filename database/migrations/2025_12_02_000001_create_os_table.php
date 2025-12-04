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
        Schema::create('os', function (Blueprint $table) {
            $table->id();
            $table->integer('id_cliente');
            $table->string('arquivo')->nullable();
            $table->json('id_paineis')->nullable();
            $table->string('contato')->nullable();
            $table->string('campanha')->nullable();
            $table->integer('id_bisemana')->nullable();
            $table->float('vl_unit')->default(0);
            $table->float('vl_desc')->default(0);
            $table->float('vl_custo')->default(0);
            $table->float('vl_total')->default(0);
            $table->integer('pago')->default(0);
            $table->date('dt_pgto')->nullable();
            $table->integer('forma_pagamento')->nullable();
            $table->integer('vendedor')->nullable();
            $table->string('obs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('os');
    }
};

