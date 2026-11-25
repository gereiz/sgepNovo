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
        $dataInicioParam = $request->input('data_inicio');

        if ($anoParam < 2000 || $anoParam > 2100) {
            return response()->json([
                'success' => false,
                'message' => 'Informe um ano válido (ex.: 2027).',
            ], 422);
        }

        if (!empty($dataInicioParam)) {
            try {
                $semanaInicial = Carbon::createFromFormat('Y-m-d', substr((string)$dataInicioParam, 0, 10))->startOfDay();
            } catch (\Throwable $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'A data inicial da primeira bi-semana é inválida.',
                ], 422);
            }
        } else {
            $semanaInicial = Carbon::createFromDate($anoParam, 1, 1)->startOfDay();
        }

        $anoExistente = Ano::where('ano_bisemana', $anoParam)->first();
        if ($anoExistente) {
            $jaTemBisemanas = DB::table('bisemanas')->where('ano_id', $anoExistente->id)->exists();
            if ($jaTemBisemanas) {
                return response()->json([
                    'success' => false,
                    'message' => "O ano {$anoParam} já possui bi-semanas cadastradas! Utilize a opção Editar Bi-semanas na tabela.",
                ], 422);
            }
        }

        DB::transaction(function () use ($anoParam, $semanaInicial, &$anoRow) {
            $anoRow = Ano::firstOrCreate(['ano_bisemana' => $anoParam]);

            $dtAtual = $semanaInicial->copy();
            $numeroBisemana = 1;
            $novasBisemanas = [];

            while ($numeroBisemana < 53) {
                $semanaFinal = $dtAtual->copy()->addDays(13);

                $novasBisemanas[] = [
                    'ano_id'       => $anoRow->id,
                    'num_bisemana' => $numeroBisemana,
                    'inicio'       => $dtAtual->format('Y-m-d'),
                    'fim'          => $semanaFinal->format('Y-m-d'),
                ];

                $dtAtual = $semanaFinal->copy()->addDay();
                $numeroBisemana += 2;
            }

            DB::table('bisemanas')->insert($novasBisemanas);
        });

        return response()->json([
            'success' => true,
            'message' => "Bi-semanas do ano {$anoParam} criadas com sucesso!",
        ]);
    }

    public function UpdateAnoBisemanas(Request $request)
    {
        $anoId = (int)$request->input('ano_id');
        $dataInicioParam = $request->input('data_inicio');
        $bisemanasInput = $request->input('bisemanas');

        $anoRow = Ano::find($anoId);
        if (!$anoRow) {
            return response()->json([
                'success' => false,
                'message' => 'Ano não encontrado.',
            ], 404);
        }

        $anoAtual = (int)date('Y');
        if ((int)$anoRow->ano_bisemana < $anoAtual) {
            return response()->json([
                'success' => false,
                'message' => 'Apenas bi-semanas do ano atual ou de anos futuros podem ser editadas.',
            ], 422);
        }

        // Caso tenha enviado a lista detalhada de bi-semanas editadas ou recalculadas
        $listaParaSalvar = [];
        if (is_array($bisemanasInput) && count($bisemanasInput) > 0) {
            foreach ($bisemanasInput as $idx => $item) {
                $inicioStr = substr((string)($item['inicio'] ?? ''), 0, 10);
                $fimStr = substr((string)($item['fim'] ?? ''), 0, 10);
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $inicioStr) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fimStr)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Datas inválidas na bi-semana ' . ($item['num_bisemana'] ?? ($idx + 1)) . '.',
                    ], 422);
                }
                if ($fimStr < $inicioStr) {
                    return response()->json([
                        'success' => false,
                        'message' => 'A data final não pode ser menor que a data inicial na BS ' . ($item['num_bisemana'] ?? ($idx + 1)) . '.',
                    ], 422);
                }
                $listaParaSalvar[] = [
                    'id'           => isset($item['id']) ? (int)$item['id'] : null,
                    'num_bisemana' => isset($item['num_bisemana']) ? (int)$item['num_bisemana'] : (($idx * 2) + 1),
                    'inicio'       => $inicioStr,
                    'fim'          => $fimStr,
                ];
            }
        } elseif (!empty($dataInicioParam)) {
            try {
                $dtAtual = Carbon::createFromFormat('Y-m-d', substr((string)$dataInicioParam, 0, 10))->startOfDay();
            } catch (\Throwable $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'A data inicial informada é inválida.',
                ], 422);
            }

            $numeroBisemana = 1;
            while ($numeroBisemana < 53) {
                $semanaFinal = $dtAtual->copy()->addDays(13);
                $listaParaSalvar[] = [
                    'id'           => null,
                    'num_bisemana' => $numeroBisemana,
                    'inicio'       => $dtAtual->format('Y-m-d'),
                    'fim'          => $semanaFinal->format('Y-m-d'),
                ];
                $dtAtual = $semanaFinal->copy()->addDay();
                $numeroBisemana += 2;
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Informe a data inicial ou a lista de bi-semanas para atualizar.',
            ], 422);
        }

        DB::transaction(function () use ($anoRow, $listaParaSalvar) {
            $existentes = Bisemana::where('ano_id', $anoRow->id)
                ->orderBy('num_bisemana', 'asc')
                ->get()
                ->values();

            $existentesPorId = $existentes->keyBy('id');
            $existentesPorNum = $existentes->keyBy('num_bisemana');

            foreach ($listaParaSalvar as $idx => $dadosBs) {
                $registro = null;
                if (!empty($dadosBs['id']) && $existentesPorId->has($dadosBs['id'])) {
                    $registro = $existentesPorId->get($dadosBs['id']);
                } elseif ($existentesPorNum->has($dadosBs['num_bisemana'])) {
                    $registro = $existentesPorNum->get($dadosBs['num_bisemana']);
                } elseif (isset($existentes[$idx])) {
                    $registro = $existentes[$idx];
                }

                if ($registro) {
                    DB::table('bisemanas')
                        ->where('id', $registro->id)
                        ->update([
                            'num_bisemana' => $dadosBs['num_bisemana'],
                            'inicio'       => $dadosBs['inicio'],
                            'fim'          => $dadosBs['fim'],
                        ]);
                } else {
                    DB::table('bisemanas')->insert([
                        'ano_id'       => $anoRow->id,
                        'num_bisemana' => $dadosBs['num_bisemana'],
                        'inicio'       => $dadosBs['inicio'],
                        'fim'          => $dadosBs['fim'],
                    ]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => "Bi-semanas do ano {$anoRow->ano_bisemana} atualizadas com sucesso!",
        ]);
    }

    public function atualizarImagens(Request $request)
    {
        Artisan::call('painel:refresh-compressed');
        $output = trim((string)Artisan::output());
        return $output ?: 'Imagens comprimidas atualizadas com sucesso!';
    }
}
