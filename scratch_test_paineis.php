<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$res = App\Models\Reservas\Reserva::where('bisemana_id', 44)->get();
echo 'Total reservas BS 44: ' . $res->count() . PHP_EOL;

$req = new Illuminate\Http\Request(['bsId' => 44, 'cliente' => 13]); // cliente id 13
$controller = app(\App\Http\Controllers\Reserva\ReservaController::class);
$paineisCli = $controller->getPaineisCliente($req)->getData();
echo 'getPaineisCliente reservas: ' . count($paineisCli->reservas) . ' | paineis: ' . count($paineisCli->paineis) . PHP_EOL;

$req2 = new Illuminate\Http\Request(['bisemana' => 44, 'statusPainel' => 'D']);
$paineisDisp = $controller->getPaineis($req2)->getData();
echo 'getPaineis statusPainel=D: ' . count($paineisDisp) . PHP_EOL;

if (count($paineisDisp) > 0) {
    echo 'Sample image_url disp: ' . $paineisDisp[0]->image_url . PHP_EOL;
}
if (count($paineisCli->paineis) > 0) {
    echo 'Sample image_url paineisCli: ' . $paineisCli->paineis[0]->image_url . PHP_EOL;
}
