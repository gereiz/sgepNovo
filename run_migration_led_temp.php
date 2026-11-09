<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

echo "=== SCRIPT: ADD is_led EM outdoors ===\n";

try {
    Schema::table('outdoors', function (Blueprint $table) {
        if (!Schema::hasColumn('outdoors', 'is_led')) {
            $table->tinyInteger('is_led')->default(0)->after('tipo');
            echo "[OK] Coluna is_led CRIADA com sucesso (default 0, after tipo).\n";
        } else {
            echo "[INFO] Coluna is_led JA EXISTIA em outdoors.\n";
        }
    });

    $lastBatch = DB::table('migrations')->max('batch') ?? 0;
    $newBatch = $lastBatch + 1;

    $migrationName = '2026_08_24_000002_add_is_led_to_outdoors';
    $existe = DB::table('migrations')->where('migration', $migrationName)->exists();

    if (!$existe) {
        DB::table('migrations')->insert([
            'migration' => $migrationName,
            'batch'     => $newBatch,
        ]);
        echo "[OK] Migration '{$migrationName}' REGISTRADA com sucesso (batch={$newBatch}).\n";
    } else {
        echo "[INFO] Migration '{$migrationName}' JA ESTAVA registrada.\n";
    }

    echo "\n=== VERIFICACAO FINAL ===\n";
    $cols = DB::select("SHOW COLUMNS FROM outdoors LIKE 'is_led'");
    if (!empty($cols)) {
        $c = $cols[0];
        echo "  Campo: {$c->Field}\n";
        echo "  Tipo : {$c->Type}\n";
        echo "  Null : {$c->Null}\n";
        echo "  Default: {$c->Default}\n";
        echo "  [SUCESSO TOTAL]\n";
    } else {
        echo "  [FALHA] Campo is_led NAO encontrado na tabela outdoors!\n";
    }

} catch (\Exception $e) {
    echo "\n[ERRO] " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
