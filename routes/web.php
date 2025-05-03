<?php

use App\Http\Controllers\Arquivos\ArquivosController;
use App\Http\Controllers\Clientes\ClienteController;
use App\Http\Controllers\Config\ConfiguracoesController;
use App\Http\Controllers\Data\DataController;
use App\Http\Controllers\Enderecos\BairroController;
use App\Http\Controllers\Enderecos\CidadeController;
use App\Http\Controllers\Enderecos\RegiaoController;
use App\Http\Controllers\Paineis\PaineisController;
use App\Http\Controllers\Reserva\ReservaController;
use App\Http\Controllers\Relatorios\RelatoriosController;
use App\Http\Controllers\Relatorios\RelColagemController;
use App\Http\Controllers\Relatorios\RelPainXCliController;
use App\Http\Controllers\Reserva\PiController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Financeiro\ServicosController;
use App\Http\Controllers\Financeiro\ComissoesController;
use App\Http\Controllers\Config\UsuarioController;
use App\Http\Controllers\Config\RolesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Financeiro\CaixaController;
use App\Http\Controllers\Config\TextosPadraoController;
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


route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    route::post('/getClienteReservas', [DashboardController::class, 'getClienteReservas']);

    // Usuários
    route::get('/ListaUsuarios', [UsuarioController::class, 'index'])->name('lista.usuarios');
    route::get('/getUsuarios', [UsuarioController::class, 'getUsuarios']);
    route::post('/alteraSenha', [UserController::class, 'alteraSenha']);
    route::post('/CadUsuario', [UsuarioController::class, 'cadastraUsuario']);
    route::post('/DelUsuario', [UsuarioController::class, 'deletaUsuario']);


    // Data
    route::post('/getBisemanas', [DataController::class, 'getBisemanas']);
    route::post('/getBisemana', [DataController::class, 'getBisemana']);
    route::any('/dtGetBairros', [DataController::class, 'getBairros']);
    route::any('/dtGetCidades', [DataController::class, 'getCidades']);
    route::get('/dtGetUf', [DataController::class, 'getUf']);
    route::post('/dtGetUfCli', [DataController::class, 'getUfCli']);


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
    route::post('/CadCliente', [ClienteController::class, 'cadastraCliente']);
    route::post('/EditCliente', [ClienteController::class, 'editCliente']);
    route::post('/DelCliente', [ClienteController::class, 'deleteCliente']);
    route::post('/GetAgente', [ClienteController::class, 'getAgente']);


    //Painéis
    route::get('/Paineis', [PaineisController::class, 'index'])->name('lista.paineis');
    route::post('/CadPainel', [PaineisController::class, 'cadastraPainel'])->name('add.painel');
    route::post('/EditPainel', [PaineisController::class, 'editPainel']);
    route::any('/DelPainel', [PaineisController::class, 'deletePainel']);


    // Reserva de painéis
    route::get('/ResPaineis', [ReservaController::class, 'index'])->name('reserva.paineis');
    route::post('/GetPaineis', [ReservaController::class, 'getPaineis'])->name('get.paineis');
    route::post('/getBisemanass', [ReservaController::class, 'getBisemanass'])->name('get.bisemanas');
    route::post('/GetRegioes', [ReservaController::class, 'getRegioes'])->name('get.regioes');
    route::post('/GetBairros', [ReservaController::class, 'getBairros'])->name('get.bairros');
    route::post('/ReservaPainel', [ReservaController::class, 'reservaPainel'])->name('reserva.painel');
    route::post('/CancelaReserva', [ReservaController::class, 'cancelaReserva'])->name('cancela.reserva');

    //Reservas sem PI
    route::get('/ReservaSemPi', [ReservaController::class, 'reservaSemPi'])->name('get.reservas.sem.pi');
    route::post('/GetResSemPi', [ReservaController::class, 'getReservaSemPI'])->name('get.reservas.sem.pi');

    // Reseva de painés por cliente
    route::get('/ResPaineisCli', [ReservaController::class, 'reservaPainelIndex'])->name('reserva.paineis.cli');
    route::post('/GetPaineisCli', [ReservaController::class, 'getPaineisCliente'])->name('get.paineis.cli');
    route::post('/ResPaineisCli', [ReservaController::class, 'reservaPaineisCliente'])->name('res.paineis.cli');
    route::post('/DelResCliente', [ReservaController::class, 'delResCliente'])->name('del.reserva.cli');
    route::post('/GetCliente', [ReservaController::class, 'getCliente'])->name('res.get.cli');

        // Financeiro
    // Serviços
    route::get('/Servicos', [ServicosController::class, 'index'])->name('servicos');
    route::post('/CadastraServico', [ServicosController::class, 'cadastraServico'])->name('cad.servico');
    route::post('/DelServico', [ServicosController::class, 'deletaServico'])->name('del.servico');
    route::post('/GetServico', [ServicosController::class, 'getServico'])->name('get.servico');
    route::get('/ListaServicos', [ServicosController::class, 'listaServicos'])->name('lista.servicos');


        // Caixa
    route::get('/Caixa', [CaixaController::class, 'index'])->name('caixa');
    route::get('/PainelLancamentos', [CaixaController::class, 'lancamentos'])->name('painel.lancamentos');

    // Centros de custo
    route::get('/CentrosCusto', [CaixaController::class, 'getCentrosCusto']);
    route::post('/CentroCusto', [CaixaController::class, 'getCentrosCusto']);
    route::post('/CreateCentroCusto', [CaixaController::class, 'createCentroCusto']);
    route::post('/UpdateCentroCusto', [CaixaController::class, 'updateCentroCusto']);
    route::post('/DeleteCentroCusto', [CaixaController::class, 'deleteCentroCusto']);


    // Tipos de lançamentos
    route::get('/TiposLancamentos', [CaixaController::class, 'getTiposLancamentos']);
    route::post('/TipoLancamento', [CaixaController::class, 'getTipoLancamento']);
    route::post('/CreateTipoLancamento', [CaixaController::class, 'createTipoLancamento']);
    route::post('/UpdateTipoLancamento', [CaixaController::class, 'updateTipoLancamento']);
    route::post('/DeleteTipoLancamento', [CaixaController::class, 'deleteTipoLancamento']);


    // Lançamentos
    route::get('/Lancamentos', [CaixaController::class, 'getLancamentos']);
    route::post('/Lancamento', [CaixaController::class, 'getLancamento']);
    route::post('/CreateLancamento', [CaixaController::class, 'createLancamento']);
    route::any('/UpdateLancamento', [CaixaController::class, 'updateLancamento']);
    route::post('/DeleteLancamento', [CaixaController::class, 'deleteLancamento']);


    // Comissões
    route::get('/Comissoes', [ComissoesController::class, 'index'])->name('/comissoes');
    route::post('/GravaComissaoServico', [ComissoesController::class, 'gravaComissaoservico'])->name('grava.comissao.servico');
    route::post('/DelComissaoServico', [ComissoesController::class, 'delComissaoServico'])->name('del.comissao.servico');

    route::post('/CadastraComissaoUsuario', [ComissoesController::class, 'cadastraComissaoUsuario'])->name('cad.comissao.usuario');
    route::post('/DeletaComissaoUsuario', [ComissoesController::class, 'deletaComissaoUsuario'])->name('del.comissao.usuario');


    // Pi's
    route::any('/sessionData', [PiController::class, 'sessionData']);
    route::any('/storePi', [PiController::class, 'storePi']);


        // Relatórios
    // Dispopnibilidade
    route::post('/setData', [RelatoriosController::class, 'setData']);
    route::any('/relDisponiveis', [RelatoriosController::class, 'relDisponiveis']);
    route::any('/relPaineis', [RelatoriosController::class, 'relPaineis']);


    // Reservas x CLiente
    route::get('/ReservaCliente', [RelatoriosController::class, 'RelReservaCliente']);
    route::post('/setRelReservaCliente', [RelatoriosController::class, 'setRelReservaCliente']);
    route::post('/setCliente', [RelatoriosController::class, 'setCliente']);
    route::post('/setBsCliente', [RelatoriosController::class, 'setBsCliente']);
    route::any('/getRelReservaCliente', [RelatoriosController::class, 'getRelReservaCliente']);


    // Painéis x CLientes por Bi-semanas
    route::get('/PaineisCliente', [RelPainXCliController::class, 'index']);
    route::any('/setPaineisCliente', [RelPainXCliController::class, 'setRelPainXCli']);
    route::any('/getPaineisCliente', [RelPainXCliController::class, 'getRelPainXCli']);


    // Relatório de Colagem
    route::get('/RelColagem', [RelColagemController::class, 'relColagem']);
    route::post('/setRelColagem', [RelColagemController::class, 'setRelColagem']);
    route::post('/setRegioes', [RelColagemController::class, 'setRegioes']);
    route::post('/setBairros', [RelColagemController::class, 'setBairros']);
    route::any('/getRelColagem', [RelColagemController::class, 'getRelColagem']);



    // Arquivos
    route::get('/PisGeradas', [ArquivosController::class, 'index']);
    route::post('/getPiBs', [ArquivosController::class, 'getPiBs']);

    // Painéis x Bisemanas
    route::get('/RelPainelBisemana', [App\Http\Controllers\Relatorios\RelPainelBisemanaController::class, 'index']);
    route::post('/setRelPainelBisemana', [App\Http\Controllers\Relatorios\RelPainelBisemanaController::class, 'setRelPainelBisemana']);
    route::any('/getRelPainelBisemana', [App\Http\Controllers\Relatorios\RelPainelBisemanaController::class, 'getRelPainelBisemana']);


    // Relatório de Colagem
    route::get('/RelColagem', [RelColagemController::class, 'relColagem']);
    route::post('/setRelColagem', [RelColagemController::class, 'setRelColagem']);
    route::post('/setRegioes', [RelColagemController::class, 'setRegioes']);
    route::post('/setBairros', [RelColagemController::class, 'setBairros']);
    route::any('/getRelColagem', [RelColagemController::class, 'getRelColagem']);


    // Arquivos
    route::get('/PisGeradas', [ArquivosController::class, 'index']);
    route::post('/getPiBs', [ArquivosController::class, 'getPiBs']);

    
   

    // Configurações
    Route::prefix('config')->group(function () {
        route::get('/', [ConfiguracoesController::class, 'index']);
        route::post('/addAno', [ConfiguracoesController::class, 'AddAno'])->name('add.ano');

        // Roles
        route::get('/roles', [RolesController::class, 'index']);
        route::post('/createRole', [RolesController::class, 'createRole']);
        route::post('/updateRole', [RolesController::class, 'updateRole']);
        route::get('/getRoles', [RolesController::class, 'getRoles']);
        route::post('/deleteRole', [RolesController::class, 'deleteRole']);

        // Permissions
        route::get('/getPermissions ', [RolesController::class, 'getPermissions']);
        route::post('/setPermissions', [RolesController::class, 'setPermissions']);


        // Textos Padrão
        route::get('/textosPadrao', [TextosPadraoController::class, 'index']);
        route::get('/tipoTexto', [TextosPadraoController::class, 'tipoTexto']);
        route::post('/addOrEditTipoTexto', [TextosPadraoController::class, 'addOrEditTipoTexto']);
        route::post('/getTipoTexto', [TextosPadraoController::class, 'getTipoTexto']);
        route::post('/deleteTipoTexto', [TextosPadraoController::class, 'deleteTipoTexto']);
        route::get('/textoPadrao', [TextosPadraoController::class, 'textoPadrao']);
        route::post('/addOrEditTextoPadrao', [TextosPadraoController::class, 'addOrEditTextoPadrao']);
        route::post('/getTextoPadrao', [TextosPadraoController::class, 'getTextoPadrao']);
        route::post('/deleteTextoPadrao', [TextosPadraoController::class, 'deleteTextoPadrao']);



    });


    

});

require __DIR__.'/auth.php';
