import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import * as toastrNS from 'toastr';
import 'toastr/build/toastr.min.css';
const toastr = toastrNS && (toastrNS.default || toastrNS.toastr || toastrNS);
import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  Percent,
  DollarSign,
  Plus,
  Search,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  Power,
  BarChart3,
  RefreshCcw,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/react/Components/ui/card';
import { Button } from '@/react/Components/ui/button';
import { Badge } from '@/react/Components/ui/badge';
import { Input } from '@/react/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/react/Components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/react/Components/ui/dialog';

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

const OPCOES_APLICAVEL = [
  { value: 'Vendas Gerais (Todos os Painéis)', label: 'Vendas Gerais (Todos os Painéis)' },
  { value: 'Painéis Digitais / Circuito LED', label: 'Painéis Digitais / Circuito LED' },
  { value: 'Taxa de Instalação & Colagem OOH', label: 'Taxa de Instalação & Colagem OOH' },
  { value: 'Agência Parceira / BV Autorizado', label: 'Agência Parceira / BV Autorizado' },
  { value: 'Bonificação Bi-semana Atingida', label: 'Bonificação Bi-semana Atingida' },
  { value: 'TopSight e Frontlight', label: 'TopSight e Frontlight' },
  { value: 'Contratos Anuais', label: 'Contratos Anuais' },
  { value: 'Operações de Rua', label: 'Operações de Rua' },
  { value: 'Empenas e Rodovias', label: 'Empenas e Rodovias' },
  { value: 'Serviços Customizados (PI e OS)', label: 'Serviços Customizados (PI e OS)' },
];

function formatarValorBR(v) {
  const n = Number(v) || 0;
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseValorMonetario(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const s = String(v).replace(/[^0-9,.-]/g, '');
  const temVirgula = s.includes(',');
  const normal = temVirgula ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = parseFloat(normal);
  return Number.isFinite(n) ? n : 0;
}

export default function ComissoesCadastroPage(props) {
  const page = usePage();
  const csrf = page?.props?.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content || '';
  const initialList = props.comissoes || [];
  const initialPagination = props.pagination || {};
  const initialFilters = props.filters || {};
  const agregados = props.agregados || {};

  const serverSearch = initialFilters.search || '';
  const serverTipo = initialFilters.tipo || 'todos';
  const serverStatus = initialFilters.status || 'todos';

  const [list, setList] = useState(initialList);
  const [loading, setLoading] = useState(false);

  const [calculationType, setCalculationType] = useState('percentage');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [aplicavel_a, setAplicavel_a] = useState('Vendas Gerais (Todos os Painéis)');
  const [statusRegistro, setStatusRegistro] = useState('1');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState(serverSearch);
  const [typeFilter, setTypeFilter] = useState(serverTipo);
  const [statusFilter, setStatusFilter] = useState(serverStatus);
  const [currentPage, setCurrentPage] = useState(Number(initialPagination.page) || 1);
  const [perPageState, setPerPageState] = useState(Number(initialPagination.perPage) || 50);
  const itemsPerPage = perPageState;

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);

  useEffect(() => {
    if (props.flash?.success) {
      setFeedbackMessage(props.flash.success);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  }, [props.flash]);

  const recarregarLista = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (typeFilter && typeFilter !== 'todos') params.set('tipo', typeFilter);
    if (statusFilter && statusFilter !== 'todos') params.set('status', statusFilter);
    params.set('page', String(currentPage));
    params.set('perPage', String(perPageState));
    router.get('/cadastro-comissoes', Object.fromEntries(params.entries()), {
      preserveState: false,
      preserveScroll: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
    });
  };

  const handleClear = () => {
    setCalculationType('percentage');
    setNome('');
    setDescricao('');
    setValor('');
    setAplicavel_a('Vendas Gerais (Todos os Painéis)');
    setStatusRegistro('1');
    setEditingId(null);
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setNome(rule.nome);
    setDescricao(rule.descricao || '');
    setCalculationType(rule.calculationType || (rule.tipo_comissao === 2 ? 'fixed' : 'percentage'));
    setValor(formatarValorBR(rule.valor));
    setAplicavel_a(rule.aplicavel_a || 'Vendas Gerais (Todos os Painéis)');
    setStatusRegistro(String(rule.status_num ?? 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();

    if (!nome.trim()) {
      toastr.error('Por favor, informe o nome / regra da comissão.');
      return;
    }
    const valNum = parseValorMonetario(valor);
    if (!(valNum > 0)) {
      toastr.error('Por favor, informe um valor válido maior que zero.');
      return;
    }

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      calculationType,
      tipo_comissao: calculationType === 'fixed' ? 2 : 1,
      valor: valNum,
      aplicavel_a: aplicavel_a || 'Vendas Gerais (Todos os Painéis)',
      status: statusRegistro === '1' ? 1 : 0,
    };

    setSaving(true);
    try {
      let res;
      if (editingId) {
        res = await axios.put(`/cadastro-comissoes/${editingId}`, payload, {
          headers: { 'X-CSRF-TOKEN': csrf },
        });
      } else {
        res = await axios.post('/cadastro-comissoes', payload, {
          headers: { 'X-CSRF-TOKEN': csrf },
        });
      }
      const data = res.data;
      if (data?.success) {
        toastr.success(data.message || 'Sucesso.');
        setFeedbackMessage(data.message || 'Sucesso.');
        setTimeout(() => setFeedbackMessage(null), 4000);
        handleClear();
        recarregarLista();
      } else {
        toastr.error(data?.message || 'Não foi possível salvar a comissão.');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[Object.keys(err.response.data.errors || {})[0]]?.[0] ||
        'Erro ao salvar a comissão.';
      toastr.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rule) => {
    try {
      const res = await axios.post(`/cadastro-comissoes/${rule.id}/toggle-status`, {}, {
        headers: { 'X-CSRF-TOKEN': csrf },
      });
      if (res.data?.success) {
        toastr.success(res.data.message);
        recarregarLista();
      } else {
        toastr.error(res.data?.message || 'Erro ao alterar o status.');
      }
    } catch (err) {
      toastr.error(err?.response?.data?.message || 'Erro ao alterar o status.');
    }
  };

  const abrirExcluir = (rule) => {
    setDeleteTarget(rule);
    setConfirmDeleteOpen(true);
  };

  const confirmarExcluir = async () => {
    if (!deleteTarget) return;
    setDeleteSaving(true);
    try {
      const res = await axios.delete(`/cadastro-comissoes/${deleteTarget.id}`, {
        headers: { 'X-CSRF-TOKEN': csrf },
      });
      if (res.data?.success) {
        toastr.success(res.data.message);
        recarregarLista();
      } else {
        toastr.error(res.data?.message || 'Erro ao excluir comissão.');
      }
    } catch (err) {
      toastr.error(err?.response?.data?.message || 'Erro ao excluir comissão.');
    } finally {
      setDeleteSaving(false);
      setConfirmDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  const filteredCommissions = useMemo(() => list, [list]);
  const totalPages = Math.max(
    1,
    Number(initialPagination.ultimaPagina) || Math.ceil(filteredCommissions.length / itemsPerPage) || 1
  );

  const navegarHome = () => router.visit('/dashboard');
  const navegarFinanceiro = () => router.visit('/caixa');

  return (
    <AppLayout navbarActiveTab="financeiro">
      <Head title="Cadastro de Comissões - SGEP" />

      <div className="flex flex-col w-full animate-fade-in pb-20 bg-slate-50/50 min-h-screen pt-16">
        <div className="px-4 md:px-8 py-2.5 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <button
              onClick={navegarHome}
              className="flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Início</span>
            </button>
            <span>/</span>
            <button
              onClick={navegarFinanceiro}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Financeiro
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Cadastro de Comissões - Novo</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Ambiente Produção</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-semibold">Regras Vigentes</span>
            </div>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#006397] transition-colors font-medium cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Regulamento OOH</span>
            </button>
          </div>
        </div>

        <div className="bg-white border-b border-slate-200 px-4 md:px-8 flex items-center gap-1 shadow-2xs">
          <button
            type="button"
            onClick={navegarFinanceiro}
            className="py-3 px-4 text-sm font-medium border-b-2 border-transparent text-slate-600 hover:text-[#006397] hover:border-slate-300 flex items-center gap-2 transition-all cursor-pointer group"
          >
            <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-[#006397]" />
            <span>Visão Geral Financeira</span>
          </button>
          <button
            type="button"
            className="py-3 px-4 text-sm font-bold border-b-2 border-[#006397] text-[#006397] flex items-center gap-2 cursor-pointer"
          >
            <Percent className="w-4 h-4 text-[#006397]" />
            <span>Cadastro de Comissões - Novo</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#006397] text-white">
              NOVO
            </span>
          </button>
        </div>

        <div className="px-4 md:px-8 py-5 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-9 bg-[#006397] rounded-full flex-shrink-0" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                  Cadastro de Comissões
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure percentuais e valores de bonificação usados na emissão de PIs e OSs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 w-full grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="rounded-2xl border border-slate-200/90 shadow-2xs bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Cadastradas
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {agregados.totalCadastros ?? list.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-sky-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 shadow-2xs bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Ativas
                </p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {agregados.totalAtivos ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 shadow-2xs bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Inativas
                </p>
                <p className="text-2xl font-bold text-slate-500 mt-1">
                  {agregados.totalInativos ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Power className="w-5 h-5 text-slate-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 shadow-2xs bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  % Percentuais
                </p>
                <p className="text-2xl font-bold text-[#006397] mt-1">
                  {agregados.totalPercentuais ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Percent className="w-5 h-5 text-[#006397]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200/90 shadow-2xs bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Valores Fixos
                </p>
                <p className="text-2xl font-bold text-amber-800 mt-1">
                  {agregados.totalFixos ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {feedbackMessage && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-medium shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{feedbackMessage}</span>
              </div>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-4">
              <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#006397]" />
                      <h2 className="text-sm font-bold text-slate-900">
                        {editingId ? 'Editar Comissão' : 'Cadastrar Comissão'}
                      </h2>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-[#006397] border-blue-200 text-[11px] font-semibold"
                    >
                      {editingId ? `#${editingId}` : 'Nova Regra'}
                    </Badge>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tipo de Cálculo *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCalculationType('percentage')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            calculationType === 'percentage'
                              ? 'bg-blue-50 text-[#006397] border border-[#006397]/30 shadow-2xs font-bold'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Percent className="w-3.5 h-3.5" />
                          <span>% Porcentagem (%)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCalculationType('fixed')}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            calculationType === 'fixed'
                              ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs font-bold'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Valor Fixo (R$)</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Nome / Regra da Comissão *
                      </label>
                      <div className="relative">
                        <Input
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Ex: Comissão Padrão Vendedor Externo"
                          className="text-xs bg-slate-50/70 border-slate-200 pr-9 rounded-lg"
                          required
                        />
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Identificador amigável exibido nas propostas e fechamentos.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Subtítulo / Descrição da Regra
                      </label>
                      <Input
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Ex: Comissão base para locação padrão"
                        className="text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {calculationType === 'percentage'
                          ? 'Taxa Percentual (%) *'
                          : 'Valor Fixo (R$) *'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          {calculationType === 'percentage' ? '%' : 'R$'}
                        </span>
                        <Input
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                          placeholder={calculationType === 'percentage' ? 'Ex: 5,00' : 'Ex: 100,00'}
                          className="pl-9 text-xs font-mono font-bold text-slate-900 bg-slate-50/70 border-slate-200 rounded-lg"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {calculationType === 'percentage'
                          ? 'Defina a alíquota em percentual sobre o valor líquido (bruto - desconto).'
                          : 'Defina o montante nominal fixo em reais a ser creditado.'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Aplicável a
                      </label>
                      <Select value={aplicavel_a} onValueChange={setAplicavel_a} disabled>
                        <SelectTrigger className="text-xs bg-slate-50/70 border-slate-200 rounded-lg">
                          <SelectValue placeholder="Selecione o escopo" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPCOES_APLICAVEL.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </label>
                      <Select value={statusRegistro} onValueChange={setStatusRegistro}>
                        <SelectTrigger className="text-xs bg-slate-50/70 border-slate-200 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ativa (usar em novas PIs / OSs)</SelectItem>
                          <SelectItem value="0">Inativa (não selecionar automaticamente)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-[#006397] hover:bg-[#004b73] text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs cursor-pointer gap-1.5 disabled:opacity-70"
                      >
                        {saving ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                            Salvando...
                          </>
                        ) : editingId ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Salvar Alteração
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Cadastrar Comissão
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
                        className="text-xs text-slate-600 hover:text-slate-900 border-slate-200 rounded-lg cursor-pointer px-3"
                      >
                        {editingId ? 'Cancelar' : 'Limpar'}
                      </Button>
                    </div>
                  </form>

                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-blue-900 flex items-start gap-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-[#006397] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-950/90 leading-relaxed font-medium">
                      Alterações em percentuais são aplicadas unicamente aos novos contratos gerados no pipeline comercial.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-sm md:text-base font-bold text-slate-900">
                        Comissões Cadastradas
                      </h2>
                      <p className="text-xs text-slate-500">
                        Regras ativas no cálculo automatizado do financeiro
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                      <div className="relative flex-1 sm:w-48 md:w-56">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') recarregarLista();
                          }}
                          placeholder="Buscar regra..."
                          className="pl-8 text-xs bg-slate-50/70 border-slate-200 rounded-lg h-8"
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={recarregarLista}
                        disabled={loading}
                        className="text-xs h-8 cursor-pointer"
                      >
                        <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      </Button>

                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setTypeFilter('todos');
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            typeFilter === 'todos'
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTypeFilter('percentual');
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            typeFilter === 'percentual'
                              ? 'bg-white text-[#006397] shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Percentual
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTypeFilter('fixo');
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            typeFilter === 'fixo'
                              ? 'bg-white text-amber-800 shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Fixo
                        </button>
                      </div>

                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('todos');
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            statusFilter === 'todos'
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('ativos');
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            statusFilter === 'ativos'
                              ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Ativas
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('inativos');
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            statusFilter === 'inativos'
                              ? 'bg-white text-slate-500 shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Inativas
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-3">ID</th>
                          <th className="py-2.5 px-3">Descrição / Regra</th>
                          <th className="py-2.5 px-3">Tipo</th>
                          <th className="py-2.5 px-3 text-right">Valor Aplicado</th>
                          <th className="py-2.5 px-3 text-center">Aplicável a</th>
                          <th className="py-2.5 px-3 text-center">Atualização</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredCommissions.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-slate-400">
                              Nenhuma comissão encontrada para os critérios selecionados.
                            </td>
                          </tr>
                        )}

                        {filteredCommissions.map((rule) => {
                          const isPercentage =
                            rule.calculationType === 'percentage' ||
                            Number(rule.tipo_comissao) === 1;
                          const isAtivo = rule.status === 'Ativo' || Number(rule.status_num) === 1;

                          return (
                            <tr
                              key={rule.id}
                              className={`hover:bg-slate-50/70 transition-colors ${
                                editingId === rule.id ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              <td className="py-3 px-3 font-mono font-medium text-slate-500 whitespace-nowrap">
                                #{rule.id}
                              </td>

                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900 leading-tight">
                                  {rule.nome}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {rule.descricao || '—'}
                                </div>
                              </td>

                              <td className="py-3 px-3 whitespace-nowrap">
                                {isPercentage ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100/70 text-sky-800 border border-sky-200">
                                    % Porcentagem
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100/70 text-amber-800 border border-amber-200">
                                    Valor Fixo
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right font-bold whitespace-nowrap">
                                {isPercentage ? (
                                  <span className="text-[#006397] font-mono">
                                    {formatarValorBR(rule.valor)}%
                                  </span>
                                ) : (
                                  <span className="text-amber-900 font-mono">
                                    R$ {formatarValorBR(rule.valor)}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-center text-slate-600 max-w-[220px]">
                                <span className="text-[11px]">{rule.aplicavel_a || '—'}</span>
                              </td>

                              <td className="py-3 px-3 text-center text-slate-500 font-mono whitespace-nowrap">
                                {rule.updatedAt || rule.createdAt || '—'}
                              </td>

                              <td className="py-3 px-3 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(rule)}
                                  title={isAtivo ? 'Clique para inativar' : 'Clique para ativar'}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer transition-colors ${
                                    isAtivo
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  <Power className="w-3 h-3" />
                                  {rule.status || (isAtivo ? 'Ativo' : 'Inativo')}
                                </button>
                              </td>

                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    title="Editar regra"
                                    onClick={() => handleEdit(rule)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    title={isAtivo ? 'Inativar' : 'Ativar'}
                                    onClick={() => handleToggleStatus(rule)}
                                    className="p-1 rounded-md text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
                                  >
                                    <Power className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    title="Excluir regra"
                                    onClick={() => abrirExcluir(rule)}
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                      Mostrando{' '}
                      <span className="font-semibold text-slate-800">
                        {initialPagination.de ?? filteredCommissions.length}
                      </span>{' '}
                      de{' '}
                      <span className="font-semibold text-slate-800">
                        {initialPagination.totalItens ?? filteredCommissions.length}
                      </span>{' '}
                      comissões cadastradas
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <label className="mb-0">Página</label>
                        <Select
                          value={String(perPageState)}
                          onValueChange={(v) => {
                            setPerPageState(Number(v));
                            setCurrentPage(1);
                            setTimeout(recarregarLista, 0);
                          }}
                        >
                          <SelectTrigger className="h-7 w-20 text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage <= 1 || loading}
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            setTimeout(recarregarLista, 0);
                          }}
                          className="cursor-pointer h-7 w-7 p-0"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>

                        <span className="text-[11px] font-mono px-2">
                          {currentPage} / {totalPages}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage >= totalPages || loading}
                          onClick={() => {
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                            setTimeout(recarregarLista, 0);
                          }}
                          className="cursor-pointer h-7 w-7 p-0"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <DialogContent className="max-w-md bg-white rounded-2xl p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 text-[#006397] mb-1">
                <HelpCircle className="w-5 h-5" />
                <DialogTitle className="text-base font-bold text-slate-900">
                  Regulamento de Comissões OOH
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-500">
                Diretrizes de cálculo e repasse para o fechamento financeiro
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs text-slate-600 pt-2 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1">1. Base de Cálculo</h4>
                <p>
                  As alíquotas percentuais incidem sobre o valor líquido faturado (valor bruto −
                  descontos concedidos ao anunciante).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1">2. Valores Fixos</h4>
                <p>
                  Os valores fixos (como taxas de instalação e bonificações de equipe de rua) são
                  creditados por face colada ou meta atingida na respectiva bi-semana.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1">3. Vigência e Bloqueios</h4>
                <p>
                  Contratos já formalizados e com Pedido de Inserção (PI) emitido mantêm as
                  alíquotas contratadas na data de emissão.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  4. Integração com PIs e OSs
                </h4>
                <p className="text-amber-900/90">
                  As regras cadastradas nesta tela estão disponíveis para vínculo com Funcionário ×
                  Serviço e serão utilizadas como referência no cálculo automático das comissões ao
                  gerar novas PIs e Ordens de Serviço (OS).
                </p>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                onClick={() => setIsHelpOpen(false)}
                className="bg-[#006397] hover:bg-[#004b73] text-white text-xs px-4 cursor-pointer"
              >
                Entendido
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogContent className="max-w-md bg-white rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                Confirmação de exclusão
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                A remoção é soft-delete e pode ser revertida manualmente no banco.
              </DialogDescription>
            </DialogHeader>
            <div className="py-3 text-xs text-slate-700">
              Tem certeza que deseja remover a comissão{' '}
              <strong>
                #{deleteTarget?.id} — {deleteTarget?.nome}
              </strong>
              ?
            </div>
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setDeleteTarget(null);
                }}
                disabled={deleteSaving}
                className="text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarExcluir}
                disabled={deleteSaving}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs cursor-pointer gap-1"
              >
                {deleteSaving ? (
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Confirmar exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
