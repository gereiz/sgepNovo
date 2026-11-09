<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$p = App\Models\Paineis\Painel::first();
echo 'identificacao: ' . $p->identificacao . PHP_EOL;
echo 'raw image_url: ' . $p->image_url . PHP_EOL;
$s = new App\Services\PainelService();
$latest = $s->latestImagePath($p);
echo 'latestImagePath: ' . $latest . PHP_EOL;

// Check files in storage
echo 'Storage path: ' . storage_path('app/public/' . $latest) . PHP_EOL;
echo 'File exists in storage/app/public? ' . (file_exists(storage_path('app/public/' . $latest)) ? 'YES' : 'NO') . PHP_EOL;
echo 'File exists in public/storage? ' . (file_exists(public_path('storage/' . $latest)) ? 'YES' : 'NO') . PHP_EOL;
