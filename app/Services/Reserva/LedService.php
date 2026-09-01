<?php

namespace App\Services\Reserva;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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

    public function getStatusContrato(Reserva $reserva): array
    {
        $reserva->loadMissing('bisemana');

        if (!$reserva->bisemana || !$reserva->bisemana->fim) {
            return [
                'status' => self::STATUS_CONTRATO_NORMAL,
                'label'  => 'Normal',
                'cor'    => 'badge-success',
                'dias_restantes' => null,
                'data_fim'       => null,
            ];
        }

        $hoje = Carbon::now()->startOfDay();
        $fim  = Carbon::parse($reserva->bisemana->fim)->startOfDay();
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

    public function verificaConflitoReserva(int $painelId, int $bisemanaId, ?int $ignorarReservaId = null): array
    {
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

    public function getMapaOcupacao(array $filtros = []): array
    {
        $query = Painel::with(['bairro', 'reservas.bisemana', 'reservas.cliente'])
                       ->where('is_led', 1)
                       ->orderByRaw('CAST(identificacao AS UNSIGNED) ASC');

        if (!empty($filtros['identificacao'])) {
            $query->where('identificacao', 'like', '%' . $filtros['identificacao'] . '%');
        }
        if (!empty($filtros['bairro_id'])) {
            $query->where('bairro_id', (int)$filtros['bairro_id']);
        }

        $paineis = $query->get();

        $bisemanaInicial = $filtros['bisemana_inicial'] ?? null;
        $bisemanaFinal   = $filtros['bisemana_final']   ?? null;

        $rangeIds = [];
        if ($bisemanaInicial && $bisemanaFinal) {
            $bsIni = Bisemana::find($bisemanaInicial);
            $bsFim = Bisemana::find($bisemanaFinal);
            if ($bsIni && $bsFim && $bsIni->ano_id === $bsFim->ano_id) {
                $rangeIds = Bisemana::where('ano_id', $bsIni->ano_id)
                                    ->whereBetween('id', [min($bsIni->id, $bsFim->id), max($bsIni->id, $bsFim->id)])
                                    ->orderBy('id')
                                    ->pluck('id')
                                    ->toArray();
            }
        }

        $leds = [];
        foreach ($paineis as $painel) {
            $reservasPainel = $painel->reservas;
            if (!empty($rangeIds)) {
                $reservasPainel = $reservasPainel->whereIn('bisemana_id', $rangeIds);
            }
            if (!empty($filtros['cliente_id'])) {
                $reservasPainel = $reservasPainel->where('cliente_id', (int)$filtros['cliente_id']);
            }
            if (!empty($filtros['status'])) {
                // Exemplo: 'pi_ok' = reservas com PI emitido
                if ($filtros['status'] === 'com_pi') {
                    $reservasPainel = $reservasPainel->where('pi_ok', 1)->whereNotNull('pi_id');
                } elseif ($filtros['status'] === 'sem_pi') {
                    $reservasPainel = $reservasPainel->where(fn($q) => $q->where('pi_ok', 0)->orWhereNull('pi_id'));
                }
            }

            $ocupacoes = [];
            foreach ($reservasPainel as $res) {
                $st = $this->getStatusContrato($res);
                $ocupacoes[] = [
                    'reserva_id'    => $res->id,
                    'bisemana_id'   => $res->bisemana_id,
                    'bisemana_ini'  => $res->bisemana->inicio ?? null,
                    'bisemana_fim'  => $res->bisemana->fim ?? null,
                    'cliente_id'    => $res->cliente_id,
                    'cliente_nome'  => $res->cliente ? ($res->cliente->razao_social ?? $res->cliente->nome_fantasia) : null,
                    'campanha'      => $res->campanha,
                    'pi_ok'         => (bool)$res->pi_ok,
                    'pi_id'         => $res->pi_id,
                    'status_contrato' => $st,
                ];
            }

            $leds[] = [
                'painel_id'      => $painel->id,
                'identificacao'  => $painel->identificacao,
                'tipo'           => $painel->tipo,
                'bairro'         => $painel->bairro ? $painel->bairro->nome : null,
                'dimensao'       => $painel->dimensao,
                'is_led'         => true,
                'ocupacoes'      => $ocupacoes,
            ];
        }

        return [
            'leds'       => $leds,
            'range_bs'   => $rangeIds,
            'total_leds' => $paineis->count(),
        ];
    }

    public function getReservasLed(array $filtros = []): array
    {
        $query = Reserva::with(['outdoor', 'bisemana', 'cliente', 'pi'])
                        ->join('outdoors', 'outdoors.id', '=', 'reservas.outdoor_id')
                        ->where('outdoors.is_led', 1)
                        ->select('reservas.*')
                        ->orderByRaw('CAST(outdoors.identificacao AS UNSIGNED) ASC');

        if (!empty($filtros['bisemana_id'])) {
            $query->where('reservas.bisemana_id', (int)$filtros['bisemana_id']);
        }
        if (!empty($filtros['bisemana_inicial']) && !empty($filtros['bisemana_final'])) {
            $bsIni = Bisemana::find($filtros['bisemana_inicial']);
            $bsFim = Bisemana::find($filtros['bisemana_final']);
            if ($bsIni && $bsFim && $bsIni->ano_id === $bsFim->ano_id) {
                $ids = Bisemana::where('ano_id', $bsIni->ano_id)
                               ->whereBetween('id', [min($bsIni->id, $bsFim->id), max($bsIni->id, $bsFim->id)])
                               ->pluck('id');
                $query->whereIn('reservas.bisemana_id', $ids);
            }
        }
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
            $result[] = [
                'reserva_id'     => $r->id,
                'painel_id'      => $r->outdoor_id,
                'painel_ident'   => $r->outdoor ? $r->outdoor->identificacao : null,
                'is_led'         => true,
                'cliente_id'     => $r->cliente_id,
                'cliente_nome'   => $r->cliente ? ($r->cliente->razao_social ?? $r->cliente->nome_fantasia) : null,
                'bisemana_id'    => $r->bisemana_id,
                'bisemana_ini'   => $r->bisemana ? $r->bisemana->inicio : null,
                'bisemana_fim'   => $r->bisemana ? $r->bisemana->fim : null,
                'num_bisemana'   => $r->bisemana ? ($r->bisemana->num_bisemana ?? null) : null,
                'campanha'       => $r->campanha,
                'dt_reserva'     => $r->dt_reserva,
                'pi_ok'          => (bool)$r->pi_ok,
                'pi_id'          => $r->pi_id,
                'vl_total_pi'    => $pi ? ($pi->vl_total ?? null) : null,
                'pago'           => $pi ? (bool)($pi->pago ?? 0) : null,
                'status_contrato' => $st,
            ];
        }

        return [
            'reservas'      => $result,
            'total'         => count($result),
            'valor_total'   => collect($result)->sum('vl_total_pi'),
        ];
    }

    public function getContratosProximosTermino(?int $dias = null): array
    {
        $dias = $dias ?? self::DIAS_ALERTA_TERMINO;

        $reservas = Reserva::with(['outdoor', 'bisemana', 'cliente'])
                           ->join('outdoors', 'outdoors.id', '=', 'reservas.outdoor_id')
                           ->join('bisemanas', 'bisemanas.id', '=', 'reservas.bisemana_id')
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

    public function extenderReservaLed(int $reservaId, int $novaBisemanaFimId, int $userId): array
    {
        $reserva = Reserva::find($reservaId);
        if (!$reserva) {
            return ['cod' => 0, 'msg' => 'Reserva não encontrada'];
        }

        $painel = Painel::find($reserva->outdoor_id);
        if (!$painel || !$painel->is_led) {
            return ['cod' => 0, 'msg' => 'Reserva não pertence a um LED'];
        }

        $bsAtual = Bisemana::find($reserva->bisemana_id);
        $bsNova  = Bisemana::find($novaBisemanaFimId);
        if (!$bsAtual || !$bsNova) {
            return ['cod' => 0, 'msg' => 'Bi-semana inválida'];
        }
        if ($bsAtual->ano_id !== $bsNova->ano_id) {
            return ['cod' => 0, 'msg' => 'Extensão deve ser no mesmo ano'];
        }
        if ($bsNova->id <= $bsAtual->id) {
            return ['cod' => 0, 'msg' => 'Nova data final deve ser posterior à atual'];
        }

        $rangeIds = Bisemana::where('ano_id', $bsAtual->ano_id)
                            ->whereBetween('id', [$bsAtual->id + 1, $bsNova->id])
                            ->orderBy('id')
                            ->pluck('id')
                            ->toArray();

        if (empty($rangeIds)) {
            return ['cod' => 0, 'msg' => 'Nenhuma bi-semana a adicionar'];
        }

        $conflito = $this->verificaConflitoIntervalo($painel->id, $rangeIds, $reserva->id);
        if ($conflito['conflito']) {
            $msgs = collect($conflito['itens'])->pluck('msg')->implode('; ');
            return [
                'cod' => 0,
                'msg' => 'Não é possível estender a reserva. O LED possui outra reserva no período solicitado. ' . $msgs,
                'conflitos' => $conflito['itens'],
            ];
        }

        DB::beginTransaction();
        try {
            $criadas = [];
            foreach ($rangeIds as $bsId) {
                $nova = Reserva::create([
                    'cliente_id'  => $reserva->cliente_id,
                    'outdoor_id'  => $reserva->outdoor_id,
                    'bisemana_id' => (int)$bsId,
                    'dt_reserva'  => Carbon::now()->toDateString(),
                    'campanha'    => $reserva->campanha,
                    'observacao'  => 'Extensão da reserva #' . $reserva->id . ' (LED)',
                    'pi_ok'       => 0,
                    'user_id'     => $userId,
                ]);
                $criadas[] = ['reserva_id' => $nova->id, 'bisemana_id' => (int)$bsId];
            }

            DB::commit();
            return [
                'cod'          => 1,
                'msg'          => 'Reserva estendida com sucesso. ' . count($criadas) . ' nova(s) reserva(s) criada(s).',
                'reservas_novas' => $criadas,
                'range_bisemanas' => $rangeIds,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            return ['cod' => 0, 'msg' => 'Erro ao estender reserva: ' . $e->getMessage()];
        }
    }
}
