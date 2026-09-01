import React, { useMemo, useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  MonitorPlay,
  Users,
  CalendarRange,
  Wallet,
  DollarSign,
  Sparkles,
  PlusCircle,
  Images,
  Layers3,
  CircleDot,
  Building2,
} from 'lucide-react';
import { Button } from '@/react/Components/ui/button';
import { Input } from '@/react/Components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/react/Components/ui/select';
import { KpiCard } from '@/react/Components/dashboard/KpiCard';
import { DonutCard } from '@/react/Components/dashboard/DonutCard';
import {
  cn,
  formatCurrencyBRL,
  formatNumberBR,
  formatDateBR,
} from '@/react/lib/utils';

function bisemanaLabel(bisemana) {
  if (!bisemana) return 'Selecione a bi-semana';
  const numero = bisemana.num_bisemana;
  const inicio = bisemana.inicio ? formatDateBR(bisemana.inicio) : '';
  const fim = bisemana.fim ? formatDateBR(bisemana.fim) : '';
  return `BS: ${numero} (${inicio} - ${fim})`;
}

function StatusBsPill({ status }) {
  const s = (status || '').toLowerCase();
  const isAtiva = s.includes('ativa') || s.includes('veiculação');
  const isAguardando = s.includes('aguard');
  if (isAtiva) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[12.5px] font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {status}
      </span>
    );
  }
  if (isAguardando) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[12.5px] font-semibold">
        <CircleDot className="w-3.5 h-3.5" /> {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-[12.5px] font-semibold">
      {status || 'Indisponível'}
    </span>
  );
}

export default function DashboardPage(props) {
  const anos = props.anos || [];
  const bisemanas = props.bisemanas || [];
  const stats = props.stats || {};
  const graficos = props.graficos || {};
  const bsInfo = graficos.bs_info || {};

  const page = usePage();
  const baseUrl = page?.url || window.location.pathname || '/r/dashboard';
  const cleanBase = String(baseUrl).split('?')[0];

  // Estado filtros (Anos + Bi-semana) inicializado a partir dos props (resposta do backend com os filtros REAIS aplicados)
  // ou fallback para valores do controller.
  const inicialAnoId = stats.ano_atual_id ?? (anos[0]?.id ?? '');
  const inicialBsId = stats.bisemana_atual_id ?? (bisemanas.find((b) => String(b.id) === String(stats.bisemana_atual_id))?.id ?? '');

  const [anoId, setAnoId] = useState(String(inicialAnoId ?? ''));
  const [bsId, setBsId] = useState(String(inicialBsId ?? ''));
  const [busca, setBusca] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ------- RECARREGAR DADOS DINAMICAMENTE (Inertia router global) -------
  // Sempre que anoId ou bsId mudar (e o componente estiver montado),
  // visita a mesma rota /r/dashboard com query params, preserveState=true
  // (mantém estado local dos filtros) e preserveScroll=true (não pula pro topo).
  const carregarDados = (params, opts = {}) => {
    if (!router || typeof router.get !== 'function') return;
    const data = {
      ano_id: params.ano_id ?? anoId,
      bisemana_id: params.bisemana_id ?? bsId,
    };
    if (typeof params.busca === 'string' && params.busca.trim() !== '') {
      data.busca = params.busca.trim();
    }
    // No Inertia 1.x, o router.get (global) aceita (url, data, options).
    // Garante que options existam mesmo que opts = {};
    const inertiaOptions = {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onError: (errors) => {
        console.warn('[Dashboard] Erro ao recarregar filtros:', errors);
      },
      ...(opts || {}),
    };
    router.get(cleanBase, data, inertiaOptions);
  };

  // Controle para não disparar visita no primeiro render (apenas após mudança do usuário)
  const [primeiraTrocaAno, setPrimeiraTrocaAno] = useState(false);
  const [primeiraTrocaBs, setPrimeiraTrocaBs] = useState(false);

  useEffect(() => {
    if (!isMounted) return;
    if (!primeiraTrocaAno) {
      setPrimeiraTrocaAno(true);
      return;
    }
    // Ao trocar o ano: se a BS atual não pertence ao novo ano, limpa a BS.
    const bsDoAnoIds = bisemanas.filter(b => String(b.ano_id) === String(anoId)).map(b => String(b.id));
    const proximoBsId = bsDoAnoIds.includes(String(bsId)) ? bsId : (bsDoAnoIds[0] ?? '');
    if (String(proximoBsId) !== String(bsId)) setBsId(String(proximoBsId ?? ''));
    carregarDados({ ano_id: anoId, bisemana_id: proximoBsId });
  }, [anoId, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (!primeiraTrocaBs) {
      setPrimeiraTrocaBs(true);
      return;
    }
    carregarDados({ bisemana_id: bsId });
  }, [bsId, isMounted]);

  const aoClicarAplicar = (ev) => {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    carregarDados({ busca });
  };

  const bsAtual = useMemo(
    () => bisemanas.find(b => String(b.id) === String(bsId)) || null,
    [bisemanas, bsId]
  );
  const bisemanasAnoAtual = useMemo(
    () => anos.some(a => String(a.id) === String(anoId))
      ? bisemanas.filter(b => String(b.ano_id) === String(anoId))
      : bisemanas,
    [bisemanas, anos, anoId]
  );

  // ----- KPIs -----
  const totalPaineis = Number(stats.total_paineis || 0);
  const totalConvencional = Number(stats.total_paineis_convencionais || totalPaineis);
  const totalLed = Number(stats.total_paineis_led || 0);
  const totalClientes = Number(stats.total_clientes || 0);
  const reservasBsAtual = Number(stats.total_reservas_bs_atual || 0);
  const vlFaturamentoPi = Number(stats.total_vl_pi || 0);
  const totalPisEmitidos = Number(stats.total_pis_emitidos || 0);
  const totalComissoes = Number(stats.total_comissoes || 0);
  const reservasLed = Number(stats.total_reservas_led || 0);
  const proximosTerminoLed = Number(stats.contratos_proximos_termino || 0);

  // Fallback donuts (dados vazios são tratados em DonutCard)
  const vendasPorVendedor = (graficos.vendas_por_vendedor || []).map(v => ({
    ...v,
    total_paineis: Number(v.total_paineis || 0),
  }));
  const reservasPorCliente = (graficos.reservas_por_cliente || []).map(c => ({
    ...c,
    qtd: Number(c.qtd || 0),
  }));
  const totalReservasAtivas = Number(graficos.total_reservas_ativas || vendasPorVendedor.reduce((acc, v) => acc + Number(v.total_paineis || 0), 0));
  const totalClientesDistintos = Number(graficos.total_clientes_distintos || reservasPorCliente.filter(c => c.cliente_id !== -1).length || 0);

  const ocupacaoFormatada = useMemo(() => {
    const pct = Number(bsInfo.taxa_ocupacao_pct || 0);
    const ocupadas = Number(bsInfo.faces_reservadas || 0);
    const total = Number(bsInfo.total_faces || totalPaineis || 0);
    return {
      pct: formatNumberBR(pct, 1) + '%',
      frac: `${ocupadas}/${total}`,
      bruto: formatCurrencyBRL(Number(bsInfo.faturamento_bruto_bs || vlFaturamentoPi || 0)),
    };
  }, [bsInfo, totalPaineis, vlFaturamentoPi]);

  return (
    <AppLayout activeTab="vendas">
      <Head title="Painel · Visão Geral do Negócio" />

      {/* ====================================================== */}
      {/*  BLOCO 1:  Filtros (Anos / BS Atual / Busca Rápida) */}
      {/* ====================================================== */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)] max-w-full min-w-0 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end gap-4 max-w-full min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 max-w-full">
            <h1 className="text-[24px] md:text-[30px] font-black tracking-tight text-gray-900 leading-tight">
              Visão geral do negócio
            </h1>
            <p className="mt-1 text-[13px] md:text-[13.5px] text-gray-500 leading-snug max-w-[640px]">
              Acompanhe em tempo real as vendas, reservas de painéis (incluindo LEDs) e o fluxo de faturamento da semana.
            </p>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[12px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              Dados sincronizados
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 max-w-full min-w-0">
          {/* ANO */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-gray-500">
              Ano
            </label>
            <Select
              value={String(anoId ?? '')}
              onValueChange={(v) => setAnoId(v)}
              disabled={!anos.length}
            >
              <SelectTrigger className="h-10 rounded-md">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {anos.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.ano_bisemana || a.ano || a.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BI-SEMANA ATUAL */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-gray-500">
              Bi-semana atual
            </label>
            <Select
              value={String(bsId ?? '')}
              onValueChange={(v) => setBsId(v)}
              disabled={!bisemanasAnoAtual.length}
            >
              <SelectTrigger className="h-10 rounded-md">
                <SelectValue placeholder={bsAtual ? bisemanaLabel(bsAtual) : 'Selecione a bi-semana'} />
              </SelectTrigger>
              <SelectContent className="max-h-[360px]">
                {bisemanasAnoAtual.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {bisemanaLabel(b)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BUSCA RÁPIDA + APLICAR */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-gray-500">
              Busca rápida
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      aoClicarAplicar(e);
                    }
                  }}
                  placeholder="Cliente, campanha, painel..."
                  className="h-10 rounded-md pr-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={aoClicarAplicar}
                className="h-10 px-3.5 rounded-md font-semibold gap-1.5 shrink-0">
                <Layers3 className="w-[16px] h-[16px]" />
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/*  BLOCO 3:  Barra de status (igual 1ª imagem Vue) + botões superiores dir. */}
      {/* ====================================================== */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white/60 px-3 md:px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-full min-w-0 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center gap-3 max-w-full min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 md:gap-8 flex-1 min-w-0 max-w-full">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 whitespace-nowrap">
                Status da BS:
              </span>
              <StatusBsPill status={bsInfo.status || (bsAtual ? 'Carregando...' : 'Indisponível')} />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-[13.5px] text-gray-700">
                <span className="text-gray-500 font-medium">Taxa de Ocupação:</span>{' '}
                <span className="font-bold text-gray-900">
                  {ocupacaoFormatada.pct}
                </span>
                <span className="text-gray-400 font-medium ml-1">
                  ({ocupacaoFormatada.frac} Faces)
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[13.5px] text-gray-700">
                <span className="text-gray-500 font-medium">Faturamento Bruto BS:</span>{' '}
                <span className="font-black text-gray-900">{ocupacaoFormatada.bruto}</span>
              </span>
            </div>
          </div>

          {/* Botões canto superior direito (1:1 Vue) */}
          <div className="flex items-center gap-2 justify-start md:justify-end shrink-0">
            <Link href="#">
              <Button
                variant="outline"
                className="h-10 px-3.5 rounded-md font-semibold gap-1.5 border-sky-200 bg-white text-sky-700 hover:bg-sky-50 hover:text-sky-800"
              >
                <Images className="w-[17px] h-[17px]" />
                Galeria de Fotos OOH
              </Button>
            </Link>
            <Link href="#">
              <Button
                className="h-10 px-4 rounded-md font-semibold gap-1.5 shadow-[0_1px_2px_rgba(14,116,144,0.25)]"
                style={{ backgroundColor: '#0F62A6' }}
              >
                <PlusCircle className="w-[17px] h-[17px]" />
                Nova Reserva
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/*  BLOCO 2:  6 KPIs (Visão geral do negócio · 2ª imagem) */}
      {/* ====================================================== */}
      <section className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-full min-w-0 overflow-hidden">
        <KpiCard
          title="Total de Painéis"
          value={formatNumberBR(totalPaineis, 0)}
          icon={MonitorPlay}
          variant="primary"
          description="Cadastrados ativos no sistema"
          trend={0}
          trendLabel="vs. período anterior"
          badgeText={`${formatNumberBR(totalConvencional, 0)} Conv.`}
          badgeVariant="default"
          footer={`${formatNumberBR(totalLed, 0)} LEDs`}
        />
        <KpiCard
          title="Clientes Ativos"
          value={formatNumberBR(totalClientes, 0)}
          icon={Users}
          variant="success"
          description="Empresas com reserva no período"
          trend={+3.2}
          trendLabel="vs. período anterior"
        />
        <KpiCard
          title="Reservas (BS selecionada)"
          value={formatNumberBR(reservasBsAtual, 0)}
          icon={CalendarRange}
          variant="warning"
          description="Bi-semana selecionada ativa"
          trend={+12.5}
          trendLabel="vs. período anterior"
          badgeText={bsAtual
            ? `BS ${bsAtual.num_bisemana || ''} - ${bsAtual.inicio ? formatDateBR(bsAtual.inicio) : ''}`
            : 'Selecione uma BS'}
          badgeVariant="warning"
          footer={bsAtual?.fim ? `fim ${formatDateBR(bsAtual.fim)}` : ''}
        />
        <KpiCard
          title="Faturamento PI"
          value={formatCurrencyBRL(vlFaturamentoPi)}
          icon={Wallet}
          variant="primary"
          description="Total em pedidos de inserção no período"
          trend={+8.7}
          trendLabel="vs. período anterior"
          badgeText={`${formatNumberBR(totalPisEmitidos, 0)} PIs emitidos`}
          badgeVariant="default"
        />
        <KpiCard
          title="Comissões a Pagar"
          value={formatCurrencyBRL(totalComissoes)}
          icon={DollarSign}
          variant="destructive"
          description="Baseado em vendas fechadas"
          trend={-1.4}
          trendLabel="vs. período anterior"
        />
        <KpiCard
          title="Painéis LED"
          value={formatNumberBR(totalLed, 0)}
          icon={Sparkles}
          variant="success"
          description="Gestão dedicada de LEDs"
          trend={+22.0}
          trendLabel="vs. período anterior"
          badgeText={`${formatNumberBR(reservasLed, 0)} reservas LED`}
          badgeVariant="success"
          footer={proximosTerminoLed > 0 ? `${proximosTerminoLed} próximo(s) do término` : '0 contratos próximos do término'}
        />
      </section>



      {/* ====================================================== */}
      {/*  BLOCO 4:  Donuts Vendas por Vendedor + Reservas por Cliente */}
      {/* ====================================================== */}
      <section className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-full min-w-0 overflow-hidden">
        <DonutCard
          variant="vendedor"
          title="Vendas por Vendedor"
          subtitle={`Distribuição de ${totalReservasAtivas} reservas ativas`}
          itens={vendasPorVendedor}
          totalGeral={totalReservasAtivas}
          centerPrimary={formatNumberBR(totalReservasAtivas, 0)}
          centerSecondary="Painéis"
        />
        <DonutCard
          variant="cliente"
          title="Reservas por Cliente"
          subtitle="Top 4 e demais agrupados"
          itens={reservasPorCliente}
          totalGeral={totalReservasAtivas}
          centerPrimary={`${totalClientesDistintos}+`}
          centerSecondary="Clientes"
        />
      </section>
    </AppLayout>
  );
}
