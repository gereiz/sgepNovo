import React, { useMemo, useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import * as toastrNS from 'toastr';
import 'toastr/build/toastr.min.css';
const toastr = toastrNS && (toastrNS.default || toastrNS.toastr || toastrNS);
import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Download,
  Pencil,
  Trash2,
  RefreshCcw,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/react/Components/ui/dialog';
import { Textarea } from '@/react/Components/ui/textarea';
import { KpiCard } from '@/react/Components/dashboard/KpiCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/react/Components/ui/card';
import { Badge } from '@/react/Components/ui/badge';
import {
  cn,
  formatCurrencyBRL,
  formatNumberBR,
  formatDateBR,
} from '@/react/lib/utils';

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 300,
  timeOut: 3500,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'swing',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};

function tirarAcentos(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
function contemAlguma(str, palavras) {
  const s = String(str || '').toLowerCase();
  return palavras.some((p) => s.includes(String(p || '').toLowerCase()));
}

function StatusBadge({ status }) {
  const s = String(status || '').toUpperCase();
  const quitado = s === 'QUITADO';
  if (quitado) {
    return (
      <Badge variant="success" className="border border-emerald-700/20">
        Quitado
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="border border-amber-500/20">
      Pendente
    </Badge>
  );
}

function TipoBadge({ tipo, label }) {
  const t = String(tipo || '').toLowerCase();
  const entrada = t === 'entrada';
  const saida = t === 'saida' || t === 'saída';
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border">
      {entrada ? (
        <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-600" />
      ) : saida ? (
        <ArrowDownCircle className="w-3.5 h-3.5 text-rose-600" />
      ) : (
        <ArrowDownCircle className="w-3.5 h-3.5 text-slate-400" />
      )}
      <span className={cn(
        'text-[12px] font-semibold',
        entrada ? 'text-emerald-700' : saida ? 'text-rose-700' : 'text-slate-600'
      )}>
        {label || (entrada ? 'Entrada' : (saida ? 'Saída' : 'Indefinido'))}
      </span>
    </div>
  );
}

function formatDateForInput(d) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CaixaPage(props) {
  const page = usePage();
  const baseUrl = page?.url || window.location.pathname || '/r/caixa';
  const cleanBase = String(baseUrl).split('?')[0];

  const kpis = props.kpis || { total_faturado: 0, recebido: 0, a_receber: 0 };
  const lancamentos = props.lancamentos || [];
  const centrosCusto = props.centros_custo || [];
  const tiposLancamento = props.tipos_lancamento || [];

  const initialSearch = props.search || '';
  const initialStatus = props.status || 'todos';
  const initialCc = props.centroCustoId || 0;
  const initialTl = props.tipoLancId || 0;
  const initialPage = props.page || 1;
  const perPage = props.perPage || 50;
  const totalItens = props.totalItens || 0;
  const paginas = props.paginas || 1;

  const [search, setSearch] = useState(String(initialSearch));
  const [status, setStatus] = useState(String(initialStatus));
  const [cc, setCc] = useState(initialCc ? String(initialCc) : '0');
  const [tl, setTl] = useState(initialTl ? String(initialTl) : '0');
  const [pagAtual, setPagAtual] = useState(Number(initialPage) || 1);
  const [isMounted, setIsMounted] = useState(false);

  const [toggleOpen, setToggleOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState(null);
  const [confirmDtPag, setConfirmDtPag] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    descricao: '',
    valor: '',
    parcelas: '',
    dt_faturamento: '',
    centro_custo_id: '0',
    tipo_lancamento_id: '0',
    observacoes: '',
  });
  const [editSaving, setEditSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);

  const [toggleSaving, setToggleSaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const recarregar = (overrides = {}) => {
    const qs = {};
    const s = (overrides.search !== undefined) ? String(overrides.search) : search;
    const st = (overrides.status !== undefined) ? String(overrides.status) : status;
    const c = (overrides.cc !== undefined) ? String(overrides.cc) : cc;
    const t = (overrides.tl !== undefined) ? String(overrides.tl) : tl;
    const p = Number(overrides.page !== undefined ? overrides.page : pagAtual);
    if (s && s.trim() !== '') qs.search = s.trim();
    if (st && st !== 'todos') qs.status = st;
    if (c && c !== '0') qs.cc = c;
    if (t && t !== '0') qs.tl = t;
    if (p > 1) qs.page = String(p);
    if (perPage !== 50) qs.perPage = String(perPage);
    router.get(cleanBase, qs, { preserveState: true, preserveScroll: true, replace: true });
  };

  const limpar = () => {
    setSearch('');
    setStatus('todos');
    setCc('0');
    setTl('0');
    setPagAtual(1);
    setTimeout(() => recarregar({ search: '', status: 'todos', cc: '0', tl: '0', page: 1 }), 0);
  };

  const aplicarClick = () => {
    setPagAtual(1);
    setTimeout(() => recarregar({ page: 1 }), 0);
  };

  const goPage = (n) => {
    const p = Math.max(1, Math.min(paginas, Number(n) || 1));
    setPagAtual(p);
    setTimeout(() => recarregar({ page: p }), 0);
  };

  // ==== HANDLERS AÇÕES (Quitar/Reabrir, Editar, Excluir) ====

  const isToggleQuitar = useMemo(() => {
    if (!toggleTarget) return true;
    return String(toggleTarget.status_pagamento || 'PENDENTE').toUpperCase() !== 'QUITADO';
  }, [toggleTarget]);

  const openToggleStatus = (l) => {
    setToggleTarget(l);
    const quitado = String(l.status_pagamento || '').toUpperCase() === 'QUITADO';
    setConfirmDtPag(quitado ? '' : formatDateForInput(new Date()));
    setToggleOpen(true);
  };

  const closeToggleStatus = () => {
    setToggleOpen(false);
    setToggleTarget(null);
    setConfirmDtPag('');
  };

  const submitToggleStatus = async () => {
    if (!toggleTarget) return;
    if (isToggleQuitar && !confirmDtPag) {
      toastr.error('Informe a Data Real de Pagamento');
      return;
    }
    setToggleSaving(true);
    const payload = { id: toggleTarget.id };
    if (isToggleQuitar) {
      payload.dt_pagamento_real = confirmDtPag;
    }
    try {
      const resp = await axios.post('/ToggleLancamentoStatus', payload);
      const novo = resp?.data?.status || (isToggleQuitar ? 'QUITADO' : 'PENDENTE');
      toastr.success('Status atualizado para ' + novo);
      closeToggleStatus();
      recarregar();
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.message || 'Falha ao atualizar status';
      toastr.error(msg);
    } finally {
      setToggleSaving(false);
    }
  };

  const openEdit = (l) => {
    setEditTarget(l);
    setEditForm({
      descricao: String(l.descricao || ''),
      valor: String(l.valor != null ? Number(l.valor).toFixed(2) : ''),
      parcelas: String(l.parcelas || ''),
      dt_faturamento: formatDateForInput(l.dt_faturamento),
      centro_custo_id: String(l.centro_custo_id || 0),
      tipo_lancamento_id: String(l.tipo_lancamento_id || 0),
      observacoes: String(l.observacoes || ''),
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditTarget(null);
    setEditSaving(false);
  };

  const submitEdit = async () => {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const ccObj = centrosCusto.find((c) => String(c.id) === String(editForm.centro_custo_id)) || null;
      const tlObj = tiposLancamento.find((t) => String(t.id) === String(editForm.tipo_lancamento_id)) || null;
      const payload = {
        id: editTarget.id,
        lancamento: {
          descricao: editForm.descricao,
          valor: String(editForm.valor).replace(',', '.'),
          parcelas: editForm.parcelas,
          dt_faturamento: editForm.dt_faturamento,
          centro_custo: ccObj ? { id: ccObj.id } : { id: editForm.centro_custo_id ? Number(editForm.centro_custo_id) : 0 },
          tipo_lancamento: tlObj ? { id: tlObj.id } : { id: editForm.tipo_lancamento_id ? Number(editForm.tipo_lancamento_id) : 0 },
          observacoes: editForm.observacoes,
        },
      };
      await axios.post('/UpdateLancamento', payload);
      toastr.success('Lançamento atualizado com sucesso!');
      closeEdit();
      recarregar();
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.message || 'Erro ao atualizar lançamento';
      toastr.error(msg);
    } finally {
      setEditSaving(false);
    }
  };

  const openDelete = (l) => {
    setDeleteTarget(l);
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
    setDeleteSaving(false);
  };

  const submitDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSaving(true);
    try {
      const resp = await axios.post('/DeleteLancamento', { lancamento: deleteTarget });
      const msg = resp?.data?.message || 'Lançamento excluído com sucesso!';
      toastr.success(msg);
      closeDelete();
      recarregar();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao excluir lançamento';
      toastr.error(msg);
    } finally {
      setDeleteSaving(false);
    }
  };

  // ===== Derivados =====
  const pctRecebido = useMemo(() => {
    const total = Number(kpis.total_faturado) || 0;
    const rec = Number(kpis.recebido) || 0;
    if (!total) return 0;
    return Math.round((rec / total) * 1000) / 10;
  }, [kpis]);

  const pctAReceber = 100 - pctRecebido;

  const pagsDisplay = useMemo(() => {
    const arr = [];
    const total = paginas;
    const cur = pagAtual;
    const add = (n) => arr.push(n);
    if (total <= 7) {
      for (let i = 1; i <= total; i++) add(i);
      return arr;
    }
    add(1);
    if (cur > 3) arr.push('...');
    const ini = Math.max(2, cur - 1);
    const fim = Math.min(total - 1, cur + 1);
    for (let i = ini; i <= fim; i++) add(i);
    if (cur < total - 2) arr.push('...');
    add(total);
    return arr;
  }, [paginas, pagAtual]);

  return (
    <AppLayout>
      <Head title="Controle de Caixa" />
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-5 md:py-6 space-y-5">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-3 max-w-full min-w-0">
            <div className="w-2.5 h-9 bg-emerald-600 rounded-full shrink-0" />
            <div className="min-w-0">
              <h1 className="text-[24px] md:text-[30px] font-extrabold tracking-tight text-slate-900 leading-tight truncate">
                Controle de Caixa
              </h1>
              <p className="text-[13px] md:text-sm text-slate-500 truncate">
                Lançamentos de receitas e despesas · {totalItens} registros · Página {pagAtual} de {paginas}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href="/Caixa"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-semibold text-[12.5px] shadow-sm transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Dashboard antigo
            </a>
            <Button size="sm" variant="outline" className="gap-1.5" asChild>
              <a href="/RelLancamentos">
                <FileText className="w-3.5 h-3.5" />
                Relatório
              </a>
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-sm" asChild>
              <a href="/PainelLancamentos">
                <Plus className="w-3.5 h-3.5" />
                Novo Lançamento
              </a>
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <section className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-full min-w-0 overflow-hidden">
          <KpiCard
            title="Total Faturado"
            value={formatCurrencyBRL(kpis.total_faturado || 0)}
            icon={DollarSign}
            subtitle="Soma de todos os lançamentos no filtro atual"
            accent="blue"
            trendLabel={formatNumberBR(totalItens, 0) + ' lançamentos'}
          />
          <KpiCard
            title="Recebido / Liquidado"
            value={formatCurrencyBRL(kpis.recebido || 0)}
            icon={CheckCircle2}
            accent="green"
            trendLabel={pctRecebido + '% do total'}
          />
          <KpiCard
            title="A Receber / Em Aberto"
            value={formatCurrencyBRL(kpis.a_receber || 0)}
            icon={Clock}
            accent="amber"
            trendLabel={pctAReceber + '% do total'}
          />
        </section>

        {/* FILTROS */}
        <Card className="border border-gray-200 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-full min-w-0 overflow-hidden">
          <CardHeader className="p-4 md:px-5 md:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm text-slate-900 flex items-center gap-2 m-0">
              <Filter className="w-4 h-4 text-slate-500" />
              Filtros de Pesquisa
            </CardTitle>
            <div className="text-xs text-slate-500">
              Busque por descrição, OS, PI, ou observações
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-full min-w-0">
            <div className="lg:col-span-2">
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Busca rápida
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Descrição, OS nº, PI nº, observação..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') aplicarClick();
                  }}
                  className="pl-9 h-9"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Status Pagamento
              </label>
              <Select value={status} onValueChange={(v) => setStatus(String(v))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="quitado">Quitados</SelectItem>
                  <SelectItem value="pendente">Pendentes / Em aberto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Centro de Custo
              </label>
              <Select value={cc || '0'} onValueChange={(v) => setCc(String(v))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Centro de Custo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {centrosCusto.map((c) => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[11.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Tipo Lançamento
              </label>
              <Select value={tl || '0'} onValueChange={(v) => setTl(String(v))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tipo de Lançamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {tiposLancamento.map((t) => (
                    <SelectItem key={String(t.id)} value={String(t.id)}>
                      {t.nome} ({String(t.tipo || 'saída').toLowerCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-end justify-start lg:justify-end gap-2 pt-1 max-w-full min-w-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={limpar}
                className="gap-1.5"
              >
                Limpar filtros
              </Button>
              <Button
                size="sm"
                onClick={aplicarClick}
                className="gap-1.5 bg-slate-900 hover:bg-slate-800"
              >
                <Search className="w-3.5 h-3.5" />
                Aplicar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABELA */}
        <Card className="border border-slate-200 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-full min-w-0">
          <CardHeader className="p-4 md:px-5 md:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm text-slate-900 flex items-center gap-2 m-0">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Lançamentos ({lancamentos.length} na página)
            </CardTitle>
            <a
              href="/RelLancamentos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006397] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar relatório
            </a>
          </CardHeader>
          <CardContent className="p-0 max-w-full overflow-x-auto">
            <table className="w-full text-left text-[12.5px] min-w-[1200px]">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-[80px]">ID</th>
                  <th className="py-3 px-4 min-w-[260px]">Descrição</th>
                  <th className="py-3 px-4 text-right w-[120px]">Valor Total</th>
                  <th className="py-3 px-4 text-right w-[120px]">Valor Líq.</th>
                  <th className="py-3 px-4 w-[110px]">Vencimento</th>
                  <th className="py-3 px-4 w-[110px]">Pagamento</th>
                  <th className="py-3 px-4 w-[140px]">C. Custo</th>
                  <th className="py-3 px-4 w-[120px]">Tipo</th>
                  <th className="py-3 px-4 min-w-[190px]">Status</th>
                  <th className="py-3 px-4 w-[80px] text-center">Obs</th>
                  <th className="py-3 px-4 w-[180px] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {lancamentos.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 px-6 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700">Nenhum lançamento encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros de busca acima.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  lancamentos.map((l) => {
                    const quitado = String(l.status_pagamento || '').toUpperCase() === 'QUITADO';
                    const ehReserva = (Number(l.centro_custo_id) || 0) === 1;
                    const temObs = !!String(l.observacoes || '').trim();
                    return (
                      <tr
                        key={String(l.id)}
                        className={cn(
                          'hover:bg-slate-50/80 transition-colors',
                        )}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#006397] text-[12.5px]">
                          #{l.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-[13px] leading-tight">
                            {l.descricao || '—'}
                          </div>
                          {(l.id_reserva || l.parcelas) && (
                            <div className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-2">
                              {l.parcelas ? <span>Parcela: {l.parcelas}</span> : null}
                              {l.id_reserva ? <span>Reserva/PI: #{l.id_reserva}</span> : null}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-[13px] whitespace-nowrap">
                          {formatCurrencyBRL(l.valor || 0)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 text-[13px] whitespace-nowrap">
                          {formatCurrencyBRL(l.valor_liquido != null ? l.valor_liquido : 0)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[12.5px] whitespace-nowrap">
                          {l.dt_faturamento ? formatDateBR(l.dt_faturamento) : '—'}
                        </td>
                        <td className={cn(
                          'py-3 px-4 text-[12.5px] whitespace-nowrap font-semibold',
                          quitado ? 'text-emerald-700' : 'text-slate-400'
                        )}>
                          {l.dt_pagamento_real
                            ? formatDateBR(l.dt_pagamento_real)
                            : (quitado ? formatDateBR(l.dt_faturamento) : '—')}
                        </td>
                        <td className="py-3 px-4 text-[12.5px] text-slate-700 whitespace-nowrap">
                          {l.centro_custo_nome || '—'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <TipoBadge
                            tipo={l.tipo_lancamento_eh_entrada === null
                              ? (tiposLancamento.find((t) => String(t.id) === String(l.tipo_lancamento_id))?.tipo || 'indefinido')
                              : (l.tipo_lancamento_eh_entrada ? 'entrada' : 'saida')}
                            label={l.tipo_lancamento_nome}
                          />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={l.status_pagamento} />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-[11.5px] font-semibold"
                              onClick={() => openToggleStatus(l)}
                            >
                              {quitado ? 'Reabrir' : 'Quitar'}
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            title={temObs ? String(l.observacoes) : 'Nenhuma Observação'}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border"
                            style={{
                              borderColor: temObs ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.25)',
                              color: temObs ? '#059669' : '#e11d48',
                              background: temObs ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.05)',
                            }}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={ehReserva}
                              title={ehReserva
                                ? 'Lançamentos automáticos de reservas não podem ser editados'
                                : 'Editar lançamento'}
                              className={cn(
                                'w-8 h-8 p-0',
                                !ehReserva && 'text-amber-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200',
                                ehReserva && 'opacity-50 cursor-not-allowed',
                              )}
                              onClick={() => !ehReserva && openEdit(l)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={ehReserva}
                              title={ehReserva
                                ? 'Lançamentos automáticos de reservas não podem ser excluídos'
                                : 'Excluir lançamento'}
                              className={cn(
                                'w-8 h-8 p-0',
                                !ehReserva && 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200',
                                ehReserva && 'opacity-50 cursor-not-allowed',
                              )}
                              onClick={() => !ehReserva && openDelete(l)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>

          {/* PAGINAÇÃO */}
          {paginas > 1 && (
            <div className="border-t border-slate-100 p-3 md:p-4 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium">
                Mostrando <span className="text-slate-700 font-bold">{Math.min(totalItens, ((pagAtual - 1) * perPage) + 1)}</span>
                {' — '}
                <span className="text-slate-700 font-bold">{Math.min(totalItens, pagAtual * perPage)}</span>
                {' '}de <span className="text-slate-700 font-bold">{totalItens}</span> lançamentos
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goPage(pagAtual - 1)}
                  disabled={pagAtual <= 1}
                  className="w-8 h-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {pagsDisplay.map((p, i) => (
                  p === '...' ? (
                    <span key={'dot_' + i} className="px-2 text-[12px] text-slate-400 font-bold">…</span>
                  ) : (
                    <Button
                      key={String(p)}
                      size="sm"
                      variant={Number(p) === pagAtual ? 'default' : 'outline'}
                      onClick={() => goPage(p)}
                      className="w-8 h-8 p-0 text-[12px] font-bold"
                    >
                      {String(p)}
                    </Button>
                  )
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => goPage(pagAtual + 1)}
                  disabled={pagAtual >= paginas}
                  className="w-8 h-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ============== MODAIS ============== */}

      {/* MODAL QUITAR / REABRIR */}
      <Dialog open={toggleOpen} onOpenChange={(o) => { if (!o) closeToggleStatus(); else setToggleOpen(true); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {isToggleQuitar ? 'Confirmar Quitação' : 'Confirmar Reabertura'}
            </DialogTitle>
            <DialogDescription className="pt-1 text-sm text-slate-600">
              {toggleTarget && (
                <span>
                  Lançamento <span className="font-bold text-slate-800">#{toggleTarget.id} · {toggleTarget.descricao || 'Sem descrição'}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-3">
            {isToggleQuitar ? (
              <div>
                <p className="py-2 text-sm text-slate-600">
                  Informe a Data Real de Pagamento para registrar a quitação deste lançamento.
                </p>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-semibold text-slate-700">
                    Data Real de Pagamento
                  </label>
                  <Input
                    type="date"
                    value={confirmDtPag}
                    onChange={(e) => setConfirmDtPag(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <p className="py-2 text-sm text-slate-600">
                Ao confirmar, o lançamento voltará para o status <b className="text-amber-700">Pendente</b> e a Data Real de Pagamento será removida.
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeToggleStatus}
              disabled={toggleSaving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={toggleSaving}
              onClick={submitToggleStatus}
              className={cn(
                isToggleQuitar
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              )}
            >
              {toggleSaving ? 'Processando...' : (isToggleQuitar ? 'Confirmar Quitação' : 'Confirmar Reabertura')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR LANÇAMENTO */}
      <Dialog open={editOpen} onOpenChange={(o) => { if (!o) closeEdit(); else setEditOpen(true); }}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>
              Editar Lançamento <span className="text-[#006397]">#{editTarget?.id ?? ''}</span>
            </DialogTitle>
            <DialogDescription className="pt-1 text-sm text-slate-600">
              Altere os campos abaixo e clique em Salvar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Descrição</label>
              <Input
                value={editForm.descricao}
                onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                placeholder="Descrição do lançamento"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Valor (R$)</label>
              <Input
                type="text"
                inputMode="decimal"
                value={editForm.valor}
                onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Parcelas</label>
              <Input
                value={editForm.parcelas}
                onChange={(e) => setEditForm({ ...editForm, parcelas: e.target.value })}
                placeholder="Ex: 1/3"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Data de Vencimento</label>
              <Input
                type="date"
                value={editForm.dt_faturamento}
                onChange={(e) => setEditForm({ ...editForm, dt_faturamento: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Centro de Custo</label>
              <Select
                value={editForm.centro_custo_id || '0'}
                onValueChange={(v) => setEditForm({ ...editForm, centro_custo_id: String(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Centro de Custo" />
                </SelectTrigger>
                <SelectContent>
                  {centrosCusto.map((c) => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Tipo de Lançamento</label>
              <Select
                value={editForm.tipo_lancamento_id || '0'}
                onValueChange={(v) => setEditForm({ ...editForm, tipo_lancamento_id: String(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Lançamento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposLancamento.map((t) => (
                    <SelectItem key={String(t.id)} value={String(t.id)}>
                      {t.nome} ({String(t.tipo || 'saída').toLowerCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[12px] font-semibold text-slate-700">Observações</label>
              <Textarea
                rows={3}
                value={editForm.observacoes}
                onChange={(e) => setEditForm({ ...editForm, observacoes: e.target.value })}
                placeholder="Observações internas (opcional)"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeEdit}
              disabled={editSaving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={editSaving}
              onClick={submitEdit}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {editSaving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EXCLUIR LANÇAMENTO */}
      <Dialog open={deleteOpen} onOpenChange={(o) => { if (!o) closeDelete(); else setDeleteOpen(true); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="!text-rose-700">
              Excluir Lançamento
            </DialogTitle>
            <DialogDescription className="pt-1 text-sm text-slate-600">
              {deleteTarget ? (
                <span>Lançamento <span className="font-bold text-slate-800">#{deleteTarget.id} · {deleteTarget.descricao || 'Sem descrição'}</span></span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-rose-700 text-sm">Essa exclusão não é reversível!</p>
                <p className="text-sm text-rose-700/80 mt-0.5">
                  Se este lançamento for de OS, todos os lançamentos vinculados à mesma OS também serão excluídos automaticamente.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDelete}
              disabled={deleteSaving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteSaving}
              onClick={submitDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleteSaving ? 'Excluindo...' : 'Excluir lançamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
