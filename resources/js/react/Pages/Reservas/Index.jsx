import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import * as toastrNS from 'toastr';
import 'toastr/build/toastr.min.css';
const toastr = toastrNS && (toastrNS.default || toastrNS.toastr || toastrNS);

import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  Calendar,
  Layers,
  Search,
  Plus,
  Trash2,
  Tv,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Filter,
  RefreshCw,
  Info,
  CalendarRange,
  Building,
  User,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  X,
  Sparkles,
  HelpCircle,
  Check,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/react/Components/ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/react/Components/ui/dialog';
import { Textarea } from '@/react/Components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/react/Components/ui/tabs';

// Helper de resolução de URL de imagem de painel
const resolveImageUrl = (path) => {
  if (!path) return '/storage/img/painel_nobre.png';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/storage/')) return path;
  return `/storage/${path}`;
};

export default function ReservasIndex({
  clientes = [],
  anos = [],
  bisemanas = [],
  paineis = [],
  permissions = {},
}) {
  const { props } = usePage();
  const user = props?.auth?.user || props?.user;

  // Permissões
  const canCreate = permissions?.cria_reserva ?? (user?.permissions?.includes('criar reserva') || true);
  const canDelete = permissions?.exclui_reserva ?? (user?.permissions?.includes('excluir reserva') || true);
  const liberaReserva = user?.permissions?.includes('liberar reserva') || false;
  const liberaReservaPainel04 = user?.permissions?.includes('liberar reserva painel 04') || false;

  // Tab ativa: 'convencionais' | 'leds'
  const [activeTab, setActiveTab] = useState('convencionais');

  // ==========================================
  // ESTADO - PAINÉIS CONVENCIONAIS (BI-SEMANAS)
  // ==========================================
  const anoAtualNumero = new Date().getFullYear();
  const anoInicial = useMemo(() => {
    const found = anos.find(a => Number(a.ano_bisemana) === anoAtualNumero);
    return found ? String(found.id) : (anos[0] ? String(anos[0].id) : '0');
  }, [anos, anoAtualNumero]);

  const [idAno, setIdAno] = useState(anoInicial);
  const [listaBisemanas, setListaBisemanas] = useState([]);
  const [idBisemana, setIdBisemana] = useState('0');
  const [clienteId, setClienteId] = useState('');
  const [reservaExtensiva, setReservaExtensiva] = useState(false);
  const [bsFinalId, setBsFinalId] = useState('0');

  // Reservas do cliente na bi-semana
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [reservasAtuais, setReservasAtuais] = useState([]);
  const [selectedReservaIds, setSelectedReservaIds] = useState([]); // para exclusão

  // MODAL DE ADICIONAR PAINÉIS (RESERVA)
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [loadingDisponiveis, setLoadingDisponiveis] = useState(false);
  const [paineisDisponiveis, setPaineisDisponiveis] = useState([]);
  const [selectedPanelIds, setSelectedPanelIds] = useState([]); // painéis selecionados para reservar
  const [filtroTextoDisponiveis, setFiltroTextoDisponiveis] = useState('');
  const [campanha, setCampanha] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [submittingReserva, setSubmittingReserva] = useState(false);

  // Modal de Exclusão de Reserva
  const [modalDelOpen, setModalDelOpen] = useState(false);
  const [submittingDel, setSubmittingDel] = useState(false);

  // ==========================================
  // ESTADO - LEDs DIGITAIS (MENSAL / DATAS)
  // ==========================================
  const [ledClienteId, setLedClienteId] = useState('');
  const [ledPainelId, setLedPainelId] = useState('');
  const [ledDtInicio, setLedDtInicio] = useState('');
  const [ledDtFim, setLedDtFim] = useState('');
  const [ledCampanha, setLedCampanha] = useState('');
  const [ledObs, setLedObs] = useState('');
  const [checaConflitoLed, setChecaConflitoLed] = useState(null);
  const [loadingConflito, setLoadingConflito] = useState(false);
  const [submittingLed, setSubmittingLed] = useState(false);

  const listaLedsDisponiveis = useMemo(() => {
    return paineis.filter(p => p.is_led === 1 || p.is_led === true);
  }, [paineis]);

  const [reservasLedList, setReservasLedList] = useState([]);
  const [loadingLedList, setLoadingLedList] = useState(false);

  const [modalExtensaoOpen, setModalExtensaoOpen] = useState(false);
  const [reservaParaExtender, setReservaParaExtender] = useState(null);
  const [novaDataFim, setNovaDataFim] = useState('');
  const [submittingExtensao, setSubmittingExtensao] = useState(false);

  // ==========================================
  // EFEITOS - CONVENCIONAIS
  // ==========================================
  // Carrega bi-semanas ao mudar o ano
  useEffect(() => {
    if (!idAno || idAno === '0') {
      setListaBisemanas([]);
      setIdBisemana('0');
      return;
    }
    axios.post('/getBisemanass', { bisemana: idAno })
      .then(res => {
        const list = Object.values(res.data || []);
        setListaBisemanas(list);
        if (list.length > 0) {
          setIdBisemana(String(list[0].id));
        } else {
          setIdBisemana('0');
        }
      })
      .catch(() => toastr.error('Erro ao carregar bi-semanas'));
  }, [idAno]);

  // Carrega as reservas do cliente quando mudar a bi-semana ou o cliente selecionado
  const carregarReservasCliente = () => {
    if (!idBisemana || idBisemana === '0') {
      setReservasAtuais([]);
      setSelectedReservaIds([]);
      return;
    }
    setLoadingReservas(true);
    axios.post('/GetPaineisCli', {
      bsId: Number(idBisemana),
      cliente: clienteId ? Number(clienteId) : null,
    })
      .then(res => {
        setReservasAtuais(res.data?.reservas || []);
        setSelectedReservaIds([]);
      })
      .catch(() => toastr.error('Erro ao carregar reservas do cliente'))
      .finally(() => setLoadingReservas(false));
  };

  useEffect(() => {
    carregarReservasCliente();
  }, [idBisemana, clienteId]);

  // Carrega os painéis disponíveis (GetPaineis com statusPainel='D') ao abrir o modal de nova reserva
  const carregarPaineisDisponiveis = () => {
    if (!idBisemana || idBisemana === '0') return;
    setLoadingDisponiveis(true);
    axios.post('/GetPaineis', {
      statusPainel: 'D',
      bisemana: Number(idBisemana),
    })
      .then(res => {
        setPaineisDisponiveis(res.data || []);
      })
      .catch(() => toastr.error('Erro ao carregar painéis disponíveis'))
      .finally(() => setLoadingDisponiveis(false));
  };

  // Abre modal de adicionar painéis
  const handleOpenAddReserva = () => {
    if (!clienteId || clienteId === '0') {
      toastr.error('Selecione um cliente para reservar!');
      return;
    }
    if (reservaExtensiva && (!bsFinalId || bsFinalId === '0' || Number(bsFinalId) <= Number(idBisemana))) {
      toastr.error('Selecione uma bi-semana final válida para a reserva extensiva!');
      return;
    }

    setSelectedPanelIds([]);
    setCampanha('');
    setObservacoes('');
    setFiltroTextoDisponiveis('');
    setModalAddOpen(true);
    carregarPaineisDisponiveis();
  };

  // Contagem de bi-semanas no intervalo extensivo
  const bsIntervalCount = useMemo(() => {
    if (!reservaExtensiva || !idBisemana || !bsFinalId || bsFinalId === '0') return 0;
    const iniNum = Number(idBisemana);
    const fimNum = Number(bsFinalId);
    if (fimNum <= iniNum) return 0;

    const list = [...listaBisemanas].sort((a, b) => a.id - b.id);
    const idxIni = list.findIndex(b => b.id === iniNum);
    const idxFim = list.findIndex(b => b.id === fimNum);
    if (idxIni === -1 || idxFim === -1 || idxFim <= idxIni) return 0;
    return idxFim - idxIni + 1;
  }, [reservaExtensiva, idBisemana, bsFinalId, listaBisemanas]);

  // Toggle seleção de painel para reservar
  const toggleSelectPanel = (painel) => {
    const id = painel.id;
    const isSelected = selectedPanelIds.includes(id);

    if (isSelected) {
      setSelectedPanelIds(prev => prev.filter(pId => pId !== id));
      return;
    }

    // Regras de validação idênticas à tela legada GridPaineis.vue:
    // 1. Painel 04 exige ao menos 4 painéis convencionais
    const jaSelecionados = paineisDisponiveis.filter(p => selectedPanelIds.includes(p.id));
    const convencionaisSel = jaSelecionados.filter(p => String(p.tipo) === '2');
    const nobresSel = jaSelecionados.filter(p => String(p.tipo) === '1');

    if (!liberaReservaPainel04 && String(painel.identificacao) === '4' && convencionaisSel.length < 4) {
      toastr.error('O painel 04 não pode ser reservado sem no mínimo 4 painéis convencionais');
      return;
    }

    // 2. Proporção Nobres vs Convencionais
    if (!liberaReserva) {
      if (String(painel.tipo) === '1') {
        if (nobresSel.length * 2 >= convencionaisSel.length) {
          toastr.error('O número de painéis nobres não pode ser maior que o dobro do número de painéis convencionais');
          return;
        }
        if (convencionaisSel.length === 1) {
          toastr.error('O número de painéis convencionais não pode ser menor que 2 para reservar um painel nobre');
          return;
        }
      }
    }

    setSelectedPanelIds(prev => [...prev, id]);
  };

  // Toggle seleção de reservas existentes (para exclusão)
  const toggleSelectReserva = (painelId) => {
    setSelectedReservaIds(prev =>
      prev.includes(painelId) ? prev.filter(id => id !== painelId) : [...prev, painelId]
    );
  };

  const selectAllReservas = () => {
    const ids = reservasAtuais.map(r => r.id);
    const allSelected = ids.every(id => selectedReservaIds.includes(id));
    if (allSelected) {
      setSelectedReservaIds([]);
    } else {
      setSelectedReservaIds(ids);
    }
  };

  // Salvar Reserva Convencional
  const handleSaveReservaConvencional = () => {
    if (!clienteId || clienteId === '0') {
      toastr.error('Selecione um cliente!');
      return;
    }
    if (selectedPanelIds.length === 0) {
      toastr.error('Selecione pelo menos um painel para reservar!');
      return;
    }
    if (!campanha.trim()) {
      toastr.error('É obrigatório informar o nome da campanha!');
      return;
    }
    if (reservaExtensiva) {
      if (!bsFinalId || bsFinalId === '0' || Number(bsFinalId) <= Number(idBisemana)) {
        toastr.error('Selecione uma bi-semana final maior que a inicial!');
        return;
      }
    }

    setSubmittingReserva(true);
    axios.post('/ResPaineisCli', {
      clienteId: Number(clienteId),
      idPaineis: selectedPanelIds,
      campanha: campanha.trim(),
      obs: observacoes.trim(),
      bsId: Number(idBisemana),
      extensiva: reservaExtensiva ? 1 : 0,
      bsFinal: reservaExtensiva ? Number(bsFinalId) : null,
    })
      .then(res => {
        if (res.data?.cod === 1) {
          if (res.data?.skipped && res.data.skipped.length > 0) {
            toastr.warning(`Alguns painéis foram ignorados por já estarem reservados: ${res.data.skipped.join(', ')}`);
          }
          toastr.success(res.data.message || 'Reservas criadas com sucesso!');
          setModalAddOpen(false);
          setSelectedPanelIds([]);
          setCampanha('');
          setObservacoes('');
          carregarReservasCliente();
        } else {
          toastr.error(res.data?.msg || 'Erro ao criar reserva');
        }
      })
      .catch(err => {
        toastr.error(err.response?.data?.msg || 'Falha ao salvar reserva');
      })
      .finally(() => setSubmittingReserva(false));
  };

  // Excluir Reservas Selecionadas
  const handleExcluirReservas = () => {
    if (selectedReservaIds.length === 0) {
      toastr.error('Selecione os painéis a serem excluídos!');
      return;
    }

    // Regra da tela legada: se tem PI emitida, só pode excluir se forem todos os painéis da reserva
    const hasPI = reservasAtuais.some(r => r.pi_ok == 1);
    if (hasPI && selectedReservaIds.length !== reservasAtuais.length) {
      toastr.error('Painéis com PI só podem ser excluídos se forem TODOS os painéis da reserva!');
      return;
    }

    setSubmittingDel(true);
    axios.post('/DelResCliente', {
      paineisId: selectedReservaIds,
      bs: Number(idBisemana),
    })
      .then(res => {
        if (res.data?.cod === 1) {
          toastr.success(res.data?.msg || 'Painéis excluídos com sucesso!');
          setModalDelOpen(false);
          setSelectedReservaIds([]);
          carregarReservasCliente();
        } else {
          toastr.error(res.data?.msg || 'Não foi possível excluir os painéis');
        }
      })
      .catch(err => {
        toastr.error(err.response?.data?.msg || 'Falha ao excluir reservas');
      })
      .finally(() => setSubmittingDel(false));
  };

  // ==========================================
  // EFEITOS - LEDs DIGITAIS
  // ==========================================
  const carregarReservasLed = () => {
    setLoadingLedList(true);
    axios.post('/GetReservasLed', {})
      .then(res => {
        setReservasLedList(res.data?.reservas || []);
      })
      .catch(() => toastr.error('Erro ao carregar reservas de LEDs'))
      .finally(() => setLoadingLedList(false));
  };

  useEffect(() => {
    if (activeTab === 'leds') {
      carregarReservasLed();
    }
  }, [activeTab]);

  // Checa conflito de datas de LED em tempo real
  useEffect(() => {
    if (!ledPainelId || !ledDtInicio || !ledDtFim) {
      setChecaConflitoLed(null);
      return;
    }
    if (ledDtFim < ledDtInicio) {
      setChecaConflitoLed({ conflito: true, msg: 'A data final não pode ser anterior à data inicial.' });
      return;
    }

    setLoadingConflito(true);
    const timer = setTimeout(() => {
      axios.post('/VerificaConflitoLed', {
        painel_id: Number(ledPainelId),
        dt_inicio: ledDtInicio,
        dt_fim: ledDtFim,
      })
        .then(res => {
          setChecaConflitoLed(res.data);
        })
        .catch(() => {
          setChecaConflitoLed(null);
        })
        .finally(() => setLoadingConflito(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [ledPainelId, ledDtInicio, ledDtFim]);

  const handleSaveReservaLed = (e) => {
    e.preventDefault();
    if (!ledClienteId) {
      toastr.error('Selecione um cliente!');
      return;
    }
    if (!ledPainelId) {
      toastr.error('Selecione o painel LED!');
      return;
    }
    if (!ledDtInicio || !ledDtFim) {
      toastr.error('Informe as datas de início e término da vigência!');
      return;
    }
    if (ledDtFim < ledDtInicio) {
      toastr.error('A data final não pode ser anterior à data inicial!');
      return;
    }
    if (!ledCampanha.trim()) {
      toastr.error('Informe o nome da campanha!');
      return;
    }

    setSubmittingLed(true);
    axios.post('/ReservaLed', {
      cliente_id: Number(ledClienteId),
      painel_id: Number(ledPainelId),
      dt_inicio: ledDtInicio,
      dt_fim: ledDtFim,
      campanha: ledCampanha.trim(),
      obs: ledObs.trim(),
    })
      .then(res => {
        if (res.data?.cod === 1) {
          toastr.success(res.data?.msg || 'Reserva do LED realizada com sucesso!');
          setLedCampanha('');
          setLedObs('');
          setLedDtInicio('');
          setLedDtFim('');
          setChecaConflitoLed(null);
          carregarReservasLed();
        } else {
          toastr.error(res.data?.msg || 'Erro ao realizar reserva do LED');
        }
      })
      .catch(err => {
        toastr.error(err.response?.data?.msg || 'Falha ao salvar reserva do LED');
      })
      .finally(() => setSubmittingLed(false));
  };

  const abrirModalExtensao = (reserva) => {
    setReservaParaExtender(reserva);
    const fimAtual = reserva.dt_fim ? new Date(reserva.dt_fim) : new Date();
    fimAtual.setDate(fimAtual.getDate() + 30);
    const yyyy = fimAtual.getFullYear();
    const mm = String(fimAtual.getMonth() + 1).padStart(2, '0');
    const dd = String(fimAtual.getDate()).padStart(2, '0');
    setNovaDataFim(`${yyyy}-${mm}-${dd}`);
    setModalExtensaoOpen(true);
  };

  const handleExtenderReserva = () => {
    if (!reservaParaExtender || !novaDataFim) {
      toastr.error('Informe a nova data final!');
      return;
    }
    setSubmittingExtensao(true);
    axios.post('/ExtenderReservaLed', {
      reserva_id: reservaParaExtender.reserva_id,
      nova_data_fim: novaDataFim,
    })
      .then(res => {
        if (res.data?.cod === 1) {
          toastr.success(res.data?.msg || 'Reserva estendida com sucesso!');
          setModalExtensaoOpen(false);
          setReservaParaExtender(null);
          carregarReservasLed();
        } else {
          toastr.error(res.data?.msg || 'Não foi possível estender a reserva');
        }
      })
      .catch(err => {
        toastr.error(err.response?.data?.msg || 'Erro ao estender reserva');
      })
      .finally(() => setSubmittingExtensao(false));
  };

  const handleCancelarReservaLed = (reservaId) => {
    if (!confirm('Deseja realmente cancelar esta reserva de LED?')) return;
    axios.post('/cancelaReserva', { reserva_id: reservaId })
      .then(res => {
        if (res.data?.cod === 1) {
          toastr.success(res.data?.msg || 'Reserva de LED cancelada!');
          carregarReservasLed();
        } else {
          toastr.error(res.data?.msg || 'Erro ao cancelar reserva');
        }
      })
      .catch(err => {
        toastr.error(err.response?.data?.msg || 'Falha ao cancelar reserva');
      });
  };

  const formatDataBR = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  // Nome do cliente selecionado
  const clienteSelecionadoObj = useMemo(() => {
    return clientes.find(c => String(c.id) === String(clienteId)) || null;
  }, [clientes, clienteId]);

  return (
    <AppLayout>
      <Head title="Gerenciamento de Reservas • Painéis e LEDs" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* HEADER PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-[#006397] ring-1 ring-sky-200">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Reserva de Painéis e LEDs
              </h1>
              <p className="text-sm text-slate-500">
                Gerenciamento integrado de reservas para Painéis Convencionais (Bi-semanas) e LEDs Digitais (Mensal).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/ReservaSemPi"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
            >
              <FileText className="h-4 w-4" />
              Emitir PIs Pendentes
            </a>

            <a
              href="/MapaOcupacaoLed"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#006397] text-white hover:bg-[#004f7a] shadow-sm transition"
            >
              <Tv className="h-4 w-4" />
              Ver Mapa de Ocupação
            </a>
          </div>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md p-1 bg-slate-100 rounded-xl">
            <TabsTrigger
              value="convencionais"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#006397] data-[state=active]:shadow-sm font-semibold text-xs py-2"
            >
              <ImageIcon className="h-4 w-4" />
              Painéis Convencionais (BS)
            </TabsTrigger>
            <TabsTrigger
              value="leds"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#006397] data-[state=active]:shadow-sm font-semibold text-xs py-2"
            >
              <Tv className="h-4 w-4" />
              LEDs Digitais (Mensal)
            </TabsTrigger>
          </TabsList>

          {/* ============================================================== */}
          {/* TAB 1: PAINÉIS CONVENCIONAIS (BI-SEMANAS)                     */}
          {/* ============================================================== */}
          <TabsContent value="convencionais" className="space-y-6 pt-4">

            {/* BARRA DE FILTROS E CONTROLES (PADRÃO TELA LEGADA) */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">

                  {/* 1. Ano (2 colunas) */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ano
                    </label>
                    <Select value={idAno} onValueChange={setIdAno}>
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {anos.map(a => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.ano_bisemana}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. Bi-semana Inicial (3 colunas) */}
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Bi-Semana
                    </label>
                    <Select value={idBisemana} onValueChange={setIdBisemana}>
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Selecione a BS" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {listaBisemanas.map(bs => (
                          <SelectItem key={bs.id} value={String(bs.id)}>
                            BS: {bs.num_bisemana} {formatDataBR(bs.inicio)} até {formatDataBR(bs.fim)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 3. Cliente (4 colunas) */}
                  <div className="lg:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cliente
                    </label>
                    <Select value={clienteId} onValueChange={setClienteId} disabled={idBisemana === '0'}>
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder={idBisemana === '0' ? 'Selecione primeiro a BS' : 'Selecione o Cliente'} />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        <SelectItem value="0">Todos os Clientes</SelectItem>
                        {clientes.map(c => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.nome_fantasia || c.razao_social}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 4. Ações: Adicionar Painéis / Excluir / Atualizar (3 colunas) */}
                  <div className="lg:col-span-3 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={carregarReservasCliente}
                      disabled={loadingReservas}
                      className="h-9 text-xs"
                      title="Atualizar dados"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${loadingReservas ? 'animate-spin' : ''}`} />
                    </Button>

                    {/* Botão Adicionar Painéis (+ Nova Reserva) */}
                    {canCreate && clienteId && clienteId !== '0' && (
                      <Button
                        size="sm"
                        onClick={handleOpenAddReserva}
                        disabled={reservaExtensiva && (!bsFinalId || bsFinalId === '0' || Number(bsFinalId) <= Number(idBisemana))}
                        title={
                          reservaExtensiva && (!bsFinalId || bsFinalId === '0' || Number(bsFinalId) <= Number(idBisemana))
                            ? 'Selecione uma bi-semana final válida'
                            : 'Adicionar Painéis (Nova Reserva)'
                        }
                        className="h-9 bg-[#006397] hover:bg-[#004f7a] text-white text-xs font-semibold shadow-sm px-3"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Painéis
                      </Button>
                    )}

                    {/* Botão Excluir Painéis Selecionados */}
                    {canDelete && clienteId && selectedReservaIds.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setModalDelOpen(true)}
                        className="h-9 text-xs font-semibold shadow-sm px-3"
                        title="Excluir Painéis Selecionados"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir ({selectedReservaIds.length})
                      </Button>
                    )}
                  </div>
                </div>

                {/* Opção Reserva Extensiva (Bi-semana Final) - COMPATÍVEL 1:1 COM A TELA LEGADA */}
                <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-4 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={reservaExtensiva}
                      onChange={e => {
                        setReservaExtensiva(e.target.checked);
                        if (!e.target.checked) setBsFinalId('0');
                      }}
                      className="rounded border-slate-300 text-[#006397] focus:ring-[#006397] h-4 w-4"
                    />
                    <span>Reserva extensiva</span>
                  </label>

                  {reservaExtensiva && (
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-slate-500 font-medium">Bi-semana final:</span>
                      <div className="w-64">
                        <Select value={bsFinalId} onValueChange={setBsFinalId}>
                          <SelectTrigger className="w-full h-8 text-xs bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Selecione BS final" />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            {listaBisemanas
                              .filter(bs => Number(bs.id) > Number(idBisemana))
                              .map(bs => (
                                <SelectItem key={bs.id} value={String(bs.id)}>
                                  BS: {bs.num_bisemana} {formatDataBR(bs.inicio)} até {formatDataBR(bs.fim)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {bsIntervalCount > 0 && (
                        <Badge variant="outline" className="bg-sky-50 text-[#006397] border-sky-200 font-bold px-2.5 py-1">
                          {bsIntervalCount} Bi-semanas
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SEÇÃO PRINCIPAL: PAINÉIS RESERVADOS DO CLIENTE (GRID PRINCIPAL) */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="py-3 px-5 border-b bg-slate-50/70 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Reservas por Cliente
                  </CardTitle>
                  <span className="text-rose-600 font-extrabold text-sm ml-1">
                    ({reservasAtuais.length})
                  </span>
                  {clienteSelecionadoObj && (
                    <span className="text-xs text-slate-500 ml-2">
                      • {clienteSelecionadoObj.nome_fantasia || clienteSelecionadoObj.razao_social}
                    </span>
                  )}
                </div>

                {reservasAtuais.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllReservas}
                      className="text-xs h-8 bg-white"
                    >
                      {reservasAtuais.every(r => selectedReservaIds.includes(r.id))
                        ? 'Desmarcar Todos'
                        : 'Selecionar Todos'}
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 sm:p-5">
                {loadingReservas ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                    <RefreshCw className="h-8 w-8 animate-spin mb-3 text-[#006397]" />
                    <p className="text-sm">Carregando reservas da bi-semana...</p>
                  </div>
                ) : reservasAtuais.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">Nenhuma reserva encontrada para este cliente nesta bi-semana.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {clienteId && clienteId !== '0'
                        ? 'Clique em "Adicionar Painéis" acima para reservar novos painéis.'
                        : 'Selecione um cliente para visualizar ou cadastrar reservas.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {reservasAtuais.map(res => {
                      const isSelected = selectedReservaIds.includes(res.id);
                      const imageUrl = resolveImageUrl(res.image_url);

                      return (
                        <div
                          key={res.id}
                          onClick={() => toggleSelectReserva(res.id)}
                          className={`rounded-xl border cursor-pointer overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'border-sky-500 ring-2 ring-sky-500 shadow-md bg-sky-50/40'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                          }`}
                        >
                          {/* Imagem do Painel */}
                          <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Painel ${res.identificacao}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/storage/img/painel_nobre.png';
                              }}
                            />

                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white font-bold text-xs">
                                #{res.identificacao}
                              </span>
                              <Badge
                                variant="outline"
                                className={res.pi_ok ? 'bg-emerald-500 text-white border-transparent text-[10px]' : 'bg-amber-500 text-white border-transparent text-[10px]'}
                              >
                                {res.pi_ok ? 'Com PI' : 'Sem PI'}
                              </Badge>
                            </div>

                            <div className="absolute top-2 right-2">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isSelected ? 'bg-[#006397] border-[#006397] text-white' : 'bg-white/90 border-slate-300'
                              }`}>
                                {isSelected && <Check className="h-3.5 w-3.5" />}
                              </div>
                            </div>
                          </div>

                          {/* Detalhes do Painel e Reserva */}
                          <div className="p-3 space-y-1.5 text-xs">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-slate-800 line-clamp-1">
                                {res.nome_fantasia || res.razao_social || 'Cliente'}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 space-y-0.5">
                              <p className="line-clamp-1">
                                <strong>Campanha:</strong> {res.campanha || '—'}
                              </p>
                              {res.obs && (
                                <p className="line-clamp-1 text-slate-500">
                                  <strong>Obs:</strong> {res.obs}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-400 pt-1">
                                Reservado por: {res.user_name || 'Usuário'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 2: LEDS DIGITAIS (CONTRATOS MENSAIS E VIGÊNCIAS)          */}
          {/* ============================================================== */}
          <TabsContent value="leds" className="space-y-6 pt-4">

            {/* FORMULÁRIO DE NOVA RESERVA MENSAL DE LED */}
            <Card className="border-purple-200 shadow-sm bg-gradient-to-r from-purple-50/40 to-white">
              <CardHeader className="py-4 px-5 border-b border-purple-100 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-xs uppercase tracking-wider">
                      LED Digital
                    </span>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Nova Reserva Mensal de LED
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    A comercialização de LEDs Digitais é estritamente <strong>mensal por período de vigência</strong> (Data Início até Data Fim).
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={carregarReservasLed}
                  disabled={loadingLedList}
                  className="text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loadingLedList ? 'animate-spin' : ''}`} />
                  Recarregar
                </Button>
              </CardHeader>

              <CardContent className="p-5">
                <form onSubmit={handleSaveReservaLed} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Cliente */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Cliente <span className="text-red-500">*</span>
                      </label>
                      <Select value={ledClienteId} onValueChange={setLedClienteId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {clientes.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.nome_fantasia || c.razao_social}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Painel LED */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Painel LED Digital <span className="text-red-500">*</span>
                      </label>
                      <Select value={ledPainelId} onValueChange={setLedPainelId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o LED" />
                        </SelectTrigger>
                        <SelectContent>
                          {listaLedsDisponiveis.map(l => (
                            <SelectItem key={l.id} value={String(l.id)}>
                              LED #{l.identificacao} {l.bairro?.nome ? `— ${l.bairro.nome}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Data Início */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Data Início da Vigência <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={ledDtInicio}
                        onChange={e => setLedDtInicio(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>

                    {/* Data Fim */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Data Término da Vigência <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={ledDtFim}
                        onChange={e => setLedDtFim(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>

                  </div>

                  {/* Feedback de Conflito em Tempo Real */}
                  {checaConflitoLed && (
                    <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                      checaConflitoLed.conflito
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {checaConflitoLed.conflito ? (
                        <>
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                          <span><strong>Atenção:</strong> {checaConflitoLed.msg}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{checaConflitoLed.msg}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Campanha e Observações */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nome da Campanha <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Ex: Campanha Institucional 30 dias"
                        value={ledCampanha}
                        onChange={e => setLedCampanha(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Observações do Contrato
                      </label>
                      <Input
                        placeholder="Ex: Contrato de 30 dias renovável, inserções de 15s"
                        value={ledObs}
                        onChange={e => setLedObs(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={submittingLed || (checaConflitoLed && checaConflitoLed.conflito)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm"
                    >
                      {submittingLed ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Salvando Reserva...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Confirmar Reserva de LED
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* TABELA DE RESERVAS ATIVAS DE LEDs */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-4 px-5 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Contratos e Reservas Ativas de LEDs ({reservasLedList.length})
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Acompanhamento do status de vigência, término do contrato, extensão e emissão de PI.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
                      <tr>
                        <th className="py-3 px-4">LED</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Campanha</th>
                        <th className="py-3 px-4">Período de Vigência</th>
                        <th className="py-3 px-4">Status do Contrato</th>
                        <th className="py-3 px-4">Status PI</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingLedList ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-slate-400">
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-600" />
                            Carregando contratos de LED...
                          </td>
                        </tr>
                      ) : reservasLedList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-slate-400">
                            Nenhum contrato de LED registrado no momento.
                          </td>
                        </tr>
                      ) : (
                        reservasLedList.map(r => {
                          const statusContrato = r.status_contrato || {};
                          let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                          if (statusContrato.status === 'proximo') {
                            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                          } else if (statusContrato.status === 'hoje') {
                            badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 font-bold animate-pulse';
                          } else if (statusContrato.status === 'encerrado') {
                            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                          }

                          return (
                            <tr key={r.reserva_id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-bold text-purple-700">
                                LED #{r.painel_ident}
                                <span className="block text-[10px] text-slate-400 font-normal">
                                  {r.bairro || '—'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-800">
                                {r.cliente_nome || 'Cliente não identificado'}
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                {r.campanha || '—'}
                              </td>
                              <td className="py-3 px-4 text-slate-700">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{formatDataBR(r.dt_inicio)} até {formatDataBR(r.dt_fim)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={`text-[11px] ${badgeClass}`}>
                                  {statusContrato.label || 'Normal'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="outline"
                                  className={r.pi_ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}
                                >
                                  {r.pi_ok ? 'PI Emitido' : 'Sem PI'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModalExtensao(r)}
                                    className="h-7 text-[11px] text-purple-700 hover:text-purple-800 hover:bg-purple-50 border-purple-200"
                                    title="Estender período do contrato"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    Estender
                                  </Button>

                                  {canDelete && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCancelarReservaLed(r.reserva_id)}
                                      className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                      title="Cancelar reserva de LED"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>

      </div>

      {/* ============================================================== */}
      {/* MODAL: ADICIONAR PAINÉIS / CRIAR RESERVA (GRID DISPONÍVEIS)    */}
      {/* ============================================================== */}
      <Dialog open={modalAddOpen} onOpenChange={setModalAddOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-6">
          <DialogHeader className="pb-3 border-b">
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>
                Reservar painéis para o cliente:{' '}
                <span className="text-rose-600 font-extrabold">
                  {clienteSelecionadoObj?.nome_fantasia || clienteSelecionadoObj?.razao_social || 'Cliente'}
                </span>
              </span>
              <Badge variant="outline" className="bg-sky-50 text-[#006397] border-sky-200 font-bold ml-2">
                {selectedPanelIds.length} selecionado(s)
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Selecione os painéis disponíveis nesta bi-semana para compor a pré-reserva.
            </DialogDescription>
          </DialogHeader>

          {/* Dados da Campanha e Observações */}
          <div className="py-3 border-b space-y-3 bg-slate-50/50 p-3 rounded-lg mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Campanha <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Informe o nome da campanha..."
                  value={campanha}
                  onChange={e => setCampanha(e.target.value)}
                  className="h-8 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações
                </label>
                <Input
                  placeholder="Observações adicionais..."
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  className="h-8 text-xs bg-white"
                />
              </div>
            </div>

            {/* Aviso Reserva Extensiva se habilitada */}
            {reservaExtensiva && bsIntervalCount > 0 && (
              <div className="p-2.5 rounded bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
                <span>
                  <strong>Reserva Extensiva Ativa:</strong> Criará reservas individuais para cada uma das <strong>{bsIntervalCount} bi-semanas</strong> do intervalo.
                </span>
                <Badge variant="outline" className="bg-white text-sky-800 font-bold">
                  {bsIntervalCount} BS
                </Badge>
              </div>
            )}
          </div>

          {/* Filtro de Busca de Painéis Disponíveis */}
          <div className="py-2 flex items-center justify-between gap-3">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Filtrar por código, rua..."
                value={filtroTextoDisponiveis}
                onChange={e => setFiltroTextoDisponiveis(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <span className="text-xs text-slate-500">
              Total Disponíveis: <strong>{paineisDisponiveis.length}</strong>
            </span>
          </div>

          {/* Grid de Painéis Disponíveis para Seleção */}
          <div className="flex-1 overflow-y-auto max-h-[46vh] pr-1 py-2">
            {loadingDisponiveis ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="h-8 w-8 animate-spin mb-3 text-[#006397]" />
                <p className="text-sm">Carregando painéis disponíveis...</p>
              </div>
            ) : paineisDisponiveis.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold">Nenhum painel disponível nesta bi-semana.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {paineisDisponiveis
                  .filter(p => {
                    if (!filtroTextoDisponiveis) return true;
                    const s = filtroTextoDisponiveis.toLowerCase();
                    return (
                      (p.identificacao && String(p.identificacao).toLowerCase().includes(s)) ||
                      (p.logradouro && p.logradouro.toLowerCase().includes(s)) ||
                      (p.bnome && p.bnome.toLowerCase().includes(s))
                    );
                  })
                  .map(p => {
                    const isSelected = selectedPanelIds.includes(p.id);
                    const imageUrl = resolveImageUrl(p.image_url);

                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleSelectPanel(p)}
                        className={`rounded-xl border cursor-pointer overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#006397] ring-2 ring-[#006397] shadow-md bg-sky-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                        }`}
                      >
                        {/* Imagem do Painel */}
                        <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Painel ${p.identificacao}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/storage/img/painel_nobre.png';
                            }}
                          />

                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white font-bold text-xs">
                              #{p.identificacao}
                            </span>
                            {String(p.tipo) === '1' ? (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px]">
                                Nobre
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-md bg-sky-600 text-white font-semibold text-[10px]">
                                Convencional
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-[#006397] border-[#006397] text-white' : 'bg-white/90 border-slate-300'
                            }`}>
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </div>
                          </div>
                        </div>

                        {/* Endereço */}
                        <div className="p-2.5">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                            {p.logradouro ? `${p.logradouro}, ${p.numero || 'S/N'}` : 'Localização não informada'}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {p.bnome || p.rnome || '—'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalAddOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSaveReservaConvencional}
              disabled={submittingReserva || selectedPanelIds.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm px-4"
            >
              {submittingReserva ? 'Salvando Pré-Reserva...' : `Criar Pré-Reserva (${selectedPanelIds.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: EXCLUIR RESERVA CONVENCIONAL                            */}
      {/* ============================================================== */}
      <Dialog open={modalDelOpen} onOpenChange={setModalDelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Cancelamento de Reserva
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Você está prestes a cancelar a reserva de <strong>{selectedReservaIds.length} painel(is)</strong>.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-600 my-2">
            Esta ação liberará imediatamente o espaço para novas reservas no período selecionado.
          </p>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalDelOpen(false)}
              className="text-xs"
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleExcluirReservas}
              disabled={submittingDel}
              className="text-xs font-semibold shadow-sm"
            >
              {submittingDel ? 'Excluindo...' : 'Sim, Cancelar Reservas'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: ESTENDER PERÍODO DO CONTRATO DE LED                     */}
      {/* ============================================================== */}
      <Dialog open={modalExtensaoOpen} onOpenChange={setModalExtensaoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Estender Vigência do LED
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {reservaParaExtender && (
                <>
                  Painel <strong>LED #{reservaParaExtender.painel_ident}</strong> para o cliente <strong>{reservaParaExtender.cliente_nome}</strong>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-slate-50 border text-xs text-slate-600">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Data de Término Atual:</span>
                <span className="font-bold text-slate-800">{formatDataBR(reservaParaExtender?.dt_fim)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nova Data Final da Vigência <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={novaDataFim}
                onChange={e => setNovaDataFim(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <strong>Importante:</strong> A extensão valida conflitos para o novo período solicitado. Se houver PI já emitida, os valores contratuais não são alterados silenciosamente.
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalExtensaoOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleExtenderReserva}
              disabled={submittingExtensao}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
            >
              {submittingExtensao ? 'Validando e Estendendo...' : 'Confirmar Extensão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppLayout>
  );
}
