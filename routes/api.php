<?php

use App\Http\Controllers\Api\LoginControllerDomains;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Paineis\PaineisController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::get('users', [LoginControllerDomains::class, 'index']); 

route::get('/Paineis', [PaineisController::class, 'indexApi'])->name('api.lista.paineis');