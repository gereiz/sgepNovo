<?php

use App\Http\Controllers\Clientes\ClienteController;
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

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

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

    route::get('/ResPaineis', [ReservaController::class, 'index'])->name('reserva.paineis');
    route::post('/GetPaineis', [ReservaController::class, 'getPaineis'])->name('get.paineis');







    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
