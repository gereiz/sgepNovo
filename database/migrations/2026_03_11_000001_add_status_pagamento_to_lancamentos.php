<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('lancamentos', function (Blueprint $table) {
            if (!Schema::hasColumn('lancamentos', 'status_pagamento')) {
                $table->string('status_pagamento')->default('PENDENTE')->after('observacoes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lancamentos', function (Blueprint $table) {
            if (Schema::hasColumn('lancamentos', 'status_pagamento')) {
                $table->dropColumn('status_pagamento');
            }
        });
    }
};

