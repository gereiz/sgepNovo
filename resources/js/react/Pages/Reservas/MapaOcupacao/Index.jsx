import React, { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import * as toastrNS from 'toastr';
import 'toastr/build/toastr.min.css';
const toastr = toastrNS && (toastrNS.default || toastrNS.toastr || toastrNS);

import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  Calendar,
  Layers,
  Search,
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
  ChevronLeft,
  ChevronRight,
  Eye,
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

export default function MapaOcupacaoIndex({
  anos = [],
  bisemanas = [],
  clientes = [],
  leds: initialLeds = [],
  dadosIniciais = {},
  diasAlerta = 5,
}) {
  const [loading, setLoading] = useState(false);

  // Ano e Bi-semanas para navegação/referência
  const anoAtual = new Date().getFullYear();
  const [idAno, setIdAno] = useState(anos?.[0]?.id ? String(anos[0].id) : '0');
  const [listaBisemanas, setListaBisemanas] = useState(bisemanas || []);

  // Intervalo de meses para a visualização em grade
  const [mesAtualVisualizacao, setMesAtualVisualizacao] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Filtros
  const [filtroLed, setFiltroLed] = useState('0');
  const [filtroCliente, setFiltroCliente] = useState('0');
  const [filtroStatusPI, setFiltroStatusPI] = useState('T'); // T, com_pi, sem_pi
  const [filtroStatusContrato, setFiltroStatusContrato] = useState('T'); // T, normal, proximo, hoje, encerrado

  // Dados do mapa
  const [mapa, setMapa] = useState(dadosIniciais || { leds: [], total_leds: 0 });

  // Modal de Detalhes da Ocupação
  const [modalDetalheOpen, setModalDetalheOpen] = useState(false);
  const [ocupacaoSelecionada, setOcupacaoSelecionada] = useState(null);
  const [ledSelecionado, setLedSelecionado] = useState(null);

  // Modal de Extensão de Período
  const [modalExtensaoOpen, setModalExtensaoOpen] = useState(false);
  const [novaDataFim, setNovaDataFim] = useState('');
  const [submittingExtensao, setSubmittingExtensao] = useState(false);

  // Modal de Alertas de Término
  const [modalAlertasOpen, setModalAlertasOpen] = useState(false);
  const [alertasTermino, setAlertasTermino] = useState([]);
  const [loadingAlertas, setLoadingAlertas] = useState(false);

  // Carrega bi-semanas se mudar o ano
  useEffect(() => {
    if (!idAno || idAno === '0') return;
    axios.post('/getBisemanass', { bisemana: Number(idAno) })
      .then(res => {
        setListaBisemanas(Object.values(res.data || []));
      })
      .catch(() => {});
  }, [idAno]);

  // Busca mapa de ocupação
  const buscarMapa = () => {
    setLoading(true);
    axios.post('/MapaOcupacaoLed', {
      cliente_id: filtroCliente !== '0' ? Number(filtroCliente) : null,
      outdoor_id: filtroLed !== '0' ? Number(filtroLed) : null,
      status: filtroStatusPI !== 'T' ? filtroStatusPI : null,
    })
      .then(res => {
        setMapa(res.data || { leds: [], total_leds: 0 });
      })
      .catch(() => toastr.error('Erro ao atualizar mapa de ocupação'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    buscarMapa();
  }, [filtroCliente, filtroLed, filtroStatusPI]);

  // Carrega contratos próximos do término
  const abrirAlertasTermino = () => {
    setLoadingAlertas(true);
    setModalAlertasOpen(true);
    axios.post('/GetContratosProximosTerminoLed', { dias: diasAlerta })
      .then(res => {
        setAlertasTermino(res.data || []);
      })
      .catch(() => toastr.error('Erro ao buscar alertas de vigência'))
      .finally(() => setLoadingAlertas(false));
  };

  // Gerar colunas dos próximos 6 meses a partir de mesAtualVisualizacao
  const colunasMeses = useMemo(() => {
    const meses = [];
    const base = new Date(mesAtualVisualizacao);
    for (let i = -1; i < 5; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const nomeMes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
      const primeiroDia = `${yyyy}-${mm}-01`;
      const ultimoDia = new Date(yyyy, d.getMonth() + 1, 0).toISOString().split('T')[0];

      meses.push({
        rotulo: `${nomeMes}/${String(yyyy).slice(2)}`,
        ano: yyyy,
        mesNumero: d.getMonth() + 1,
        primeiroDia,
        ultimoDia,
      });
    }
    return meses;
  }, [mesAtualVisualizacao]);

  const navegarMes = (offset) => {
    setMesAtualVisualizacao(prev => {
      return new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
    });
  };

  // Verifica se uma ocupação do LED atinge um determinado mês
  const getOcupacoesMes = (ocupacoes, colMes) => {
    if (!ocupacoes || ocupacoes.length === 0) return [];
    return ocupacoes.filter(o => {
      const ini = o.dt_inicio;
      const fim = o.dt_fim;
      if (!ini || !fim) return false;
      return (ini <= colMes.ultimoDia && fim >= colMes.primeiroDia);
    });
  };

  // Abrir Modal de Detalhes
  const verDetalhesOcupacao = (led, ocupacao) => {
    setLedSelecionado(led);
    setOcupacaoSelecionada(ocupacao);
    setModalDetalheOpen(true);
  };

  // Abrir Extensão
  const abrirExtensao = (led, ocupacao) => {
    setLedSelecionado(led);
    setOcupacaoSelecionada(ocupacao);
    const fimAtual = ocupacao.dt_fim ? new Date(ocupacao.dt_fim) : new Date();
    fimAtual.setDate(fimAtual.getDate() + 30);
    const yyyy = fimAtual.getFullYear();
    const mm = String(fimAtual.getMonth() + 1).padStart(2, '0');
    const dd = String(fimAtual.getDate()).padStart(2, '0');
    setNovaDataFim(`${yyyy}-${mm}-${dd}`);
    setModalExtensaoOpen(true);
  };

  const confirmarExtensao = () => {
    if (!ocupacaoSelecionada || !novaDataFim) {
      toastr.error('Informe a nova data final!');
      return;
    }
    setSubmittingExtensao(true);
    axios.post('/ExtenderReservaLed', {
      reserva_id: ocupacaoSelecionada.reserva_id,
      nova_data_fim: novaDataFim,
    })
      .then(res => {
        if (res.data?.cod === 1) {
          toastr.success(res.data?.msg || 'Vigência estendida com sucesso!');
          setModalExtensaoOpen(false);
          setModalDetalheOpen(false);
          buscarMapa();
        } else {
          toastr.error(res.data?.msg || 'Não foi possível estender a reserva');
        }
      })
      .catch(err => {
        toastr.error(err.response?.data?.msg || 'Erro ao estender reserva');
      })
      .finally(() => setSubmittingExtensao(false));
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

  // Filtragem local por status de contrato se selecionado
  const ledsExibidos = useMemo(() => {
    const list = mapa.leds || [];
    if (filtroStatusContrato === 'T') return list;

    return list.filter(led => {
      const oc = led.ocupacoes || [];
      return oc.some(o => o.status_contrato?.status === filtroStatusContrato);
    });
  }, [mapa.leds, filtroStatusContrato]);

  return (
    <AppLayout>
      <Head title="Mapa de Ocupação • LEDs Digitais" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 ring-1 ring-purple-200">
              <Tv className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Mapa de Ocupação • LEDs Digitais
                </h1>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 font-bold">
                  {mapa.total_leds || 0} LEDs Ativos
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                Visualização temporal contínua da ocupação, vigências de contratos e acompanhamento de término.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={abrirAlertasTermino}
              className="text-xs border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
            >
              <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-600" />
              Contratos Próximos do Término
            </Button>

            <a
              href="/ResPaineisCli"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#006397] text-white hover:bg-[#004f7a] shadow-sm transition"
            >
              <CalendarRange className="h-4 w-4" />
              Gerenciar Reservas
            </a>
          </div>
        </div>

        {/* BARRA DE FILTROS E NAVEGAÇÃO TEMPORAL */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

              {/* Filtro LED */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Painel LED
                </label>
                <Select value={filtroLed} onValueChange={setFiltroLed}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os LEDs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos os LEDs</SelectItem>
                    {(initialLeds || []).map(l => (
                      <SelectItem key={l.id} value={String(l.id)}>
                        LED #{l.identificacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Cliente */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cliente
                </label>
                <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os clientes" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="0">Todos os Clientes</SelectItem>
                    {clientes.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.razao_social || c.nome_fantasia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Status PI */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status PI
                </label>
                <Select value={filtroStatusPI} onValueChange={setFiltroStatusPI}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status PI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T">Todos</SelectItem>
                    <SelectItem value="com_pi">Com PI Emitido</SelectItem>
                    <SelectItem value="sem_pi">Sem PI (Pendente)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Status Vigência */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status da Vigência
                </label>
                <Select value={filtroStatusContrato} onValueChange={setFiltroStatusContrato}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status Vigência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T">Todos os Status</SelectItem>
                    <SelectItem value="normal">Normal (Vigente)</SelectItem>
                    <SelectItem value="proximo">Término Próximo (≤ 5 dias)</SelectItem>
                    <SelectItem value="hoje">Vencendo Hoje</SelectItem>
                    <SelectItem value="encerrado">Contrato Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Controles de Navegação de Meses & Legenda */}
            <div className="mt-4 pt-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navegarMes(-1)}
                  className="h-8 w-8 p-0"
                  title="Mês anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMesAtualVisualizacao(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
                  className="text-xs h-8"
                >
                  Mês Atual
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navegarMes(1)}
                  className="h-8 w-8 p-0"
                  title="Próximo mês"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Legenda de Status */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Normal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span>Término Próximo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Vencendo Hoje</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span>Encerrado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded border border-dashed border-slate-300 bg-slate-100"></span>
                  <span>Disponível</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GRADE DO MAPA DE OCUPAÇÃO */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="py-3 px-5 border-b bg-slate-50/70 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">
              Grade Mensal de Ocupação por Painel LED
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={buscarMapa}
              disabled={loading}
              className="h-7 text-xs text-slate-500"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b">
                    <th className="py-3 px-4 w-64 min-w-[240px] sticky left-0 bg-slate-100 z-10 border-r">
                      Painel LED
                    </th>
                    {colunasMeses.map((m, idx) => (
                      <th
                        key={idx}
                        className="py-3 px-3 text-center min-w-[150px] border-r last:border-r-0"
                      >
                        <span className="font-bold text-slate-800">{m.rotulo}</span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={colunasMeses.length + 1} className="py-12 text-center text-slate-400">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-600" />
                        Carregando mapa de ocupação dos LEDs...
                      </td>
                    </tr>
                  ) : ledsExibidos.length === 0 ? (
                    <tr>
                      <td colSpan={colunasMeses.length + 1} className="py-12 text-center text-slate-400">
                        Nenhum LED localizado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    ledsExibidos.map(led => (
                      <tr key={led.painel_id} className="hover:bg-slate-50/70 transition">

                        {/* Coluna Fixa do LED */}
                        <td className="py-3 px-4 sticky left-0 bg-white hover:bg-slate-50/70 z-10 border-r">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[11px]">
                              LED #{led.identificacao}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                              {led.bairro || '—'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            {led.logradouro ? `${led.logradouro}, ${led.numero || 'S/N'}` : 'Endereço não informado'}
                          </p>
                        </td>

                        {/* Colunas dos Meses */}
                        {colunasMeses.map((colMes, mIdx) => {
                          const ocupacoesMes = getOcupacoesMes(led.ocupacoes, colMes);
                          const isVazio = ocupacoesMes.length === 0;

                          return (
                            <td
                              key={mIdx}
                              className="py-2 px-2.5 text-center border-r last:border-r-0 align-top"
                            >
                              {isVazio ? (
                                <div className="h-14 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-[10px] text-slate-400">
                                  Livre
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {ocupacoesMes.map(oc => {
                                    const st = oc.status_contrato?.status || 'normal';
                                    let corCard = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                                    let badgeCor = 'bg-emerald-600';

                                    if (st === 'proximo') {
                                      corCard = 'bg-amber-50 border-amber-300 text-amber-900';
                                      badgeCor = 'bg-amber-500';
                                    } else if (st === 'hoje') {
                                      corCard = 'bg-amber-100 border-amber-400 text-amber-950 ring-1 ring-amber-400';
                                      badgeCor = 'bg-amber-600 animate-pulse';
                                    } else if (st === 'encerrado') {
                                      corCard = 'bg-rose-50 border-rose-300 text-rose-900';
                                      badgeCor = 'bg-rose-600';
                                    }

                                    return (
                                      <div
                                        key={oc.reserva_id}
                                        onClick={() => verDetalhesOcupacao(led, oc)}
                                        className={`p-2 rounded-lg border text-left cursor-pointer transition hover:shadow-md ${corCard}`}
                                      >
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="font-bold text-[11px] truncate" title={oc.cliente_nome}>
                                            {oc.cliente_nome || 'Cliente'}
                                          </span>
                                          <span className={`w-2 h-2 rounded-full shrink-0 ${badgeCor}`} />
                                        </div>

                                        <p className="text-[10px] opacity-80 truncate mt-0.5">
                                          {oc.campanha || 'Sem campanha'}
                                        </p>

                                        <div className="mt-1 pt-1 border-t border-black/5 flex items-center justify-between text-[9px] opacity-75">
                                          <span>{formatDataBR(oc.dt_fim)}</span>
                                          <span>{oc.pi_ok ? 'PI OK' : 'Sem PI'}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </td>
                          );
                        })}

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ============================================================== */}
      {/* MODAL: DETALHES DA OCUPAÇÃO / CONTRATO                         */}
      {/* ============================================================== */}
      <Dialog open={modalDetalheOpen} onOpenChange={setModalDetalheOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tv className="h-5 w-5 text-purple-600" />
              Detalhes da Reserva • LED #{ledSelecionado?.identificacao}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {ledSelecionado?.logradouro} {ledSelecionado?.bairro ? `— ${ledSelecionado.bairro}` : ''}
            </DialogDescription>
          </DialogHeader>

          {ocupacaoSelecionada && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente:</span>
                  <span className="font-bold text-slate-800">{ocupacaoSelecionada.cliente_nome || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Campanha:</span>
                  <span className="font-semibold text-slate-700">{ocupacaoSelecionada.campanha || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Período de Vigência:</span>
                  <span className="font-bold text-slate-800">
                    {formatDataBR(ocupacaoSelecionada.dt_inicio)} até {formatDataBR(ocupacaoSelecionada.dt_fim)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status do Contrato:</span>
                  <Badge variant="outline" className="text-[10px]">
                    {ocupacaoSelecionada.status_contrato?.label || 'Normal'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Faturamento / PI:</span>
                  <Badge
                    variant="outline"
                    className={ocupacaoSelecionada.pi_ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]' : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'}
                  >
                    {ocupacaoSelecionada.pi_ok ? 'PI Emitido' : 'Sem PI (Pendente)'}
                  </Badge>
                </div>
              </div>

              {ocupacaoSelecionada.observacao && (
                <div>
                  <span className="block font-semibold text-slate-700 mb-1">Observações:</span>
                  <p className="p-2.5 rounded bg-slate-50 text-slate-600 text-[11px] border">
                    {ocupacaoSelecionada.observacao}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalDetalheOpen(false)}
              className="text-xs"
            >
              Fechar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setModalDetalheOpen(false);
                abrirExtensao(ledSelecionado, ocupacaoSelecionada);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Estender Vigência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: ESTENDER PERÍODO DO CONTRATO                            */}
      {/* ============================================================== */}
      <Dialog open={modalExtensaoOpen} onOpenChange={setModalExtensaoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Estender Vigência do LED #{ledSelecionado?.identificacao}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Cliente: <strong>{ocupacaoSelecionada?.cliente_nome}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-slate-50 border text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Data de Término Atual:</span>
                <span className="font-bold text-slate-800">{formatDataBR(ocupacaoSelecionada?.dt_fim)}</span>
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
              <strong>Importante:</strong> O sistema checa se não há conflitos de reservas no período adicional. Documentos e PIs já emitidos permanecem intactos.
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
              onClick={confirmarExtensao}
              disabled={submittingExtensao}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
            >
              {submittingExtensao ? 'Validando...' : 'Confirmar Extensão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: ALERTAS DE CONTRATOS PRÓXIMOS DO TÉRMINO               */}
      {/* ============================================================== */}
      <Dialog open={modalAlertasOpen} onOpenChange={setModalAlertasOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Contratos Próximos do Término (Janela de {diasAlerta} dias)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Contratos de LEDs que requerem renovação, extensão ou desocupação imediata.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto space-y-2 py-2">
            {loadingAlertas ? (
              <div className="py-8 text-center text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-600" />
                Buscando alertas de término...
              </div>
            ) : alertasTermino.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                Nenhum contrato de LED vencendo ou próximo do término nos próximos {diasAlerta} dias.
              </div>
            ) : (
              alertasTermino.map(alerta => (
                <div
                  key={alerta.reserva_id}
                  className="p-3 rounded-lg border border-amber-200 bg-amber-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">
                      LED #{alerta.painel_ident} • {alerta.cliente_nome}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Campanha: {alerta.campanha || '—'}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Vigência: {formatDataBR(alerta.dt_inicio)} até {formatDataBR(alerta.dt_fim)}
                    </span>
                  </div>

                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 font-bold shrink-0">
                    {alerta.status_contrato?.label}
                  </Badge>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalAlertasOpen(false)}
              className="text-xs"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppLayout>
  );
}
