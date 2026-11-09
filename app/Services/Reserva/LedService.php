<?php

namespace App\Services\Reserva;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Paineis\Painel;
use App\Models\Reservas\Reserva;
use App\Models\Bisemanas\Bisemana;
use App\Models\Clientes\Cliente;

class LedService
{
    const DIAS_ALERTA_TERMINO = 5;

    const STATUS_CONTRATO_NORMAL = 'normal';
    const STATUS_CONTRATO_PROXIMO = 'proximo';
    const STATUS_CONTRATO_HOJE = 'hoje';
    const STATUS_CONTRATO_ENCERRADO = 'encerrado';

    /**
     * Retorna o status de vigência do contrato baseado em dt_fim (ou bisemana->fim para legados).
     */
    public function getStatusContrato(Reserva $reserva): array
    {
        $reserva->loadMissing('bisemana');

        $dataFimString = $reserva->dt_fim;
        if (!$dataFimString && $reserva->bisemana && $reserva->bisemana->fim) {
            $dataFimString = $reserva->bisemana->fim;
        }

        if (!$dataFimString) {
            return [
                'status'         => self::STATUS_CONTRATO_NORMAL,
                'label'          => 'Normal',
                'cor'            => 'badge-success',
                'dias_restantes' => null,
                'data_fim'       => null,
            ];
        }

        $hoje = Carbon::now()->startOfDay();
        $fim  = Carbon::parse($dataFimString)->startOfDay();
        $diff = $hoje->diffInDays($fim, false);

        if ($diff < 0) {
            return [
                'status'         => self::STATUS_CONTRATO_ENCERRADO,
                'label'          => 'Contrato encerrado',
                'cor'            => 'badge-error',
                'dias_restantes' => (int)$diff,
                'data_fim'       => $fim->format('d/m/Y'),
            ];
        }

        if ($diff === 0) {
            return [
                'status'         => self::STATUS_CONTRATO_HOJE,
                'label'          => 'Vencendo hoje',
                'cor'            => 'badge-warning',
                'dias_restantes' => 0,
                'data_fim'       => $fim->format('d/m/Y'),
            ];
        }

        if ($diff <= self::DIAS_ALERTA_TERMINO) {
            return [
                'status'         => self::STATUS_CONTRATO_PROXIMO,
                'label'          => "Término em {$diff} dias",
                'cor'            => 'badge-warning',
                'dias_restantes' => (int)$diff,
                'data_fim'       => $fim->format('d/m/Y'),
            ];
        }

        return [
            'status'         => self::STATUS_CONTRATO_NORMAL,
            'label'          => 'Normal',
            'cor'            => 'badge-success',
            'dias_restantes' => (int)$diff,
            'data_fim'       => $fim->format('d/m/Y'),
        ];
    }

    /**
     * Verifica conflito de período por DATAS (dt_inicio e dt_fim).
     * Regra de sobreposição padrão: (inicioA <= fimB) AND (fimA >= inicioB).
     */
    public function verificaConflitoDatas(int $painelId, string $dtInicio, string $dtFim, ?int $ignorarReservaId = null): array
    {
        $inicio = Carbon::parse($dtInicio)->toDateString();
        $fim = Carbon::parse($dtFim)->toDateString();

        if ($fim < $inicio) {
            return ['conflito' => true, 'msg' => 'A data final não pode ser anterior à data inicial'];
        }

        $query = Reserva::with('cliente')
            ->where('outdoor_id', $painelId)
            ->where(function ($q) use ($inicio, $fim) {
                // Checa sobreposição com dt_inicio/dt_fim
                $q->where(function ($sub) use ($inicio, $fim) {
                    $sub->whereNotNull('dt_inicio')
                        ->whereNotNull('dt_fim')
                        ->where('dt_inicio', '<=', $fim)
                        ->where('dt_fim', '>=', $inicio);
                })
                // Ou se for legado com bisemana sem dt_inicio/dt_fim
                ->orWhere(function ($sub) use ($inicio, $fim) {
                    $sub->whereNull('dt_inicio')
                        ->whereHas('bisemana', function ($bsQuery) use ($inicio, $fim) {
                            $bsQuery->where('inicio', '<=', $fim)
                                    ->where('fim', '>=', $inicio);
                        });
                });
            });

        if ($ignorarReservaId) {
            $query->where('id', '!=', $ignorarReservaId);
        }

        $existente = $query->first();

        if (!$existente) {
            return ['conflito' => false, 'msg' => 'Período disponível'];
        }

        $nomeCliente = $existente->cliente
            ? ($existente->cliente->razao_social ?? $existente->cliente->nome_fantasia)
            : 'cliente não identificado';

        $inicioExistente = $existente->dt_inicio ? Carbon::parse($existente->dt_inicio)->format('d/m/Y') : ($existente->bisemana->inicio ?? '?');
        $fimExistente = $existente->dt_fim ? Carbon::parse($existente->dt_fim)->format('d/m/Y') : ($existente->bisemana->fim ?? '?');

        return [
            'conflito'   => true,
            'msg'        => "LED já possui reserva no período ({$inicioExistente} a {$fimExistente}) para {$nomeCliente}.",
            'reserva_id' => $existente->id,
            'cliente_id' => $existente->cliente_id,
        ];
    }

    /**
     * Verifica conflito por bi-semana (para retrocompatibilidade).
     */
    public function verificaConflitoReserva(int $painelId, int $bisemanaId, ?int $ignorarReservaId = null): array
    {
        $bs = Bisemana::find($bisemanaId);
        if ($bs && $bs->inicio && $bs->fim) {
            return $this->verificaConflitoDatas($painelId, $bs->inicio, $bs->fim, $ignorarReservaId);
        }

        $query = Reserva::where('outdoor_id', $painelId)
                        ->where('bisemana_id', $bisemanaId);

        if ($ignorarReservaId) {
            $query->where('id', '!=', $ignorarReservaId);
        }

        $existente = $query->first();

        if (!$existente) {
            return ['conflito' => false, 'msg' => 'Período disponível'];
        }

        $existente->loadMissing('cliente');

        return [
            'conflito' => true,
            'msg'      => 'LED já reservado neste período por ' .
                          ($existente->cliente->razao_social ?? $existente->cliente->nome_fantasia ?? 'cliente não identificado'),
            'reserva_id' => $existente->id,
            'cliente_id' => $existente->cliente_id,
        ];
    }

    public function verificaConflitoIntervalo(int $painelId, array $bisemanaIds, ?int $ignorarReservaId = null): array
    {
        $conflitos = [];
        foreach ($bisemanaIds as $bsId) {
            $res = $this->verificaConflitoReserva($painelId, (int)$bsId, $ignorarReservaId);
            if ($res['conflito']) {
                $conflitos[] = [
                    'bisemana_id' => (int)$bsId,
                    'msg'         => $res['msg'],
                ];
            }
        }
        return ['conflito' => !empty($conflitos), 'itens' => $conflitos];
    }

    public function getPainelLedOrFail(int $painelId): Painel
    {
        $painel = Painel::findOrFail($painelId);
        if (!$painel->is_led) {
            throw new \InvalidArgumentException('Painel não é um LED');
        }
        return $painel;
    }

    /**
     * Retorna a lista de LEDs com suas reservas e ocupações por período/mês.
     */
    public function getMapaOcupacao(array $filtros = []): array
    {
        $query = Painel::with(['bairro.regiao.cidade', 'reservas.bisemana', 'reservas.cliente'])
                       ->where('is_led', 1)
                       ->orderByRaw('CAST(identificacao AS UNSIGNED) ASC');

        if (!empty($filtros['identificacao'])) {
            $query->where('identificacao', 'like', '%' . $filtros['identificacao'] . '%');
        }
        if (!empty($filtros['bairro_id'])) {
            $query->where('bairro_id', (int)$filtros['bairro_id']);
        }
        if (!empty($filtros['outdoor_id'])) {
            $query->where('id', (int)$filtros['outdoor_id']);
        }

        $paineis = $query->get();

        $service = new \App\Services\PainelService();

        $leds = [];
        foreach ($paineis as $painel) {
            $reservasPainel = $painel->reservas;

            if (!empty($filtros['cliente_id'])) {
                $reservasPainel = $reservasPainel->where('cliente_id', (int)$filtros['cliente_id']);
            }
            if (!empty($filtros['status'])) {
                if ($filtros['status'] === 'com_pi') {
                    $reservasPainel = $reservasPainel->where('pi_ok', 1)->whereNotNull('pi_id');
                } elseif ($filtros['status'] === 'sem_pi') {
                    $reservasPainel = $reservasPainel->where(fn($q) => $q->where('pi_ok', 0)->orWhereNull('pi_id'));
                }
            }

            // Filtro por data se fornecido
            if (!empty($filtros['dt_inicio']) && !empty($filtros['dt_fim'])) {
                $fIni = Carbon::parse($filtros['dt_inicio'])->toDateString();
                $fFim = Carbon::parse($filtros['dt_fim'])->toDateString();

                $reservasPainel = $reservasPainel->filter(function ($res) use ($fIni, $fFim) {
                    $rIni = $res->dt_inicio ?? ($res->bisemana->inicio ?? null);
                    $rFim = $res->dt_fim ?? ($res->bisemana->fim ?? null);
                    if (!$rIni || !$rFim) return true;
                    return ($rIni <= $fFim && $rFim >= $fIni);
                });
            }

            $ocupacoes = [];
            foreach ($reservasPainel as $res) {
                $st = $this->getStatusContrato($res);
                $ocupacoes[] = [
                    'reserva_id'      => $res->id,
                    'dt_inicio'       => $res->dt_inicio ? Carbon::parse($res->dt_inicio)->toDateString() : ($res->bisemana->inicio ?? null),
                    'dt_fim'          => $res->dt_fim ? Carbon::parse($res->dt_fim)->toDateString() : ($res->bisemana->fim ?? null),
                    'bisemana_id'     => $res->bisemana_id,
                    'cliente_id'      => $res->cliente_id,
                    'cliente_nome'    => $res->cliente ? ($res->cliente->razao_social ?? $res->cliente->nome_fantasia) : null,
                    'campanha'        => $res->campanha,
                    'observacao'      => $res->observacao,
                    'pi_ok'           => (bool)$res->pi_ok,
                    'pi_id'           => $res->pi_id,
                    'status_contrato' => $st,
                ];
            }

            // Ordena ocupações pela data de início
            usort($ocupacoes, function ($a, $b) {
                return strcmp($a['dt_inicio'] ?? '', $b['dt_inicio'] ?? '');
            });

            // Resolução da imagem do painel
            $tmp = new Painel();
            $tmp->identificacao = $painel->identificacao;
            $tmp->image_url = $painel->image_url;
            $imageUrl = $service->latestImagePath($tmp);

            $leds[] = [
                'painel_id'      => $painel->id,
                'identificacao'  => $painel->identificacao,
                'tipo'           => $painel->tipo,
                'bairro'         => $painel->bairro ? $painel->bairro->nome : null,
                'cidade'         => $painel->bairro && $painel->bairro->regiao && $painel->bairro->regiao->cidade ? $painel->bairro->regiao->cidade->nome : null,
                'logradouro'     => $painel->logradouro,
                'numero'         => $painel->numero,
                'dimensao'       => $painel->dimensao,
                'image_url'      => $imageUrl,
                'is_led'         => true,
                'ocupacoes'      => $ocupacoes,
            ];
        }

        return [
            'leds'       => $leds,
            'total_leds' => count($leds),
        ];
    }

    public function getReservasLed(array $filtros = []): array
    {
        $query = Reserva::with(['outdoor.bairro', 'bisemana', 'cliente', 'pi'])
                        ->join('outdoors', 'outdoors.id', '=', 'reservas.outdoor_id')
                        ->where('outdoors.is_led', 1)
                        ->select('reservas.*')
                        ->orderByRaw('CAST(outdoors.identificacao AS UNSIGNED) ASC');

        if (!empty($filtros['cliente_id'])) {
            $query->where('reservas.cliente_id', (int)$filtros['cliente_id']);
        }
        if (!empty($filtros['outdoor_id'])) {
            $query->where('reservas.outdoor_id', (int)$filtros['outdoor_id']);
        }
        if (!empty($filtros['status_pi'])) {
            if ($filtros['status_pi'] === 'com_pi') $query->where('reservas.pi_ok', 1)->whereNotNull('reservas.pi_id');
            if ($filtros['status_pi'] === 'sem_pi') $query->where(fn($q) => $q->where('reservas.pi_ok', 0)->orWhereNull('reservas.pi_id'));
        }

        $reservas = $query->get();

        $result = [];
        foreach ($reservas as $r) {
            $st = $this->getStatusContrato($r);
            $pi = $r->pi;
            $dtIni = $r->dt_inicio ? Carbon::parse($r->dt_inicio)->toDateString() : ($r->bisemana->inicio ?? null);
            $dtFim = $r->dt_fim ? Carbon::parse($r->dt_fim)->toDateString() : ($r->bisemana->fim ?? null);

            $result[] = [
                'reserva_id'      => $r->id,
                'painel_id'       => $r->outdoor_id,
                'painel_ident'    => $r->outdoor ? $r->outdoor->identificacao : null,
                'bairro'          => $r->outdoor && $r->outdoor->bairro ? $r->outdoor->bairro->nome : null,
                'is_led'          => true,
                'cliente_id'      => $r->cliente_id,
                'cliente_nome'    => $r->cliente ? ($r->cliente->razao_social ?? $r->cliente->nome_fantasia) : null,
                'dt_inicio'       => $dtIni,
                'dt_fim'          => $dtFim,
                'bisemana_id'     => $r->bisemana_id,
                'campanha'        => $r->campanha,
                'observacao'      => $r->observacao,
                'dt_reserva'      => $r->dt_reserva,
                'pi_ok'           => (bool)$r->pi_ok,
                'pi_id'           => $r->pi_id,
                'vl_total_pi'     => $pi ? ($pi->vl_total ?? null) : null,
                'pago'            => $pi ? (bool)($pi->pago ?? 0) : null,
                'status_contrato' => $st,
            ];
        }

        return [
            'reservas'    => $result,
            'total'       => count($result),
            'valor_total' => collect($result)->sum('vl_total_pi'),
        ];
    }

    public function getContratosProximosTermino(?int $dias = null): array
    {
        $dias = $dias ?? self::DIAS_ALERTA_TERMINO;

        $reservas = Reserva::with(['outdoor', 'bisemana', 'cliente'])
                           ->join('outdoors', 'outdoors.id', '=', 'reservas.outdoor_id')
                           ->where('outdoors.is_led', 1)
                           ->select('reservas.*')
                           ->get();

        $result = [];
        foreach ($reservas as $r) {
            $st = $this->getStatusContrato($r);
            if ($st['status'] === self::STATUS_CONTRATO_NORMAL) {
                continue;
            }
            $result[] = [
                'reserva_id'      => $r->id,
                'painel_ident'    => $r->outdoor ? $r->outdoor->identificacao : null,
                'cliente_nome'    => $r->cliente ? ($r->cliente->razao_social ?? $r->cliente->nome_fantasia) : null,
                'campanha'        => $r->campanha,
                'dt_inicio'       => $r->dt_inicio ?? ($r->bisemana->inicio ?? null),
                'dt_fim'          => $r->dt_fim ?? ($r->bisemana->fim ?? null),
                'status_contrato' => $st,
            ];
        }

        usort($result, function ($a, $b) {
            $da = $a['status_contrato']['dias_restantes'] ?? 9999;
            $db = $b['status_contrato']['dias_restantes'] ?? 9999;
            return $da <=> $db;
        });

        return $result;
    }

    /**
     * Estende a reserva de LED atualizando sua data final (dt_fim).
     * Suporta passagem de nova data diretamente (nova_data_fim) ou via bi-semana (legado).
     */
    public function extenderReservaLed(int $reservaId, ?string $novaDataFim, int $userId, ?int $novaBisemanaFimId = null): array
    {
        $reserva = Reserva::with(['outdoor', 'bisemana'])->find($reservaId);
        if (!$reserva) {
            return ['cod' => 0, 'msg' => 'Reserva não encontrada'];
        }

        $painel = $reserva->outdoor;
        if (!$painel || !$painel->is_led) {
            return ['cod' => 0, 'msg' => 'Reserva não pertence a um LED'];
        }

        $dataFimAtual = $reserva->dt_fim ?? ($reserva->bisemana->fim ?? null);
        if (!$dataFimAtual) {
            return ['cod' => 0, 'msg' => 'A reserva atual não possui data final definida.'];
        }

        // Se informou nova data em formato string 'Y-m-d'
        if ($novaDataFim) {
            $dataNova = Carbon::parse($novaDataFim)->toDateString();
            $dataAtual = Carbon::parse($dataFimAtual)->toDateString();

            if ($dataNova <= $dataAtual) {
                return ['cod' => 0, 'msg' => 'A nova data final deve ser posterior à data atual (' . Carbon::parse($dataAtual)->format('d/m/Y') . ').'];
            }

            // O novo período a ser verificado contra conflito é do dia seguinte ao fim atual até a nova data
            $periodoExtensaoInicio = Carbon::parse($dataAtual)->addDay()->toDateString();
            $conflito = $this->verificaConflitoDatas($painel->id, $periodoExtensaoInicio, $dataNova, $reserva->id);

            if ($conflito['conflito']) {
                return [
                    'cod' => 0,
                    'msg' => 'Não é possível estender o contrato. ' . $conflito['msg'],
                ];
            }

            DB::beginTransaction();
            try {
                $obsOriginal = $reserva->observacao ?? '';
                $anotacao = ' [Extensão de ' . Carbon::parse($dataAtual)->format('d/m/Y') . ' para ' . Carbon::parse($dataNova)->format('d/m/Y') . ' por user #' . $userId . ' em ' . Carbon::now()->format('d/m/Y H:i') . ']';

                $reserva->dt_fim = $dataNova;
                $reserva->observacao = trim($obsOriginal . $anotacao);
                $reserva->save();

                DB::commit();
                return [
                    'cod'          => 1,
                    'msg'          => 'Período da reserva do LED estendido com sucesso para ' . Carbon::parse($dataNova)->format('d/m/Y') . '.',
                    'nova_data_fim'=> $dataNova,
                    'reserva_id'   => $reserva->id,
                ];
            } catch (\Throwable $e) {
                DB::rollBack();
                return ['cod' => 0, 'msg' => 'Erro ao estender reserva: ' . $e->getMessage()];
            }
        }

        // Caso legado com novaBisemanaFimId
        if ($novaBisemanaFimId) {
            $bsNova = Bisemana::find($novaBisemanaFimId);
            if (!$bsNova || !$bsNova->fim) {
                return ['cod' => 0, 'msg' => 'Bi-semana de destino inválida.'];
            }
            return $this->extenderReservaLed($reservaId, $bsNova->fim, $userId, null);
        }

        return ['cod' => 0, 'msg' => 'Informe a nova data final para a extensão.'];
    }
}
