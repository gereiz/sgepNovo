<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('lancamentos', function (Blueprint $table) {
            if (!Schema::hasColumn('lancamentos', 'dt_pagamento_real')) {
                $table->date('dt_pagamento_real')->nullable()->after('status_pagamento');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lancamentos', function (Blueprint $table) {
            if (Schema::hasColumn('lancamentos', 'dt_pagamento_real')) {
                $table->dropColumn('dt_pagamento_real');
            }
        });
    }
};
