<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Carbon\Carbon;

class ConfiguracoesController extends Controller
{
    public function index()
    {
        $anosRaw = Ano::orderBy('ano_bisemana', 'desc')->get();
        $bisemanasPorAno = Bisemana::orderBy('num_bisemana', 'asc')
            ->get()
            ->groupBy('ano_id');

        $anos = $anosRaw->map(function ($a) use ($bisemanasPorAno) {
            $listaBs = $bisemanasPorAno->get($a->id, collect())->values();
            $primeira = $listaBs->first();
            $ultima = $listaBs->last();

            return [
                'id'           => (int)$a->id,
                'ano_bisemana' => (int)$a->ano_bisemana,
                'qtd_bisemanas'=> $listaBs->count(),
                'inicio_ano'   => $primeira ? $primeira->inicio : null,
                'fim_ano'      => $ultima ? $ultima->fim : null,
                'bisemanas'    => $listaBs->map(function ($b) {
                    return [
                        'id'           => (int)$b->id,
                        'num_bisemana' => (int)$b->num_bisemana,
                        'inicio'       => $b->inicio,
                        'fim'          => $b->fim,
                    ];
                })->all(),
            ];
        })->values()->all();

        return Inertia::render('Config/Configuracoes', [
            'anos' => $anos,
        ]);
    }

    public function AddAno(Request $request)
    {
        $anoParam = (int)$request->input('ano');

        if ($anoParam < 2000 || $anoParam > 2100) {
            return response()->json([
                'success' => false,
                'message' => 'Informe um ano válido (ex.: 2027).',
            ], 422);
        }

        $anoExistente = Ano::where('ano_bisemana', $anoParam)->first();
        if ($anoExistente) {
            $jaTemBisemanas = DB::table('bisemanas')->where('ano_id', $anoExistente->id)->exists();
            if ($jaTemBisemanas) {
                return response()->json([
                    'success' => false,
                    'message' => "O ano {$anoParam} já possui bi-semanas cadastradas!",
                ], 422);
            }
        }

        DB::transaction(function () use ($anoParam, &$anoRow) {
            $anoRow = Ano::firstOrCreate(['ano_bisemana' => $anoParam]);

            // Inicializando a primeira semana com o primeiro dia do ano
            $semanaInicial = Carbon::createFromDate($anoParam, 1, 1)->startOfDay();
            $numeroBisemana = 1; // Iniciar a contagem das bisemanas

            $novasBisemanas = [];

            // Loop para gerar as bisemanas até o final do ano
            while ($numeroBisemana < 53) {
                // Definir a semana final como 13 dias após o início da bisemana
                $semanaFinal = $semanaInicial->copy()->addDays(13);

                $novasBisemanas[] = [
                    'ano_id'       => $anoRow->id,
                    'num_bisemana' => $numeroBisemana,
                    'inicio'       => $semanaInicial->format('Y-m-d'),
                    'fim'          => $semanaFinal->format('Y-m-d'),
                ];

                // Atualizar a semana inicial para o próximo dia após o fim da bisemana atual
                $semanaInicial = $semanaFinal->copy()->addDay();

                // Incrementar o número da bisemana em 2, pois estamos lidando com bisemanas
                $numeroBisemana += 2;
            }

            DB::table('bisemanas')->insert($novasBisemanas);
        });

        return response()->json([
            'success' => true,
            'message' => "Bi-semanas do ano {$anoParam} criadas com sucesso!",
        ]);
    }

    public function atualizarImagens(Request $request)
    {
        Artisan::call('painel:refresh-compressed');
        $output = trim((string)Artisan::output());
        return $output ?: 'Imagens comprimidas atualizadas com sucesso!';
    }
}
