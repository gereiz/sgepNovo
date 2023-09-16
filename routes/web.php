<?php

use App\Http\Controllers\Clientes\ClienteController;
use App\Http\Controllers\Config\ConfiguracoesController;
use App\Http\Controllers\Enderecos\BairroController;
use App\Http\Controllers\Enderecos\CidadeController;
use App\Http\Controllers\Enderecos\RegiaoController;
use App\Http\Controllers\Paineis\PaineisController;
use App\Http\Controllers\Reserva\ReservaController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

route::get('/', function() {
    return Inertia::render('Auth/Login');
})->middleware('guest');


route::get('/home', function() {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {

    // Bairros
    route::get('/CadBairro', [BairroController::class, 'index'])->name('cad.bairro');
    route::any('/AddBairro', [BairroController::class, 'cadastraBairro'])->name('cad.bairro.add');
    route::any('/EditBairro', [BairroController::class, 'editaBairro'])->name('cad.bairro.edit');
    route::any('/DelBairro', [BairroController::class, 'deletaBairro'])->name('cad.bairro.del');

    // Regiões
    route::get('/CadRegiao', [RegiaoController::class, 'index'])->name('cad.regiao');
    route::any('/AddRegiao', [RegiaoController::class, 'cadastraRegiao'])->name('cad.regiao.add');
    route::any('/EditRegiao', [RegiaoController::class, 'editaRegiao'])->name('cad.regiao.edit');
    route::any('/DelRegiao', [RegiaoController::class, 'deletaRegiao'])->name('cad.regiao.del');


    // Cidades
    route::get('/CadCidade', [CidadeController::class, 'index'])->name('cad.cidade');
    route::any('/AddCidade', [CidadeController::class, 'cadastraCidade'])->name('cad.cidade.add');
    route::any('/EditCidade', [CidadeController::class, 'editaCidade'])->name('cad.cidade.edit');
    route::any('/DelCidade', [CidadeController::class, 'deletaCidade'])->name('cad.cidade.del');


    //Clientes
    route::get('/Clientes', [ClienteController::class, 'index'])->name('lista.cliente');



    //Painéis
    route::get('/Paineis', [PaineisController::class, 'index'])->name('lista.paineis');


    // Reserva de painéis
    route::get('/ResPaineis', [ReservaController::class, 'index'])->name('reserva.paineis');
    route::post('/GetPaineis', [ReservaController::class, 'getPaineis'])->name('get.paineis');
    route::post('/GetBisemanas', [ReservaController::class, 'getBisemanas'])->name('get.bisemanas');
    route::post('/GetRegioes', [ReservaController::class, 'getRegioes'])->name('get.regioes');
    route::post('/GetBairros', [ReservaController::class, 'getBairros'])->name('get.bairros');
    route::post('/ReservaPainel', [ReservaController::class, 'reservaPainel'])->name('reserva.painel');
    route::post('/CancelaReserva', [ReservaController::class, 'cancelaReserva'])->name('cancela.reserva');
    


    route::get('/ResPaineisCli', [ReservaController::class, 'reservaPainelIndex'])->name('reserva.paineis.cli');
    route::post('/GetPaineisCli', [ReservaController::class, 'getPaineisCliente'])->name('get.paineis.cli');
    route::post('/ResPaineisCli', [ReservaController::class, 'reservaPaineisCliente'])->name('res.paineis.cli');
    route::post('/DelResCliente', [ReservaController::class, 'delResCliente'])->name('del.reserva.cli');
    route::post('/GetCliente', [ReservaController::class, 'getCliente'])->name('res.get.cli');



    // Configurações
    route::get('/Config', [ConfiguracoesController::class, 'index']);

    route::post('/AddAno', [ConfiguracoesController::class, 'storeYear'])->name('add.ano');




    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
