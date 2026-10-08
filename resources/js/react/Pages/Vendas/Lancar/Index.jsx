import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import * as toastrNS from 'toastr';
import 'toastr/build/toastr.min.css';
const toastr = toastrNS && (toastrNS.default || toastrNS.toastr || toastrNS);
import Swal from 'sweetalert2';

import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Download,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Layers,
  Calendar,
  X,
  Building,
  User,
  Sparkles,
  Check,
  Trash2,
  Info,
  CreditCard,
  Printer,
  Eye,
  Ban,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Loader2,
  FileCheck,
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
} from '@/react/Components/ui/dialog';
import { Textarea } from '@/react/Components/ui/textarea';
import { Card, CardContent } from '@/react/Components/ui/card';
import { Badge } from '@/react/Components/ui/badge';
import { cn } from '@/react/lib/utils';

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  timeOut: 3500,
};

function formatMoney(v) {
  if (v === null || v === undefined || v === '') return '0,00';
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/\./g, '').replace(',', '.'));
  if (isNaN(n)) return '0,00';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseMoney(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  const s = String(v).replace(/\D/g, '');
  if (!s) return 0;
  return parseInt(s, 10) / 100;
}

function brl(v) {
  return `R$ ${formatMoney(v)}`;
}

function getInitials(str) {
  const s = String(str || '').trim();
  if (!s) return 'OS';
  const partes = s.split(/\s+/).filter(Boolean);
  let res = partes[0][0] || '';
  if (partes.length > 1) res += partes[partes.length - 1][0] || '';
  return res.toUpperCase();
}

function formatLocalDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addMonthsLocal(dateStr, monthsToAdd) {
  const [yyyy, mm, dd] = (dateStr || '').split('-').map(n => parseInt(n, 10));
  const d = new Date(yyyy || new Date().getFullYear(), (mm ? mm - 1 : new Date().getMonth()), dd || new Date().getDate());
  d.setMonth(d.getMonth() + monthsToAdd);
  return formatLocalDate(d);
}

// ==============================================================================
// MODAL STEPPER: NOVA ORDEM DE SERVIÇO (VENDA)
// ==============================================================================
function NovaVendaModal({
  isOpen,
  onClose,
  clientes = [],
  bisemanas = [],
  vendedores = [],
  agentes = [],
  servicos = [],
  ufs = [],
  currentBiSemana = null,
  onSuccess,
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // --- Step 1: Cliente & Contato ---
  const [clienteSearch, setClienteSearch] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [contato, setContato] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [num, setNum] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  // --- Step 2: Campanha & Responsáveis ---
  const [campanha, setCampanha] = useState('');
  const [bisemanaId, setBisemanaId] = useState(currentBiSemana?.id ? String(currentBiSemana.id) : '');
  const [vendedorId, setVendedorId] = useState(vendedores[0]?.id ? String(vendedores[0].id) : '');
  const [agentesSelecionados, setAgentesSelecionados] = useState([]);
  const [agenteSearch, setAgenteSearch] = useState('');
  const [isAgenteDropdownOpen, setIsAgenteDropdownOpen] = useState(false);

  // --- Step 3: Serviços ---
  const [servicosAdicionados, setServicosAdicionados] = useState([]);
  const [servicoId, setServicoId] = useState('0');
  const [servicoNome, setServicoNome] = useState('');
  const [servicoQtd, setServicoQtd] = useState(1);
  const [servicoBonificado, setServicoBonificado] = useState(0);
  const [servicoVlrUnit, setServicoVlrUnit] = useState('');
  const [servicoVlrDesc, setServicoVlrDesc] = useState('');
  const [servicoVlrCusto, setServicoVlrCusto] = useState('');
  const [servicoDetalhes, setServicoDetalhes] = useState('');

  // --- Step 4: Pagamento & Parcelamento ---
  const [formaPgto, setFormaPgto] = useState('4'); // 4: Boleto
  const [parcelado, setParcelado] = useState('1'); // 1: Sim
  const [qtdParcelas, setQtdParcelas] = useState(1);
  const [dtPgto, setDtPgto] = useState(formatLocalDate(new Date()));
  const [parcelas, setParcelas] = useState([]);

  // --- Step 5: Observações ---
  const [observacao, setObservacao] = useState('');

  // Reset when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setIsSubmitting(false);
    if (previewPdfUrl) {
      try { URL.revokeObjectURL(previewPdfUrl); } catch (_) { }
      setPreviewPdfUrl(null);
    }
    setShowPreviewModal(false);

    setClienteSearch('');
    setIsClientDropdownOpen(false);
    setClienteSelecionado(null);
    setContato('');
    setTelefone('');
    setEmail('');
    setEndereco('');
    setNum('');
    setCidade('');
    setUf('');

    setCampanha('');
    setBisemanaId(currentBiSemana?.id ? String(currentBiSemana.id) : (bisemanas[0]?.id ? String(bisemanas[0].id) : ''));
    setVendedorId(vendedores[0]?.id ? String(vendedores[0].id) : '');
    setAgentesSelecionados([]);

    setServicosAdicionados([]);
    setServicoId('0');
    setServicoNome('');
    setServicoQtd(1);
    setServicoBonificado(0);
    setServicoVlrUnit('');
    setServicoVlrDesc('');
    setServicoVlrCusto('');
    setServicoDetalhes('');

    setFormaPgto('4');
    setParcelado('1');
    setQtdParcelas(1);
    setDtPgto(formatLocalDate(new Date()));
    setParcelas([]);
    setObservacao('');
  }, [isOpen]);

  // Handle client selection
  const handleSelectClient = (c) => {
    setClienteSelecionado(c);
    setClienteSearch(c.nome_fantasia || c.razao_social);
    setIsClientDropdownOpen(false);

    setContato(c.responsavel || c.tel_responsavel || '');
    setTelefone(c.telefone || c.celular || c.tel_responsavel || '');
    setEmail(c.email || c.email_responsavel || '');
    setEndereco(c.endereco || '');
    setNum(c.num || '');
    setCidade(c.cidade || '');
    setUf(c.uf || '');
  };

  const filteredClientes = useMemo(() => {
    if (!clienteSearch.trim()) return clientes.slice(0, 50);
    const s = clienteSearch.toLowerCase();
    return clientes.filter(c =>
      (c.nome_fantasia && c.nome_fantasia.toLowerCase().includes(s)) ||
      (c.razao_social && c.razao_social.toLowerCase().includes(s)) ||
      (c.cpf_cnpj && c.cpf_cnpj.includes(s))
    ).slice(0, 50);
  }, [clientes, clienteSearch]);

  // Handle service template pick
  const handleSelectPredefinedService = (idVal) => {
    setServicoId(idVal);
    if (idVal === '0' || idVal === 'custom') {
      setServicoNome('');
      setServicoVlrUnit('');
      return;
    }
    const found = servicos.find(s => String(s.id) === String(idVal));
    if (found) {
      setServicoNome(found.nome);
      setServicoVlrUnit(formatMoney(found.valor || 0));
      setServicoDetalhes(found.descricao || '');
    }
  };

  // Add service row
  const handleAddServico = () => {
    const nome = servicoNome.trim();
    if (!nome) {
      toastr.warning('Informe o nome ou selecione um serviço.');
      return;
    }
    const qtd = parseInt(servicoQtd, 10) || 0;
    if (qtd <= 0) {
      toastr.warning('A quantidade deve ser maior que 0.');
      return;
    }
    const vlrUnit = parseMoney(servicoVlrUnit);
    if (vlrUnit <= 0) {
      toastr.warning('O valor unitário deve ser maior que zero.');
      return;
    }
    const vlrDesc = parseMoney(servicoVlrDesc);
    if (vlrDesc > vlrUnit) {
      toastr.warning('O desconto unitário não pode ser maior que o valor unitário.');
      return;
    }
    const vlrCusto = parseMoney(servicoVlrCusto);
    const bonif = Math.min(qtd, parseInt(servicoBonificado, 10) || 0);
    const qtdCobrada = Math.max(0, qtd - bonif);
    const vlrTotal = (vlrUnit - vlrDesc) * qtdCobrada;
    const vlrTotalFin = (vlrUnit - vlrDesc - vlrCusto) * qtdCobrada;

    const novoItem = {
      id: servicoId !== '0' && servicoId !== 'custom' ? Number(servicoId) : Date.now(),
      nome,
      quantidade: qtd,
      bonificado: bonif,
      qtd_cobrada: qtdCobrada,
      vlr_unit: vlrUnit,
      vlr_desc: vlrDesc,
      vlr_custo: vlrCusto,
      vlr_total: vlrTotal,
      vlr_total_fin: vlrTotalFin,
      detalhes: servicoDetalhes,
    };

    setServicosAdicionados(prev => [...prev, novoItem]);
    setServicoId('0');
    setServicoNome('');
    setServicoQtd(1);
    setServicoBonificado(0);
    setServicoVlrUnit('');
    setServicoVlrDesc('');
    setServicoVlrCusto('');
    setServicoDetalhes('');
    toastr.success(`Serviço "${nome}" adicionado!`);
  };

  const handleRemoveServico = (idx) => {
    setServicosAdicionados(prev => prev.filter((_, i) => i !== idx));
  };

  // Totals of added services
  const totalServicos = useMemo(() => {
    return servicosAdicionados.reduce((sum, s) => sum + (s.vlr_total || 0), 0);
  }, [servicosAdicionados]);

  const totalBruto = useMemo(() => {
    return servicosAdicionados.reduce((sum, s) => sum + ((s.vlr_unit || 0) * (s.qtd_cobrada || s.quantidade || 0)), 0);
  }, [servicosAdicionados]);

  const totalDescontos = useMemo(() => {
    return servicosAdicionados.reduce((sum, s) => sum + ((s.vlr_desc || 0) * (s.qtd_cobrada || s.quantidade || 0)), 0);
  }, [servicosAdicionados]);

  // Recalculate installments
  const recalcularParcelas = (qtd = qtdParcelas, totalAlvo = totalServicos, dtBase = dtPgto) => {
    const q = parseInt(qtd, 10) || 1;
    if (q <= 0 || totalAlvo <= 0) {
      setParcelas([]);
      return;
    }
    const base = Math.floor((totalAlvo / q) * 100) / 100;
    const resto = parseFloat((totalAlvo - base * (q - 1)).toFixed(2));
    const novas = [];
    for (let i = 0; i < q; i++) {
      novas.push({
        valor: i === q - 1 ? resto : base,
        data: addMonthsLocal(dtBase, i),
      });
    }
    setParcelas(novas);
  };

  // Watch for installments generation
  useEffect(() => {
    if (parcelado === '1' && Number(formaPgto) >= 3) {
      recalcularParcelas(qtdParcelas, totalServicos, dtPgto);
    } else {
      setParcelas([]);
    }
  }, [parcelado, formaPgto, qtdParcelas, totalServicos, dtPgto]);

  // Adjust remaining installments when user edits the 1st installment
  const handleParcelaValorChange = (index, novoValorStr) => {
    const valorDigitado = parseMoney(novoValorStr);
    const novas = [...parcelas];
    novas[index] = { ...novas[index], valor: valorDigitado };

    if (index === 0 && novas.length > 1) {
      const restantes = novas.length - 1;
      const totalRestante = Math.max(0, totalServicos - valorDigitado);
      const base = Math.floor((totalRestante / restantes) * 100) / 100;
      const resto = parseFloat((totalRestante - base * (restantes - 1)).toFixed(2));
      for (let k = 1; k < novas.length; k++) {
        novas[k] = { ...novas[k], valor: k === novas.length - 1 ? resto : base };
      }
    } else {
      // Ajusta centavos na última
      const n = novas.length;
      let somaOutras = 0;
      for (let i = 0; i < n - 1; i++) {
        somaOutras += Number(novas[i].valor || 0);
      }
      novas[n - 1] = {
        ...novas[n - 1],
        valor: Math.max(0, parseFloat((totalServicos - somaOutras).toFixed(2))),
      };
    }
    setParcelas(novas);
  };

  // Compile full payload
  const buildPayload = () => {
    const vendedorObj = vendedores.find(v => String(v.id) === String(vendedorId));
    return {
      One: {
        clienteId: clienteSelecionado?.id || null,
        clienteNome: clienteSelecionado ? (clienteSelecionado.nome_fantasia || clienteSelecionado.razao_social) : clienteSearch,
        cpf_cnpj: clienteSelecionado?.cpf_cnpj || '',
        responsavel: contato,
        telefone,
        email,
        endereco,
        num,
        cidade,
        uf,
      },
      Two: {
        campanha: campanha.trim(),
        bisemanaId: bisemanaId ? Number(bisemanaId) : null,
        vendedorId: vendedorId ? Number(vendedorId) : null,
        vendedor: vendedorObj ? vendedorObj.nome : '',
        agentesId: agentesSelecionados.map(a => a.id),
        paineis: ['VENDA'],
      },
      Four: {
        servicos: servicosAdicionados,
        formaPgto: Number(formaPgto) || 4,
        pgto: 0,
        parcelado: Number(parcelado) || 0,
        qtdParcelas: Number(qtdParcelas) || 1,
        dtPgto,
        parcelasDetalhe: parcelas.map(p => ({
          valor: p.valor,
          data: p.data,
        })),
        vlr_total: totalServicos,
      },
      Five: {
        observacao,
      },
    };
  };

  // Handle PDF Preview
  const handlePreviewPdf = async () => {
    if (!clienteSelecionado) {
      toastr.warning('Selecione um cliente no Passo 1 antes de pré-visualizar.');
      return;
    }
    if (servicosAdicionados.length === 0) {
      toastr.warning('Adicione ao menos um serviço no Passo 3 antes de pré-visualizar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      await axios.post('/vendas/sessionData', { formVenda: payload });

      const resp = await axios.post('/vendas/lancar/preview', { formVenda: payload }, { responseType: 'blob' });
      if (resp?.data) {
        if (previewPdfUrl) {
          try { URL.revokeObjectURL(previewPdfUrl); } catch (_) { }
        }
        const blob = new Blob([resp.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setPreviewPdfUrl(url);
        setShowPreviewModal(true);
      }
    } catch (err) {
      console.error(err);
      toastr.error('Erro ao gerar pré-visualização da OS.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Save
  const handleFinalizarOS = async () => {
    if (!clienteSelecionado) {
      toastr.warning('Selecione um cliente válido.');
      setStep(1);
      return;
    }
    if (servicosAdicionados.length === 0) {
      toastr.warning('Adicione ao menos um serviço para a OS.');
      setStep(3);
      return;
    }

    const result = await Swal.fire({
      title: 'Confirmar emissão da OS?',
      html: `Deseja formalizar a Ordem de Serviço no valor total de <b>${brl(totalServicos)}</b> para o cliente <b>${clienteSelecionado.nome_fantasia || clienteSelecionado.razao_social}</b>?<br><br><span class="text-xs text-slate-500">Isso criará a OS oficial, os lançamentos financeiros no Caixa e gerará as vias em PDF.</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#006397',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sim, Finalizar e Salvar',
      cancelButtonText: 'Voltar e Revisar',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      const resp = await axios.post('/vendas/lancar/salvar', { formVenda: payload });

      if (resp.data && resp.data.cod === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Venda Lançada com Sucesso!',
          html: `
            <div class="text-left text-sm space-y-3 p-2 bg-slate-50 rounded-lg border border-slate-200 mt-2">
              <div><b>OS Nº:</b> #${resp.data.os_id}</div>
              <div><b>Cliente:</b> ${clienteSelecionado.nome_fantasia || clienteSelecionado.razao_social}</div>
              <div><b>Total Líquido:</b> ${brl(totalServicos)}</div>
              <div class="pt-2 flex flex-col gap-2">
                <a href="${resp.data.file_url}" target="_blank" class="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#006397] text-white text-xs font-bold rounded-md hover:bg-[#004e75]">
                  Abrir OS Cliente (PDF)
                </a>
                <a href="${resp.data.fin_url}" target="_blank" class="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-md hover:bg-slate-700">
                  Abrir OS Financeira (PDF)
                </a>
              </div>
            </div>
          `,
          confirmButtonColor: '#006397',
          confirmButtonText: 'OK, Concluir',
        });

        onSuccess && onSuccess();
        onClose();
      } else {
        toastr.error(resp.data?.msg || 'Erro ao salvar OS.');
      }
    } catch (err) {
      console.error(err);
      toastr.error(err?.response?.data?.msg || 'Falha ao comunicar com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#006397] flex items-center justify-center shadow-xs">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Lançar Nova Venda</h2>
                <p className="text-xs text-slate-500">Emissão de Ordem de Serviço (OS) com integração financeira</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between shrink-0 overflow-x-auto gap-2">
            {[
              { num: 1, label: 'Cliente & Contato' },
              { num: 2, label: 'Campanha' },
              { num: 3, label: 'Serviços' },
              { num: 4, label: 'Pagamento' },
              { num: 5, label: 'Conclusão' },
            ].map(s => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div
                  key={s.num}
                  onClick={() => { if (isDone) setStep(s.num); }}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer select-none transition-all py-1 px-2.5 rounded-lg',
                    isActive ? 'bg-white shadow-xs border border-blue-200 text-[#006397] font-bold' : isDone ? 'text-slate-700 hover:text-slate-900' : 'text-slate-400'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                      isActive ? 'bg-[#006397] text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </span>
                  <span className="text-xs whitespace-nowrap hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Step Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* ======================================================== */}
            {/* PASSO 1: CLIENTE & CONTATO */}
            {/* ======================================================== */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cliente <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={clienteSearch}
                      onChange={(e) => {
                        setClienteSearch(e.target.value);
                        setIsClientDropdownOpen(true);
                      }}
                      onFocus={() => setIsClientDropdownOpen(true)}
                      placeholder="Pesquise por Nome Fantasia, Razão Social ou CNPJ/CPF..."
                      className="pl-9 pr-8 text-sm"
                    />
                    {clienteSearch && (
                      <button
                        onClick={() => {
                          setClienteSearch('');
                          setClienteSelecionado(null);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isClientDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto p-1 text-sm divide-y divide-slate-50">
                      {filteredClientes.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400">Nenhum cliente encontrado.</div>
                      ) : (
                        filteredClientes.map(c => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectClient(c)}
                            className="p-2.5 hover:bg-blue-50/80 rounded-lg cursor-pointer flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 text-xs truncate">
                                {c.nome_fantasia || c.razao_social}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {c.cpf_cnpj || 'Sem CNPJ'} • {c.cidade || 'Sem Cidade'}
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-semibold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded shrink-0">
                              Selecionar
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {clienteSelecionado && (
                  <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#006397] text-white flex items-center justify-center font-bold text-xs">
                        {getInitials(clienteSelecionado.nome_fantasia)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {clienteSelecionado.nome_fantasia || clienteSelecionado.razao_social}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {clienteSelecionado.cpf_cnpj} • {clienteSelecionado.razao_social}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Cliente Selecionado</Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Contato / Responsável</label>
                    <Input
                      value={contato}
                      onChange={e => setContato(e.target.value)}
                      placeholder="Nome do responsável"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Telefone / Celular</label>
                    <Input
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
                    <Input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@empresa.com"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Endereço</label>
                    <Input
                      value={endereco}
                      onChange={e => setEndereco(e.target.value)}
                      placeholder="Rua, Avenida..."
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Número</label>
                    <Input
                      value={num}
                      onChange={e => setNum(e.target.value)}
                      placeholder="Ex: 100"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Cidade / UF</label>
                    <Input
                      value={cidade ? `${cidade} / ${uf}` : ''}
                      onChange={e => setCidade(e.target.value)}
                      placeholder="Cidade"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* PASSO 2: CAMPANHA & RESPONSÁVEIS */}
            {/* ======================================================== */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nome da Campanha
                    </label>
                    <Input
                      value={campanha}
                      onChange={e => setCampanha(e.target.value)}
                      placeholder="Ex: Lançamento de Inverno, Promoção Black Friday..."
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Bi-Semana Vinculada <span className="text-rose-500">*</span>
                    </label>
                    <Select value={String(bisemanaId)} onValueChange={setBisemanaId}>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Selecione a Bi-Semana" />
                      </SelectTrigger>
                      <SelectContent>
                        {bisemanas.map(b => (
                          <SelectItem key={b.id} value={String(b.id)} className="text-xs">
                            {b.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Vendedor Responsável <span className="text-rose-500">*</span>
                    </label>
                    <Select value={String(vendedorId)} onValueChange={setVendedorId}>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Selecione o Vendedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendedores.map(v => (
                          <SelectItem key={v.id} value={String(v.id)} className="text-xs">
                            {v.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Agentes de Comissão
                  </label>
                  <div className="relative">
                    <Input
                      value={agenteSearch}
                      onChange={e => {
                        setAgenteSearch(e.target.value);
                        setIsAgenteDropdownOpen(true);
                      }}
                      onFocus={() => setIsAgenteDropdownOpen(true)}
                      placeholder="Pesquise agentes de comissão..."
                      className="text-xs"
                    />

                    {isAgenteDropdownOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1 divide-y divide-slate-50">
                        {agentes
                          .filter(a => !agentesSelecionados.some(sel => sel.id === a.id))
                          .filter(a => !agenteSearch || a.nome.toLowerCase().includes(agenteSearch.toLowerCase()))
                          .map(a => (
                            <div
                              key={a.id}
                              onClick={() => {
                                setAgentesSelecionados(prev => [...prev, a]);
                                setAgenteSearch('');
                                setIsAgenteDropdownOpen(false);
                              }}
                              className="p-2 text-xs hover:bg-blue-50 cursor-pointer rounded-lg flex items-center justify-between"
                            >
                              <span className="font-semibold text-slate-800">{a.nome}</span>
                              <span className="text-[11px] font-mono text-slate-400">{a.cpf_cnpj}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Badges de agentes selecionados */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {agentesSelecionados.map(a => (
                      <span
                        key={a.id}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold"
                      >
                        {a.nome}
                        <button
                          type="button"
                          onClick={() => setAgentesSelecionados(prev => prev.filter(sel => sel.id !== a.id))}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {agentesSelecionados.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Nenhum agente vinculado (opcional).</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* PASSO 3: SERVIÇOS DA OS */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                {/* Form para adicionar serviço */}
                <div className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#006397]" /> Adicionar Serviço
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Modelo de Serviço</label>
                      <Select value={String(servicoId)} onValueChange={handleSelectPredefinedService}>
                        <SelectTrigger className="text-xs bg-white">
                          <SelectValue placeholder="Selecione um Serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Personalizado / Avulso</SelectItem>
                          {servicos.map(s => (
                            <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                              {s.nome} ({brl(s.valor)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Descrição do Serviço</label>
                      <Input
                        value={servicoNome}
                        onChange={e => setServicoNome(e.target.value)}
                        placeholder="Ex: Impressão de Lona 9x3m, Aplicação de Adesivo..."
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quantidade</label>
                      <Input
                        type="number"
                        min="1"
                        value={servicoQtd}
                        onChange={e => setServicoQtd(e.target.value)}
                        className="text-xs bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bonificados</label>
                      <Input
                        type="number"
                        min="0"
                        value={servicoBonificado}
                        onChange={e => setServicoBonificado(e.target.value)}
                        className="text-xs bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Valor Unitário</label>
                      <Input
                        value={servicoVlrUnit}
                        onChange={e => setServicoVlrUnit(e.target.value)}
                        placeholder="0,00"
                        className="text-xs bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Desconto Unit.</label>
                      <Input
                        value={servicoVlrDesc}
                        onChange={e => setServicoVlrDesc(e.target.value)}
                        placeholder="0,00"
                        className="text-xs bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Custo Unit.</label>
                      <Input
                        value={servicoVlrCusto}
                        onChange={e => setServicoVlrCusto(e.target.value)}
                        placeholder="0,00"
                        className="text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Detalhes Adicionais (opcional)</label>
                    <Input
                      value={servicoDetalhes}
                      onChange={e => setServicoDetalhes(e.target.value)}
                      placeholder="Ex: Entrega na sede, 440g fosca com ilhoses..."
                      className="text-xs bg-white"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddServico}
                      className="bg-[#006397] hover:bg-[#004e75] text-white text-xs gap-1.5 cursor-pointer font-bold shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar à OS
                    </Button>
                  </div>
                </div>

                {/* Tabela de Serviços Adicionados */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Serviços na OS ({servicosAdicionados.length})</span>
                    <span className="text-xs font-bold text-[#006397]">Total: {brl(totalServicos)}</span>
                  </div>

                  {servicosAdicionados.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Nenhum serviço adicionado ainda. Preencha o formulário acima e clique em "Adicionar à OS".
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                          <tr>
                            <th className="px-3 py-2 text-left">Serviço</th>
                            <th className="px-3 py-2 text-center">Qtd</th>
                            <th className="px-3 py-2 text-right">Vlr. Unit</th>
                            <th className="px-3 py-2 text-right">Desc.</th>
                            <th className="px-3 py-2 text-right">Subtotal</th>
                            <th className="px-3 py-2 text-center w-12">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {servicosAdicionados.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="px-3 py-2 font-medium text-slate-800">
                                <div>{s.nome}</div>
                                {s.detalhes && <div className="text-[11px] text-slate-400">{s.detalhes}</div>}
                              </td>
                              <td className="px-3 py-2 text-center font-mono">
                                {s.quantidade} {s.bonificado > 0 && <span className="text-amber-600 text-[10px]">({s.bonificado} bonif.)</span>}
                              </td>
                              <td className="px-3 py-2 text-right font-mono text-slate-600">{brl(s.vlr_unit)}</td>
                              <td className="px-3 py-2 text-right font-mono text-rose-600">
                                {s.vlr_desc > 0 ? `- ${brl(s.vlr_desc)}` : '—'}
                              </td>
                              <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">{brl(s.vlr_total)}</td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveServico(idx)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold">
                          <tr>
                            <td colSpan="4" className="px-3 py-2 text-right text-slate-600 uppercase text-[11px]">
                              Total Líquido da OS:
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-[#006397] font-mono text-sm">
                              {brl(totalServicos)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* PASSO 4: PAGAMENTO & PARCELAMENTO */}
            {/* ======================================================== */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Forma de Pagamento
                    </label>
                    <Select value={String(formaPgto)} onValueChange={setFormaPgto}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Dinheiro</SelectItem>
                        <SelectItem value="2">PIX</SelectItem>
                        <SelectItem value="3">Cartão de Crédito</SelectItem>
                        <SelectItem value="4">Boleto Bancário</SelectItem>
                        <SelectItem value="5">Transferência / TED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parcelado
                    </label>
                    <Select value={String(parcelado)} onValueChange={setParcelado}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sim</SelectItem>
                        <SelectItem value="0">Não (À Vista)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {parcelado === '1' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Quantidade de Parcelas
                      </label>
                      <Select value={String(qtdParcelas)} onValueChange={v => setQtdParcelas(Number(v))}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                            <SelectItem key={n} value={String(n)} className="text-xs">
                              {n}x {n === 1 ? '(Parcela Única)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Data 1º Vencimento / Pgto
                    </label>
                    <Input
                      type="date"
                      value={dtPgto}
                      onChange={e => setDtPgto(e.target.value)}
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Tabela de Parcelas */}
                {parcelado === '1' && parcelas.length > 0 && (
                  <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                          Cronograma de Parcelas
                        </div>
                        <div className="text-[11px] text-indigo-700">
                          Total da OS: {brl(totalServicos)} • Soma das Parcelas:{' '}
                          {brl(parcelas.reduce((s, p) => s + Number(p.valor || 0), 0))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => recalcularParcelas(qtdParcelas, totalServicos, dtPgto)}
                        className="text-xs bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100/50 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" /> Recalcular Iguais
                      </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-indigo-200 bg-white">
                      <table className="min-w-full text-xs">
                        <thead className="bg-indigo-100/70 text-indigo-900 font-semibold">
                          <tr>
                            <th className="px-3 py-2 text-left w-20">#</th>
                            <th className="px-3 py-2 text-left">Valor da Parcela</th>
                            <th className="px-3 py-2 text-left">Vencimento</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-100">
                          {parcelas.map((p, i) => (
                            <tr key={i}>
                              <td className="px-3 py-2 font-bold text-indigo-900">
                                {i + 1}/{parcelas.length}
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  value={formatMoney(p.valor)}
                                  onChange={e => handleParcelaValorChange(i, e.target.value)}
                                  className="h-8 text-xs font-mono max-w-[150px]"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="date"
                                  value={p.data}
                                  onChange={e => {
                                    const novas = [...parcelas];
                                    novas[i] = { ...novas[i], data: e.target.value };
                                    setParcelas(novas);
                                  }}
                                  className="h-8 text-xs font-mono max-w-[160px]"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* PASSO 5: OBSERVAÇÕES & CONCLUSÃO */}
            {/* ======================================================== */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                {/* Resumo Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resumo da Ordem de Serviço
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Cliente:</span>
                      <span className="font-bold text-slate-800">
                        {clienteSelecionado?.nome_fantasia || clienteSelecionado?.razao_social || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Campanha:</span>
                      <span className="font-bold text-slate-800">{campanha || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Bi-Semana:</span>
                      <span className="font-bold text-slate-800">
                        {bisemanas.find(b => String(b.id) === String(bisemanaId))?.label || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Líquido:</span>
                      <span className="font-bold text-[#006397] font-mono text-sm">{brl(totalServicos)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
                    <div>
                      <b>Serviços ({servicosAdicionados.length}):</b>{' '}
                      {servicosAdicionados.map(s => `${s.nome} (${s.quantidade}x)`).join(', ') || 'Nenhum'}
                    </div>
                    <div>
                      <b>Condição:</b> {parcelado === '1' ? `${qtdParcelas}x parcelas` : 'À Vista'}
                    </div>
                  </div>
                </div>

                {/* Campo de Observação */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Observações Adicionais (Impressas na OS)
                  </label>
                  <Textarea
                    rows={4}
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                    placeholder="Instruções de faturamento, dados para nota fiscal, observações técnicas..."
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 gap-2">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(prev => prev - 1)}
                  disabled={isSubmitting}
                  className="text-xs cursor-pointer gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Botão de Pré-visualização disponível no passo 5 */}
              {step === 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewPdf}
                  disabled={isSubmitting}
                  className="text-xs border-blue-200 text-[#006397] hover:bg-blue-50 cursor-pointer gap-1.5 font-semibold"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  Pré-visualizar OS
                </Button>
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (step === 1 && !clienteSelecionado) {
                      toastr.warning('Selecione um cliente para prosseguir.');
                      return;
                    }
                    if (step === 3 && servicosAdicionados.length === 0) {
                      toastr.warning('Adicione ao menos um serviço para avançar.');
                      return;
                    }
                    setStep(prev => prev + 1);
                  }}
                  className="bg-[#006397] hover:bg-[#004e75] text-white text-xs cursor-pointer gap-1.5 font-bold shadow-xs"
                >
                  Avançar <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleFinalizarOS}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer gap-1.5 font-bold shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Gravando OS...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" /> Finalizar e Gravar OS
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Prévia do PDF */}
      {showPreviewModal && previewPdfUrl && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold">Pré-visualização da Ordem de Serviço (OS)</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors"
                >
                  Abrir em Nova Aba
                </a>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-200">
              <iframe src={previewPdfUrl} className="w-full h-full border-0" title="Prévia da OS" />
            </div>
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewModal(false)}
                className="text-xs cursor-pointer"
              >
                Fechar Prévia
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleFinalizarOS();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Confirmar e Gravar OS
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==============================================================================
// TELA PRINCIPAL: VENDAS (LANÇAR VENDA)
// ==============================================================================
export default function VendasLancarIndex() {
  const { props } = usePage();

  const initialAnos = props.anos || [];
  const initialBisemanas = props.bisemanas || [];
  const initialBsAtual = props.bs_atual || null;
  const initialClientes = props.clientes || [];
  const initialVendedores = props.vendedores || [];
  const initialAgentes = props.agentes || [];
  const initialServicos = props.servicos || [];
  const initialUfs = props.ufs || [];
  const initialVendas = props.vendas || [];
  const kpis = props.kpis || { total_vendas: 0, faturamento_total: 0, ticket_medio: 0, total_canceladas: 0 };

  const initialAnoId = props.ano_id || 0;
  const initialBsId = props.bs_id || 0;
  const initialSearch = props.search || '';
  const initialVendedorId = props.vendedor_id || 0;

  // Estado dos Filtros
  const anoMap = useMemo(() => {
    const m = new Map();
    initialAnos.forEach(a => m.set(Number(a.id), Number(a.ano)));
    return m;
  }, [initialAnos]);

  const reverseAnoMap = useMemo(() => {
    const m = new Map();
    initialAnos.forEach(a => m.set(Number(a.ano), Number(a.id)));
    return m;
  }, [initialAnos]);

  const defaultYearVal = initialAnoId
    ? (anoMap.get(Number(initialAnoId)) || new Date().getFullYear())
    : (initialBsAtual?.year || new Date().getFullYear());

  const [selectedYear, setSelectedYear] = useState(defaultYearVal);
  const [currentBiSemanaValue, setCurrentBiSemanaValue] = useState(initialBsId ? String(initialBsId) : (initialBsAtual?.id ? String(initialBsAtual.id) : ''));
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSellerFilter, setSelectedSellerFilter] = useState(initialVendedorId ? String(initialVendedorId) : 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal de Nova Venda
  const [modalNovaVendaOpen, setModalNovaVendaOpen] = useState(false);

  const itemsPerPage = 6;
  const pendingSearchRef = useRef(null);

  const currentBiSemana = useMemo(() => {
    if (currentBiSemanaValue) {
      const f = initialBisemanas.find(b => String(b.id) === String(currentBiSemanaValue));
      if (f) return f;
    }
    return initialBsAtual || initialBisemanas[0] || { id: 0, label: '—', num_bisemana: 0, year: new Date().getFullYear() };
  }, [currentBiSemanaValue, initialBisemanas, initialBsAtual]);

  const yearBiSemanas = useMemo(() => {
    return initialBisemanas.filter(b => Number(b.year) === Number(selectedYear));
  }, [initialBisemanas, selectedYear]);

  const fireRouterGet = (params, extraOpts = {}) => {
    const base = { preserveState: true, preserveScroll: true };
    const opts = { ...base, ...extraOpts };
    setIsRefreshing(true);
    opts.onSuccess = () => setIsRefreshing(false);
    opts.onError = () => setIsRefreshing(false);
    router.get('/vendas/lancar', params, opts);
  };

  const buildParams = (overrides = {}) => {
    const anoIdFromYear = reverseAnoMap.get(Number(overrides.selectedYear ?? selectedYear)) || initialAnoId || 0;
    const bsIdOverride = overrides.bsId != null ? overrides.bsId : currentBiSemana?.id;
    const qOverride = overrides.q != null ? overrides.q : searchTerm;
    const vendedorOverride = overrides.vendedorId != null ? overrides.vendedorId : (selectedSellerFilter === 'all' ? 0 : Number(selectedSellerFilter));
    return {
      anoId: anoIdFromYear,
      bsId: Number(bsIdOverride) || 0,
      q: qOverride,
      vendedorId: Number(vendedorOverride) || 0,
    };
  };

  const handleYearChange = (v) => {
    const yr = parseInt(v, 10);
    if (!yr || Number(yr) === Number(selectedYear)) return;
    setSelectedYear(Number(yr));
    setCurrentPage(1);
    const list = initialBisemanas.filter(b => Number(b.year) === Number(yr));
    const primeiroBsId = list[0]?.id || 0;
    setCurrentBiSemanaValue(String(primeiroBsId));
    fireRouterGet(buildParams({ selectedYear: Number(yr), bsId: primeiroBsId }));
  };

  const handleBiSemanaChange = (val) => {
    if (val != null && String(val) === String(currentBiSemanaValue)) return;
    setCurrentBiSemanaValue(String(val));
    setCurrentPage(1);
    fireRouterGet(buildParams({ bsId: val }));
  };

  const handleSearchChange = (e) => {
    const val = e && typeof e === 'object' && e.target ? String(e.target.value || '') : String(e || '');
    setSearchTerm(val);
    setCurrentPage(1);
    if (pendingSearchRef.current) {
      clearTimeout(pendingSearchRef.current);
    }
    pendingSearchRef.current = setTimeout(() => {
      pendingSearchRef.current = null;
      fireRouterGet(buildParams({ q: val }));
    }, 300);
  };

  const handleClearFilters = () => {
    if (pendingSearchRef.current) clearTimeout(pendingSearchRef.current);
    setSearchTerm('');
    setSelectedSellerFilter('all');
    setCurrentPage(1);
    fireRouterGet(buildParams({ q: '', vendedorId: 0 }));
  };

  const handleRefresh = () => {
    fireRouterGet(buildParams());
  };

  // Pagination
  const filteredList = initialVendas;
  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, filteredList.length]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  // Cancel OS
  const handleCancelarVenda = async (osItem) => {
    const result = await Swal.fire({
      title: 'Cancelar Venda?',
      html: `Deseja realmente cancelar a <b>OS #${osItem.id}</b> do cliente <b>${osItem.cliente_nome}</b>?<br><br><span class="text-xs text-rose-600 font-semibold">Os lançamentos financeiros associados a esta OS no Caixa serão removidos.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, Cancelar Venda',
      cancelButtonText: 'Não, Manter',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const resp = await axios.post('/vendas/lancar/cancelar', { id: osItem.id });
      if (resp.data && resp.data.cod === 1) {
        toastr.success('Venda cancelada com sucesso!');
        handleRefresh();
      } else {
        toastr.error(resp.data?.msg || 'Erro ao cancelar venda.');
      }
    } catch (err) {
      console.error(err);
      toastr.error('Falha ao comunicar com o servidor.');
    }
  };

  return (
    <AppLayout
      title="Lançar Venda • SGEP"
      activeTab="vendas"
      breadcrumbs={[
        { label: 'Vendas', href: '/vendas/lancar' },
        { label: 'Lançar Venda' },
      ]}
    >
      <Head title="Lançar Venda • SGEP" />

      <div className="flex flex-col w-full animate-fade-in pb-20 max-w-7xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs w-full">
          <div className="flex items-start sm:items-center gap-3.5 w-full lg:w-auto">
            <div className="w-2.5 h-10 bg-[#006397] rounded-full shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Lançar Venda</h1>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#006397] text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">BS {currentBiSemana?.num_bisemana || 0} • {currentBiSemana?.year || selectedYear}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Venda de serviços adicionais, produção, impressão e emissão de Ordem de Serviço (OS).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 flex-1 sm:flex-initial">
              {/* KPI 1 */}
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-blue-100/70 text-[#006397] shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">Faturamento</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">{brl(kpis.faturamento_total)}</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">Vendas Ativas</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">{kpis.total_vendas} OS</span>
                </div>
              </div>
            </div>

            {/* Nova Venda Action Button */}
            <Button
              type="button"
              onClick={() => setModalNovaVendaOpen(true)}
              className="bg-[#006397] hover:bg-[#004e75] text-white font-bold text-xs gap-2 px-4 py-2.5 rounded-xl shadow-xs cursor-pointer h-auto w-full sm:w-auto justify-center shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Nova Venda
            </Button>
          </div>
        </div>

        {/* Filter Card */}
        <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                {/* Ano */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ano</label>
                  <Select value={String(selectedYear)} onValueChange={handleYearChange}>
                    <SelectTrigger className="bg-slate-50/70 border-slate-200 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {initialAnos.map(y => (
                        <SelectItem key={y.id} value={String(y.ano)}>
                          {y.ano}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bi-semana */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bi-Semana</label>
                  <Select value={String(currentBiSemanaValue)} onValueChange={handleBiSemanaChange}>
                    <SelectTrigger className="bg-slate-50/70 border-slate-200 text-xs truncate">
                      <SelectValue placeholder="Selecione a Bi-Semana" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearBiSemanas.map(bs => (
                        <SelectItem key={bs.id} value={String(bs.id)} className="text-xs">
                          {bs.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vendedor Filter */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Vendedor</label>
                  <Select
                    value={selectedSellerFilter}
                    onValueChange={v => {
                      setSelectedSellerFilter(v);
                      fireRouterGet(buildParams({ vendedorId: v === 'all' ? 0 : Number(v) }));
                    }}
                  >
                    <SelectTrigger className="bg-slate-50/70 border-slate-200 text-xs">
                      <SelectValue placeholder="Todos os Vendedores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Vendedores</SelectItem>
                      {initialVendedores.map(v => (
                        <SelectItem key={v.id} value={String(v.id)} className="text-xs">
                          {v.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Busca */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Buscar Cliente / OS
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Cliente, campanha, nº OS..."
                      className="pl-8 text-xs bg-slate-50/70 border-slate-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => handleSearchChange('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end w-full lg:w-auto shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer flex-1 sm:flex-initial justify-center"
                >
                  <X className="w-3.5 h-3.5" /> Limpar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="text-xs gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer flex-1 sm:flex-initial justify-center"
                >
                  <RefreshCw className={cn('w-3.5 h-3.5 text-[#006397]', isRefreshing && 'animate-spin')} /> Atualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informational Callout */}
        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#006397] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Ordem de Serviço (OS): Venda avulsa de produtos e serviços sem reserva de espaço publicitário.
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Ao finalizar a venda, os lançamentos financeiros são gerados no Caixa e os PDFs (Via do Cliente e Via Financeira) ficam disponíveis para download e impressão.
              </p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-[#006397] border-blue-200 font-semibold text-[11px] whitespace-nowrap">
            Integração Financeira Ativa
          </Badge>
        </div>

        {/* Sales List */}
        <div className="space-y-3.5">
          {paginatedItems.length === 0 ? (
            <Card className="border border-slate-200 bg-white rounded-xl p-4 text-center shadow-2xs">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Nenhuma venda encontrada</h3>
                <p className="text-xs text-slate-500">
                  Não foram encontradas Ordens de Serviço para os filtros selecionados. Tente alterar os filtros ou clique abaixo para lançar uma nova venda.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => setModalNovaVendaOpen(true)}
                    className="bg-[#006397] hover:bg-[#004e75] text-white text-xs font-bold gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Lançar Nova Venda
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            paginatedItems.map((osItem, idx) => {
              const isCancelada = osItem.cancelada === 1;
              return (
                <Card
                  key={osItem.id}
                  className={cn(
                    'border transition-all duration-200 hover:shadow-md rounded-xl overflow-hidden bg-white',
                    isCancelada
                      ? 'border-slate-200 opacity-75 bg-slate-50/50'
                      : idx === 0
                        ? 'border-[#006397]/40 ring-1 ring-[#006397]/20 shadow-2xs'
                        : 'border-slate-200/90 hover:border-slate-300'
                  )}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Client info and details */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div
                          className={cn(
                            'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs',
                            isCancelada
                              ? 'bg-slate-200 text-slate-500'
                              : 'bg-[#006397] text-white'
                          )}
                        >
                          {getInitials(osItem.cliente_nome)}
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base tracking-tight truncate">
                              {osItem.cliente_nome}
                            </h3>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {osItem.cpf_cnpj || 'Sem CNPJ'}
                            </span>
                            <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                              OS #{osItem.id}
                            </span>
                            {isCancelada ? (
                              <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px]">
                                Cancelada
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                                Ativa
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            {osItem.campanha && (
                              <div>
                                <span className="text-slate-400 font-medium mr-1">Campanha:</span>
                                <span className="font-semibold text-slate-800">{osItem.campanha}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-400 font-medium mr-1">Bi-Semana:</span>
                              <span className="font-semibold text-slate-700">{osItem.bisemana_label}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium mr-1">Vendedor:</span>
                              <span className="text-slate-700">{osItem.vendedor_nome}</span>
                            </div>
                            {osItem.contato && (
                              <div>
                                <span className="text-slate-400 font-medium mr-1">Contato:</span>
                                <span className="text-slate-700">{osItem.contato}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-400 font-medium mr-1">Emissão:</span>
                              <span className="font-mono text-slate-600">{osItem.created_at}</span>
                            </div>
                          </div>

                          {osItem.obs && (
                            <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 line-clamp-1 mt-1">
                              <span className="font-semibold text-slate-600">Obs:</span> {osItem.obs}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Price & Action Buttons */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 sm:gap-4 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        <div className="text-left lg:text-right min-w-[90px]">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            {osItem.forma_pagamento_label}
                          </span>
                          <span className="text-base sm:text-lg font-black font-mono text-[#006397]">
                            {brl(osItem.vl_total)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {/* PDF Cliente */}
                          {osItem.arquivo_url && (
                            <a
                              href={osItem.arquivo_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Visualizar OS Cliente"
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-50 text-[#006397] hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span className="inline">OS Cliente</span>
                            </a>
                          )}

                          {/* PDF Financeiro */}
                          {osItem.arquivo_fin_url && (
                            <a
                              href={osItem.arquivo_fin_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Visualizar OS Financeiro"
                              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="inline">OS Fin.</span>
                            </a>
                          )}

                          {/* Cancelar Venda */}
                          {!isCancelada && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelarVenda(osItem)}
                              title="Cancelar OS"
                              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 cursor-pointer p-2 h-auto"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <span className="text-slate-500">
              Página <b className="text-slate-800">{currentPage}</b> de <b className="text-slate-800">{totalPages}</b> • Total de {filteredList.length} vendas
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="h-8 text-xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="h-8 text-xs cursor-pointer"
              >
                Próximo <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Stepper de Nova Venda */}
      <NovaVendaModal
        isOpen={modalNovaVendaOpen}
        onClose={() => setModalNovaVendaOpen(false)}
        clientes={initialClientes}
        bisemanas={initialBisemanas}
        vendedores={initialVendedores}
        agentes={initialAgentes}
        servicos={initialServicos}
        ufs={initialUfs}
        currentBiSemana={currentBiSemana}
        onSuccess={handleRefresh}
      />
    </AppLayout>
  );
}
