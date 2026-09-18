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
  Share2,
  Printer,
  CreditCard,
  HelpCircle,
  Loader2,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/react/Components/ui/card';
import { Badge } from '@/react/Components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/react/Components/ui/accordion';
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

function getInitials(str) {
  const s = String(str || '').trim();
  if (!s) return '?';
  const partes = s.split(/\s+/).filter(Boolean);
  let iniciais = partes[0][0] || '';
  if (partes.length > 1) iniciais += partes[partes.length - 1][0] || '';
  return iniciais.toUpperCase();
}

function parseMoney(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') {
    if (!isFinite(v)) return 0;
    return parseFloat(v.toFixed(2));
  }
  if (typeof v !== 'string') v = String(v);
  const s = v.replace(/\D/g, '');
  if (!s) return 0;
  const n = parseInt(s, 10);
  if (isNaN(n)) return 0;
  return n / 100;
}
function formatMoney(v) {
  const n = parseMoney(v);
  if (!isFinite(n)) return '';
  const fixed = Number(n).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return withDots + ',' + decPart;
}
function applyMoneyMask(raw) {
  if (raw === null || raw === undefined) return '';
  if (typeof raw === 'number') return formatMoney(raw);
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  const padded = digits.padStart(3, '0');
  const decPart = padded.slice(-2);
  const intPart = padded.slice(0, -2).replace(/^0+(?=\d)/, '') || '0';
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return withDots + ',' + decPart;
}
function formatMoneyDisplay(v) {
  return applyMoneyMask(v);
}

function HoverTooltip({ label, content, children, side = 'top', maxWidthClass = 'max-w-md' }) {
  const [open, setOpen] = useState(false);
  const timerRef = React.useRef(null);
  const closeTimerRef = React.useRef(null);
  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  const openNow = () => { clearTimeout(closeTimerRef.current); clearTimeout(timerRef.current); setOpen(true); };
  const closeSoon = () => {
    clearTimeout(closeTimerRef.current);
    clearTimeout(timerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), 160);
  };
  return (
    <span className="relative inline-flex"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={closeSoon}
    >
      {children}
      {open && (
        <span role="tooltip"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          className={cn(
            'pointer-events-auto absolute z-[90]',
            sideClasses[side] || sideClasses.top,
            maxWidthClass
          )}>
          {label && (
            <div className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold shadow-xl whitespace-nowrap">
              {label}
            </div>
          )}
          {content && (
            <div className={cn(
              'px-3 py-2 rounded-md bg-slate-900 text-slate-100 text-sm shadow-xl',
              !label && 'mt-0'
            )}>
              {content}
            </div>
          )}
        </span>
      )}
    </span>
  );
}

function NovaPIModal({ isOpen, onClose, preReservation, currentBiSemana, onEmitSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [highestCompletedStep, setHighestCompletedStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewConfirm, setShowPreviewConfirm] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [editStepOne, setEditStepOne] = useState(false);
  const [editStepTwo, setEditStepTwo] = useState(false);
  const [editStepThree, setEditStepThree] = useState(false);
  const [editStepFour, setEditStepFour] = useState(false);
  const [ufList, setUfList] = useState([]);
  const [cidadeList, setCidadeList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [agenteList, setAgenteList] = useState([]);
  const [servicoList, setServicoList] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(1);
    setHighestCompletedStep(0);
    setIsSuccess(false);
    setIsSubmitting(false);
    setShowPreviewConfirm(false);
    if (previewPdfUrl) try { URL.revokeObjectURL(previewPdfUrl); } catch (_) {}
    setPreviewPdfUrl(null);
    setEditStepOne(false);
    setEditStepTwo(false);
    setEditStepThree(false);
    setEditStepFour(false);
    setServicoSelecionado(null);
    (async () => {
      try {
        const [ufs, users, agentes, servicos] = await Promise.all([
          axios.get('/dtGetUfs').then(r => r.data).catch(() => []),
          axios.get('/getUsuarios').then(r => r.data).catch(() => []),
          axios.get('/getAgentes').then(r => r.data).catch(() => []),
          axios.get('/ListaServicos').then(r => r.data).catch(() => []),
        ]);
        setUfList(Array.isArray(ufs) ? ufs : []);
        setUserList(Array.isArray(users) ? users : []);
        setAgenteList(Array.isArray(agentes) ? agentes : []);
        setServicoList(Array.isArray(servicos) ? servicos : []);
        const ufId = Number(preReservation?.uf_id || 0);
        if (ufId > 0) {
          try {
            const cids = await axios.post('/dtGetCidades', { uf: ufId }).then(r => r.data).catch(() => []);
            setCidadeList(Array.isArray(cids) ? cids : []);
          } catch (_) {}
        }
      } catch (_) {}
    })();
  }, [isOpen, preReservation?.grupo_key]);

  // --- Step 1: Cliente ---
  const [clienteId, setClienteId] = useState(Number(preReservation?.cliente_id || 0));
  const [clienteNome, setClienteNome] = useState(
    (preReservation?.corporate_reason && String(preReservation.corporate_reason).trim() !== '')
      ? preReservation.corporate_reason
      : (preReservation?.client_name || '')
  );
  const [cnpj, setCnpj] = useState(preReservation?.cpf_cnpj || '');
  const [endereco, setEndereco] = useState(
    (preReservation?.endereco_num && String(preReservation.endereco_num).trim() !== '')
      ? preReservation.endereco_num
      : (preReservation?.address || '')
  );
  const [cep, setCep] = useState(preReservation?.cep || '');
  const [uf, setUf] = useState(Number(preReservation?.uf_id || 0));
  const [cidade, setCidade] = useState(Number(preReservation?.cidade_id || 0));
  const [celular, setCelular] = useState(
    (preReservation?.tel_responsavel && String(preReservation.tel_responsavel).trim() !== '')
      ? preReservation.tel_responsavel
      : (preReservation?.phone || preReservation?.celular || '')
  );
  const [inscEst, setInscEst] = useState(
    (preReservation?.state_registration && String(preReservation.state_registration).trim() !== '')
      ? preReservation.state_registration
      : 'ISENTA'
  );
  const [responsavel, setResponsavel] = useState(preReservation?.responsible_name || '');
  const [email, setEmail] = useState(
    (preReservation?.email_responsavel && String(preReservation.email_responsavel).trim() !== '')
      ? preReservation.email_responsavel
      : (preReservation?.email || '')
  );

  useEffect(() => {
    if (!isOpen) return;
    setClienteId(Number(preReservation?.cliente_id || 0));
    setClienteNome(
      (preReservation?.corporate_reason && String(preReservation.corporate_reason).trim() !== '')
        ? preReservation.corporate_reason
        : (preReservation?.client_name || '')
    );
    setCnpj(preReservation?.cpf_cnpj || '');
    setEndereco(
      (preReservation?.endereco_num && String(preReservation.endereco_num).trim() !== '')
        ? preReservation.endereco_num
        : (preReservation?.address || '')
    );
    setCep(preReservation?.cep || '');
    setUf(Number(preReservation?.uf_id || 0));
    setCidade(Number(preReservation?.cidade_id || 0));
    setCelular(
      (preReservation?.tel_responsavel && String(preReservation.tel_responsavel).trim() !== '')
        ? preReservation.tel_responsavel
        : (preReservation?.phone || preReservation?.celular || '')
    );
    setInscEst(
      (preReservation?.state_registration && String(preReservation.state_registration).trim() !== '')
        ? preReservation.state_registration
        : 'ISENTA'
    );
    setResponsavel(preReservation?.responsible_name || '');
    setEmail(
      (preReservation?.email_responsavel && String(preReservation.email_responsavel).trim() !== '')
        ? preReservation.email_responsavel
        : (preReservation?.email || '')
    );
  }, [isOpen, preReservation?.grupo_key]);

  const handleChangeUf = async (val) => {
    const id = parseInt(val) || 0;
    setUf(id);
    setCidade(0);
    setCidadeList([]);
    if (id > 0) {
      try {
        const r = await axios.post('/dtGetCidades', { uf: id });
        setCidadeList(Array.isArray(r.data) ? r.data : []);
      } catch (_) { setCidadeList([]); }
    }
  };

  // --- Step 2: Reserva & Agentes ---
  const [campanha, setCampanha] = useState(preReservation?.campaign_title || '');
  const [vendedorId, setVendedorId] = useState(Number(preReservation?.seller_id || 0));
  const [agentesId, setAgentesId] = useState([]);
  const [participantesOptions, setParticipantesOptions] = useState([]);
  const [comissoesAtivas, setComissoesAtivas] = useState([]);
  const [participantesSelected, setParticipantesSelected] = useState([]);
  const [participantesComissoes, setParticipantesComissoes] = useState([]);
  useEffect(() => {
    if (!isOpen) return;
    setCampanha(preReservation?.campaign_title || '');
    setVendedorId(Number(preReservation?.seller_id || 0));
    setAgentesId([]);
    setParticipantesSelected([]);
    setParticipantesComissoes([]);
    if (participantesOptions.length === 0 || comissoesAtivas.length === 0) {
      handleGetUsuarios();
    }
    if (servicoList.length === 0) {
      handleGetUsuariosServicos();
    }
  }, [isOpen, preReservation?.grupo_key]);
  const totalPaineis = Number(preReservation?.panels_count || 0);

  // --- Step 3: Faturamento ---
  const [faturar_sobre, setFaturarSobre] = useState(0);
  const [faturar_contra, setFaturarContra] = useState(0);
  const [enviar_faturamento, setEnviarFaturamento] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    setFaturarSobre(0);
    setFaturarContra(0);
    setEnviarFaturamento(0);
  }, [isOpen, preReservation?.grupo_key]);

  // --- Step 4: Serviços / Financeiro ---
  const [servicoComboId, setServicoComboId] = useState(0);
  const [quantidade, setQuantidade] = useState(totalPaineis > 0 ? totalPaineis : 1);
  const [bonificado, setBonificado] = useState(0);
  const [vlrUnit, setVlrUnit] = useState('');
  const [vlrDesc, setVlrDesc] = useState('');
  const [vlrCusto, setVlrCusto] = useState('');
  const [vlrTotalCalc, setVlrTotalCalc] = useState(0);
  const [vlrTotalFinCalc, setVlrTotalFinCalc] = useState(0);
  const [detalhesServ, setDetalhesServ] = useState('');
  const [servicosPagos, setServicosPagos] = useState([]);

  const parseNumber = (v) => {
    if (v === null || v === undefined) return 0;
    const pm = parseMoney(v);
    if (pm !== 0) return pm;
    const s = String(v).replace(/\./g, '').replace(',', '.');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const qtdCobrada = Math.max(0, parseInt(quantidade || 0, 10) - parseInt(bonificado || 0, 10));
  const effUnit = Math.max(0, parseNumber(vlrUnit) - parseNumber(vlrDesc));
  const vlrTotalServ = (qtdCobrada * effUnit);
  const vlrTotalFinServ = (qtdCobrada * Math.max(0, parseNumber(vlrUnit) - parseNumber(vlrDesc) - parseNumber(vlrCusto)));

  useEffect(() => {
    setVlrTotalCalc(vlrTotalServ);
    setVlrTotalFinCalc(vlrTotalFinServ);
  }, [vlrUnit, vlrDesc, vlrCusto, quantidade, bonificado]);

  const [pgto, setPgto] = useState('0');
  const [formaPgto, setFormaPgto] = useState(0);
  const todayYmd = (() => { const d = new Date(); const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; })();
  const [dtPgto, setDtPgto] = useState(todayYmd);
  const [parcelado, setParcelado] = useState(0);
  const [qtdParcelas, setQtdParcelas] = useState(1);
  const [parcelas, setParcelas] = useState([]);

  const addMonthsLocal = (dateStr, monthsToAdd) => {
    const [yyyy, mm, dd] = (dateStr || '').split('-').map(n => parseInt(n, 10));
    const d = new Date(yyyy || new Date().getFullYear(), (mm ? mm - 1 : new Date().getMonth()), dd || new Date().getDate());
    d.setMonth(d.getMonth() + monthsToAdd);
    const yy = d.getFullYear();
    const m2 = String(d.getMonth() + 1).padStart(2, '0');
    const d2 = String(d.getDate()).padStart(2, '0');
    return `${yy}-${m2}-${d2}`;
  };
  const gerarParcelasIniciais = () => {
    if (Number(parcelado) !== 1) { setParcelas([]); return; }
    const qtd = parseInt(qtdParcelas || 0, 10);
    if (!qtd) { setParcelas([]); return; }
    const total = parseFloat(totalServicosN || 0) <= 0 ? (parseFloat(vlrTotalCalc || 0) || 0) : totalServicosN;
    if (!total || total <= 0) { setParcelas([]); return; }
    const base = Math.floor((total / qtd) * 100) / 100;
    const resto = parseFloat((total - base * (qtd - 1)).toFixed(2));
    const novas = [];
    for (let i = 0; i < qtd; i++) {
      const valor = (i === qtd - 1 ? resto : base).toFixed(2);
      const data = addMonthsLocal(dtPgto || todayYmd, i);
      novas.push({ valor: formatMoney(valor), data });
    }
    setParcelas(novas);
  };
  const ajustarUltimaParcela = () => {
    if (!parcelas || parcelas.length === 0) return;
    const alvo = (parseFloat(totalServicosN || 0) > 0 ? parseFloat(totalServicosN || 0) : parseFloat(vlrTotalCalc || 0)) || 0;
    if (alvo <= 0) return;
    const n = parcelas.length;
    let soma = 0;
    for (let i = 0; i < n - 1; i++) soma += parseNumber(parcelas[i].valor || 0);
    let ultima = parseFloat((alvo - soma).toFixed(2));
    if (ultima < 0) ultima = 0;
    const novas = [...parcelas];
    novas[n - 1] = { ...novas[n - 1], valor: formatMoney(ultima.toFixed(2)) };
    setParcelas(novas);
  };
  const totalServicosN = (servicosPagos || []).reduce((s, x) => s + parseNumber(x.vlr_total || 0), 0);
  useEffect(() => {
    if (!isOpen) return;
    setServicoComboId(0);
    setQuantidade(totalPaineis > 0 ? totalPaineis : 1);
    setBonificado(0);
    setVlrUnit('');
    setVlrDesc('');
    setVlrCusto('');
    setVlrTotalCalc(0);
    setVlrTotalFinCalc(0);
    setDetalhesServ('');
    setServicosPagos([]);
    setPgto('');
    setFormaPgto(0);
    setDtPgto(todayYmd);
    setParcelado(0);
    setQtdParcelas(1);
    setParcelas([]);
  }, [isOpen, preReservation?.grupo_key]);

  useEffect(() => {
    if (!isOpen) return;
    gerarParcelasIniciais();
  }, [parcelado, qtdParcelas, dtPgto, servicosPagos, vlrTotalCalc]);

  // --- Step 5: Observações ---
  const [observacao, setObservacao] = useState('');
  useEffect(() => { if (isOpen) setObservacao(preReservation?.notes || ''); }, [isOpen, preReservation?.grupo_key]);

  // --- Navegação passos c/ validação igual Vue ---
  const handleNextStepOne = () => {
    if (Number(uf) === 0) { toastr.error('Selecione a UF do Cliente'); return; }
    if (Number(cidade) === 0) { toastr.error('Selecione a Cidade do Cliente'); return; }
    setHighestCompletedStep(s => Math.max(s, 1));
    setCurrentStep(2);
  };
  const handleNextStepTwo = () => {
    if (!Array.isArray(participantesSelected) || participantesSelected.length === 0) {
      toastr.error('Selecione pelo menos um Participante (Vendedor ou Agente)'); return;
    }
    const algumSemComissao = participantesSelected.some(key => {
      const reg = (participantesComissoes || []).find(pc => pc.chave === key);
      return !reg || Number(reg.comissao_id) <= 0;
    });
    if (algumSemComissao) {
      toastr.error('Cada participante selecionado deve ter uma Regra de Comissão Padrão definida.'); return;
    }
    const temUser = participantesSelected.some(k => String(k).startsWith('user:'));
    if (!temUser) { toastr.error('Selecione pelo menos um Vendedor como participante.'); return; }
    setHighestCompletedStep(s => Math.max(s, 2));
    setCurrentStep(3);
  };
  const handleNextStepThree = () => {
    if (Number(faturar_sobre) === 0 || Number(faturar_contra) === 0 || Number(enviar_faturamento) === 0) {
      toastr.error('Preencha todos os campos para continuar.');
      return;
    }
    setHighestCompletedStep(s => Math.max(s, 3));
    setCurrentStep(4);
  };

  const handleGetServico = async (id) => {
    const sid = parseInt(id) || 0;
    setServicoComboId(sid);
    setServicoSelecionado(null);
    if (sid > 0) {
      try {
        const r = await axios.post('/GetServico', { id_servico: sid });
        if (r && r.data) {
          setServicoSelecionado(r.data);
          if (!vlrUnit || String(vlrUnit).trim() === '') {
            if (r.data.vlr_padrao !== undefined && r.data.vlr_padrao !== null) setVlrUnit(formatMoney(String(r.data.vlr_padrao)));
          }
          if (!vlrCusto || String(vlrCusto).trim() === '') {
            if (r.data.custo_padrao !== undefined && r.data.custo_padrao !== null) setVlrCusto(formatMoney(String(r.data.custo_padrao)));
          }
        }
      } catch (e) { toastr.error('Falha ao carregar dados do serviço.'); }
    }
  };

  const handleAddServico = () => {
    const q = parseInt(quantidade || 0, 10);
    if (q > totalPaineis) { toastr.error('Quantidade do serviço é maior que a quantidade de Painéis disponíveis!'); return; }
    const b = parseInt(bonificado || 0, 10);
    if (b < 0) { toastr.error('Bonificado não pode ser negativo!'); return; }
    if (b > q) { toastr.error('Bonificado não pode ser maior que a Quantidade!'); return; }
    if (q < 1) { toastr.error('Quantidade do serviço não pode ser menor que 1 !'); return; }
    if (parseNumber(vlrUnit) < 1 || String(vlrUnit).trim() === '') { toastr.error('Valor Unitário do serviço não pode ser menor que R$ 1.00 !'); return; }
    if (parseNumber(vlrDesc) > parseNumber(vlrUnit)) { toastr.error('Valor do Desconto não pode ser maior que o Valor Unitário !'); return; }
    if (!servicoSelecionado || !servicoSelecionado.id) { toastr.error('Selecione um Serviço.'); return; }
    setServicosPagos([...servicosPagos, {
      id: servicoSelecionado.id,
      nome: servicoSelecionado.nome,
      quantidade: q,
      bonificado: b,
      qtd_cobrada: q - b,
      vlr_unit: formatMoney(vlrUnit),
      vlr_desc: formatMoney(vlrDesc),
      vlr_custo: formatMoney(vlrCusto),
      vlr_total: formatMoney(vlrTotalServ.toFixed(2)),
      vlr_total_fin: formatMoney(vlrTotalFinServ.toFixed(2)),
      detalhes: detalhesServ,
      comissoesOverride: {},
    }]);
    setServicoComboId(0);
    setServicoSelecionado(null);
    setQuantidade(totalPaineis > 0 ? totalPaineis : 1);
    setBonificado(0);
    setVlrUnit('');
    setVlrDesc('');
    setVlrCusto('');
    setDetalhesServ('');
  };
  const handleRemoveServicoPago = (idx) => setServicosPagos(servicosPagos.filter((_, i) => i !== idx));

  const handleNextStepFour = async () => {
    if (pgto === '') { toastr.error('Informe se o Pedido foi Pago'); return; }
    if (!servicosPagos || servicosPagos.length === 0) { toastr.error('Adicione ao menos um Serviço'); return; }
    if (Number(formaPgto) === 0) { toastr.error('Selecione a Forma de Pagamento'); return; }
    if (String(pgto) === '1') {
      if (!dtPgto || String(dtPgto).trim() === '') { toastr.error('Informe a Data de Pagamento'); return; }
      if (String(dtPgto).length !== 10) { toastr.error('Data de Pagamento Inválida'); return; }
    }
    if (String(pgto) === '0') {
      const ok = window.confirm('Atenção: Você está realizando uma PI sem pagamento. Deseja continuar?');
      if (!ok) return;
    }
    if (Number(parcelado) === 1 && Number(formaPgto) >= 3) {
      const soma = (parcelas || []).reduce((s, p) => s + parseNumber(p.valor || 0), 0);
      const alvo = totalServicosN || 0;
      if (parseFloat(soma.toFixed(2)) > parseFloat(alvo.toFixed(2))) {
        toastr.error('Atenção: soma das parcelas excede o total.');
        return;
      }
      if (parseFloat(soma.toFixed(2)) !== parseFloat(alvo.toFixed(2))) {
        toastr.error('Soma das parcelas difere do total dos serviços');
        return;
      }
    }
    setHighestCompletedStep(s => Math.max(s, 4));
    setCurrentStep(5);
  };

  const calcularValorComissao = ({ regraTipo, regraValor, vlrServicoUnit, vlrServicoDescUnit, vlrServicoCustoUnit, qtdCobrada }) => {
    const unit = parseNumber(vlrServicoUnit);
    const desc = parseNumber(vlrServicoDescUnit);
    const cust = parseNumber(vlrServicoCustoUnit);
    const qtd  = Number(qtdCobrada) || 0;
    const baseUnit = Math.max(0, unit - desc - cust);
    const base = Math.max(0, qtd * baseUnit);
    const tipo = Number(regraTipo) || 0;
    const valor = Number(regraValor) || 0;
    if (tipo === 1) return parseFloat((base * (valor / 100)).toFixed(2));
    if (tipo === 2) return parseFloat(valor.toFixed(2));
    return 0;
  };

  const handleParticipanteComissaoChange = (chave, action) => {
    if (action && action.remove) {
      setParticipantesComissoes(prev => prev.filter(pc => pc.chave !== chave));
      return;
    }
    if (action && action.add) {
      const opt = action.opt || {};
      setParticipantesComissoes(prev => {
        if (prev.some(pc => pc.chave === chave)) return prev;
        return [...prev, {
          chave,
          pessoa_tipo: opt.pessoa_tipo || '',
          pessoa_id: Number(opt.pessoa_id) || 0,
          nome: opt.nome || '',
          badge_label: opt.badge_label || '',
          comissao_id: 0,
          comissao_tipo: 0,
          comissao_valor_numerico: 0,
          comissao_nome: '',
        }];
      });
      return;
    }
    if (action && typeof action.comissao_id !== 'undefined') {
      const cid = Number(action.comissao_id) || 0;
      const reg = (comissoesAtivas || []).find(c => Number(c.id) === cid) || null;
      setParticipantesComissoes(prev => prev.map(pc => {
        if (pc.chave !== chave) return pc;
        return {
          ...pc,
          comissao_id: cid,
          comissao_tipo: reg ? Number(reg.tipo_comissao) || 0 : 0,
          comissao_valor_numerico: reg ? Number(reg.valor_numerico) || 0 : 0,
          comissao_nome: reg ? (reg.nome || '') : '',
        };
      }));
    }
  };

  const handleServicoOverrideComissaoChange = (servIdx, chave, novoComissaoId) => {
    const cidRaw = Number(novoComissaoId);
    const cid = isNaN(cidRaw) ? 0 : cidRaw;
    const pc = (participantesComissoes || []).find(p => p.chave === chave);
    setServicosPagos(prev => prev.map((sp, si) => {
      if (si !== servIdx) return sp;
      const ov = sp.comissoesOverride && typeof sp.comissoesOverride === 'object' ? { ...sp.comissoesOverride } : {};
      if (cid === 0) {
        delete ov[chave];
      } else if (cid === -1) {
        ov[chave] = {
          comissao_id: -1,
          comissao_tipo: 0,
          comissao_valor_numerico: 0,
          zerado: true,
        };
      } else {
        const reg = (comissoesAtivas || []).find(c => Number(c.id) === cid) || null;
        const heranca = pc ? {
          comissao_id: Number(pc.comissao_id) || 0,
          comissao_tipo: Number(pc.comissao_tipo) || 0,
          comissao_valor_numerico: Number(pc.comissao_valor_numerico) || 0,
        } : { comissao_id: 0, comissao_tipo: 0, comissao_valor_numerico: 0 };
        const novo = {
          comissao_id: cid,
          comissao_tipo: reg ? Number(reg.tipo_comissao) || 0 : heranca.comissao_tipo,
          comissao_valor_numerico: reg ? Number(reg.valor_numerico) || 0 : heranca.comissao_valor_numerico,
        };
        const isPadrao = (
          novo.comissao_id === heranca.comissao_id &&
          novo.comissao_tipo === heranca.comissao_tipo &&
          Math.abs(novo.comissao_valor_numerico - heranca.comissao_valor_numerico) < 0.001
        );
        if (isPadrao) delete ov[chave];
        else ov[chave] = novo;
      }
      return { ...sp, comissoesOverride: ov };
    }));
  };

  const handleServicoZerarTodasComissoes = (servIdx) => {
    setServicosPagos(prev => prev.map((sp, si) => {
      if (si !== servIdx) return sp;
      const ov = {};
      (participantesComissoes || []).forEach(pc => {
        ov[pc.chave] = {
          comissao_id: -1,
          comissao_tipo: 0,
          comissao_valor_numerico: 0,
          zerado: true,
        };
      });
      return { ...sp, comissoesOverride: ov };
    }));
  };

  const handleServicoRestaurarTodasComissoes = (servIdx) => {
    setServicosPagos(prev => prev.map((sp, si) => {
      if (si !== servIdx) return sp;
      return { ...sp, comissoesOverride: {} };
    }));
  };

  const buildFormPiPayload = () => {
    const One = { clienteId, clienteNome, cnpj, endereco, cep, uf: Number(uf) || 0, cidade: Number(cidade) || 0, celular, inscEst, responsavel, email };

    const participantesCompletos = (participantesComissoes || []).map(pc => ({
      pessoa_tipo: pc.pessoa_tipo,
      pessoa_id: Number(pc.pessoa_id) || 0,
      nome: pc.nome || '',
      comissao_id: Number(pc.comissao_id) || 0,
      comissao_tipo: Number(pc.comissao_tipo) || 0,
      comissao_valor_numerico: Number(pc.comissao_valor_numerico) || 0,
      comissao_nome: pc.comissao_nome || '',
    })).filter(pc => pc.pessoa_tipo && pc.pessoa_id > 0 && pc.comissao_id > 0);

    let finalVendedorId = Number(vendedorId) || 0;
    let finalVendedorNome = (userList.find(u => Number(u.id) === finalVendedorId) || {}).name || '';
    let finalAgentesId = Array.isArray(agentesId) ? agentesId.filter(Boolean).map(Number) : [];

    if (participantesCompletos.length > 0) {
      const primeiroUser = participantesCompletos.find(pc => pc.pessoa_tipo === 'user');
      if (primeiroUser) {
        finalVendedorId = Number(primeiroUser.pessoa_id) || 0;
        finalVendedorNome = primeiroUser.nome || '';
      }
      finalAgentesId = participantesCompletos
        .filter(pc => pc.pessoa_tipo === 'cliente')
        .map(pc => Number(pc.pessoa_id))
        .filter(Boolean);
    }

    const bsArr = [currentBiSemana || preReservation?.bisemana_id || 0];
    const Two = {
      paineis: preReservation?.panel_ids || preReservation?.panel_details || [],
      bisemanaId: Number(currentBiSemana?.id || preReservation?.bisemana_id || 0),
      campanha,
      vendedorId: finalVendedorId,
      vendedor: finalVendedorNome,
      agentesId: finalAgentesId,
      participantesComissoes: participantesCompletos.length > 0 ? participantesCompletos : null,
    };
    const Three = { faturar_sobre: Number(faturar_sobre) || 0, faturar_contra: Number(faturar_contra) || 0, enviar_faturamento: Number(enviar_faturamento) || 0 };
    const parcelasNumericas = (parcelas || []).map(p => ({
      valor: parseNumber(p.valor || 0).toFixed(2),
      data: p.data,
    }));
    const servicosNumericos = (servicosPagos || []).map(sp => {
      const ov = sp.comissoesOverride && typeof sp.comissoesOverride === 'object' ? sp.comissoesOverride : {};
      return {
        id: Number(sp.id) || 0,
        nome: sp.nome || '',
        quantidade: Number(sp.quantidade) || 0,
        bonificado: Number(sp.bonificado) || 0,
        qtd_cobrada: Number(sp.qtd_cobrada) || 0,
        vlr_unit: parseNumber(sp.vlr_unit),
        vlr_desc: parseNumber(sp.vlr_desc),
        vlr_custo: parseNumber(sp.vlr_custo),
        vlr_total: parseNumber(sp.vlr_total),
        vlr_total_fin: parseNumber(sp.vlr_total_fin),
        detalhes: sp.detalhes || '',
        comissoesOverride: Object.keys(ov).length > 0 ? ov : undefined,
      };
    });
    const Four = {
      servicos: servicosNumericos,
      formaPgto: Number(formaPgto) || 0,
      pgto: String(pgto),
      parcelado: Number(parcelado) || 0,
      qtdParcelas: Number(qtdParcelas) || 1,
      dtPgto,
      dtReserva: preReservation?.date_pre_reserva_ymd || todayYmd,
      vlr_total: parseNumber(totalServicosN || 0),
      vlr_total_fin: parseNumber((servicosPagos || []).reduce((s, sp) => s + parseNumber(sp.vlr_total_fin || 0), 0) || 0),
      parcelasDetalhe: parcelasNumericas,
    };
    const Five = { observacao };
    return { One, Two, Three, Four, Five };
  };

  const handleEmitConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let previaOk = false;
    try {
      const formPi = buildFormPiPayload();
      await axios.post('/sessionData', { formPi });
      try {
        if (previewPdfUrl) try { URL.revokeObjectURL(previewPdfUrl); } catch (_) {}
        const pdfResp = await axios.get('/previewPi', { responseType: 'blob' });
        const isPdf = (pdfResp?.data && (pdfResp.data.type === 'application/pdf' ||
          (typeof pdfResp.data === 'object' && pdfResp.data.size > 500) ||
          (pdfResp.headers && String(pdfResp.headers['content-type'] || '').includes('pdf'))));
        if (!isPdf) {
          throw new Error('Resposta inválida ao gerar a pré-visualização (não é um PDF). Tente novamente.');
        }
        const blob = new Blob([pdfResp.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setPreviewPdfUrl(url);
        try { window.open(url, '_blank', 'noopener,noreferrer'); } catch (_) {}
        previaOk = true;
      } catch (_pdfErro) {
        console.error(_pdfErro);
        const detailMsg = typeof _pdfErro?.response?.data === 'string'
          ? _pdfErro.response.data
          : (_pdfErro?.message || 'Erro ao renderizar PDF');
        toastr.warning('Pré-visualização não pôde ser carregada: ' + detailMsg);
        previaOk = false;
      }
      if (previaOk) {
        setShowPreviewConfirm(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Erro ao gerar pré-visualização da PI';
      toastr.error(typeof msg === 'string' ? msg : 'Erro ao gerar pré-visualização.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGravarDefinitivo = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formPi = buildFormPiPayload();
      await axios.post('/GerarPIPorReserva', {
        grupo_key: preReservation?.grupo_key || null,
        reserva_ids: preReservation?.reserva_ids || [],
        formPiLegado: formPi,
      });
      setIsSuccess(true);
      toastr.success('PI gravada com sucesso!');
      setTimeout(() => {
        if (previewPdfUrl) try { URL.revokeObjectURL(previewPdfUrl); } catch (_) {}
        setPreviewPdfUrl(null);
        setShowPreviewConfirm(false);
        onEmitSuccess && onEmitSuccess();
        onClose();
        router.reload({ only: ['pre_reservations', 'kpis'] });
      }, 1100);
    } catch (err) {
      const resp = err?.response?.data;
      let msg = 'Erro ao gravar PI';
      if (typeof resp === 'string') msg = resp;
      else if (resp?.message) msg = resp.message;
      else if (resp?.msg) msg = resp.msg;
      else if (err?.message) msg = err.message;
      toastr.error(msg);
    } finally {
      if (!isSuccess) setIsSubmitting(false);
      else setTimeout(() => setIsSubmitting(false), 1100);
    }
  };

  const stepsList = [
    { num: 1, title: 'Cliente' },
    { num: 2, title: 'Reserva & Agentes' },
    { num: 3, title: 'Faturamento' },
    { num: 4, title: 'Serviços / Financeiro' },
    { num: 5, title: 'Observações' },
  ];

  const brl = (n) => `R$ ${Number(parseNumber(n)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const biSemanaLabel = currentBiSemana?.label || '—';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[840px] max-h-[93vh] flex flex-col overflow-hidden p-0 border border-slate-200 bg-white shadow-2xl rounded-2xl">
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#006397]/40 text-[#92ccff] rounded-lg border border-[#92ccff]/30"><FileText className="w-5 h-5" /></div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">Pedido de Inserção (PI)</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                {currentStep === 1 && '1. Confira os dados cadastrais do cliente do Pedido de Inserção.'}
                {currentStep === 2 && '2. Selecione os painéis, vendedor responsável e agentes de comissão.'}
                {currentStep === 3 && '3. Configuração de faturamento e emissão da nota fiscal.'}
                {currentStep === 4 && '4. Detalhamento dos serviços, valores, pagamentos e condições financeiras.'}
                {currentStep === 5 && '5. Observações internas e confirmação final de emissão.'}
              </DialogDescription>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bi-Semana</div>
            <div className="text-xs font-semibold text-red-400">{biSemanaLabel}</div>
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-5 gap-2">
            {stepsList.map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              const stepIndex = step.num - 1;
              const completed = step.num <= highestCompletedStep;
              const canClick = !isSubmitting && (completed || isActive);
              return (
                <button key={step.num} type="button"
                  onClick={() => {
                    if (!canClick) {
                      toastr.error('Valide os passos anteriores usando o botão Avançar.');
                      return;
                    }
                    setCurrentStep(step.num);
                  }}
                  disabled={isSubmitting}
                  title={canClick ? (isActive ? 'Passo atual' : 'Clique para voltar') : 'Conclua o passo anterior antes'}
                  className={cn('flex items-center gap-2 p-2 rounded-lg text-left transition-all',
                    canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-75',
                    isActive ? 'bg-[#006397] text-white font-medium shadow-xs' : completed ? 'bg-blue-50 text-[#006397] hover:bg-blue-100 font-medium' : 'text-slate-500 bg-slate-100/70 hover:bg-slate-200/60')}>
                  <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
                    isActive ? 'bg-white text-[#006397]' : completed ? 'bg-[#006397] text-white' : 'bg-slate-200 text-slate-600')}>
                    {completed ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                  </span>
                  <span className="text-xs truncate hidden sm:inline">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto h-[500px]">
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  {/* <h2 className="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção</h2>
                  <p className="text-sm text-gray-500 mt-1 text-center sm:text-left">Confira os dados do cliente do Pedido de Inserção.</p>
                  <p className="text-xs font-bold text-red-500 text-center mt-1">Bi-Semana: {biSemanaLabel}</p> */}
                </div>
                <button type="button" onClick={() => setEditStepOne(v => !v)}
                  className={cn('rounded-full h-10 w-10 text-white flex items-center justify-center',
                    editStepOne ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600')}
                  title={editStepOne ? 'Edição Ativada' : 'Ativar Edição'}>
                  <User className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="label text-sm font-medium text-slate-700">Cliente</label>
                    <Input value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} disabled={!editStepOne} placeholder="Nome do cliente" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label text-sm font-medium text-slate-700">CPF / CNPJ</label>
                    <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} disabled={!editStepOne} placeholder="CPF/CNPJ" className="font-mono" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Endereço</label>
                  <Input value={endereco} onChange={(e) => setEndereco(e.target.value)} disabled={!editStepOne} placeholder="Endereço completo" />
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">CEP</label>
                  <Input value={cep} onChange={(e) => setCep(e.target.value)} disabled={!editStepOne} placeholder="00.000-000" className="font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">UF</label>
                  <Select value={String(Number(uf) || 0)} onValueChange={handleChangeUf} disabled={!editStepOne}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>Selecione</SelectItem>
                      {(ufList || []).map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Cidade</label>
                  <Select value={String(Number(cidade) || 0)} onValueChange={(v) => setCidade(parseInt(v) || 0)} disabled={!editStepOne}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>Selecione</SelectItem>
                      {(cidadeList || []).map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Celular</label>
                  <Input value={celular} onChange={(e) => setCelular(e.target.value)} disabled={!editStepOne} placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Insc. Estadual</label>
                  <Input value={inscEst} onChange={(e) => setInscEst(e.target.value)} disabled={!editStepOne} placeholder="Inscrição Estadual" />
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Responsável</label>
                  <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} disabled={!editStepOne} placeholder="Nome do responsável" />
                </div>
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">E-mail</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editStepOne} placeholder="email@exemplo.com" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  {/* <h2 className="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção</h2>
                  <p className="text-sm text-gray-500 mt-1">Confira os dados da reserva do Pedido de Inserção.</p>
                  <p className="text-xs font-bold text-red-500 text-center mt-1">Bi-Semana: {biSemanaLabel}</p> */}
                </div>
                <button type="button" onClick={() => { setEditStepTwo(v => !v); handleGetUsuarios(); }}
                  className={cn('rounded-full h-10 w-10 text-white flex items-center justify-center',
                    editStepTwo ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600')}>
                  <User className="w-5 h-5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-12 gap-5">
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Painéis</label>
                  <HoverTooltip
                    content={(
                      <div className="font-mono text-[12px] leading-5 whitespace-pre-wrap break-words w-[26rem] max-w-[26rem]">
                        {((preReservation?.panel_ids_full || [])
                          .length > 0
                          ? preReservation.panel_ids_full
                          : (preReservation?.panel_ids_list
                              ? preReservation.panel_ids_list.split(/,\s*/).filter(Boolean).map(s => Number(s) || s)
                              : [])
                        ).join(', ')}
                      </div>
                    )}
                    side="right"
                    maxWidthClass="max-w-2xl w-[26rem]"
                  >
                    <Input disabled value={(preReservation?.panel_ids_list || preReservation?.panel_ids_full?.join(', ') || '')} className="text-red-600 font-extrabold bg-slate-50 cursor-help h-10" />
                  </HoverTooltip>
                </div>
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Campanha</label>
                  <Input value={campanha} onChange={(e) => setCampanha(e.target.value)} disabled={!editStepTwo} className="h-10" />
                </div>
                <div className="sm:col-span-12 space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Participantes que receberão comissão *</label>
                  <SelectParticipantesComissao
                    value={participantesSelected}
                    options={participantesOptions || []}
                    onChange={setParticipantesSelected}
                    onComissaoChange={handleParticipanteComissaoChange}
                    disabled={!editStepTwo}
                  />
                  <p className="text-[11px] leading-4 text-slate-500 mt-1 pl-0.5">
                    <span className="font-medium text-slate-600">Dica:</span> digite o nome no dropdown para pesquisar. Inclua o <span className="font-semibold text-slate-700">Vendedor</span> como participante para ele também receber comissão.
                  </p>
                </div>
              </div>
              {(participantesComissoes || []).length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <label className="label text-sm font-semibold text-slate-800 block">Regras de comissão por participante</label>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3">
                    {(participantesComissoes || []).map((pc) => {
                      const selId = Number(pc.comissao_id) || 0;
                      const selReg = (comissoesAtivas || []).find(c => Number(c.id) === selId);
                      const isUser = pc.pessoa_tipo === 'user';
                      return (
                        <div key={pc.chave} className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50/60 p-3 flex flex-col gap-2 shadow-sm">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white',
                                isUser ? 'bg-slate-600' : 'bg-sky-600'
                              )}>
                                {getInitials(pc.nome)}
                              </span>
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="truncate text-sm font-semibold text-slate-800">{pc.nome || pc.chave}</span>
                                <span className={cn(
                                  'flex-shrink-0 text-[10px] font-semibold uppercase tracking-tight rounded px-1.5 py-0.5',
                                  isUser ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                                )}>
                                  {pc.badge_label || (isUser ? 'Vendedor' : 'Agente')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="label text-xs font-medium text-slate-600">Regra de comissão padrão *</label>
                            <Select
                              value={String(selId)}
                              onValueChange={(v) => handleParticipanteComissaoChange(pc.chave, { comissao_id: Number(v) || 0 })}
                              disabled={!editStepTwo}
                            >
                              <SelectTrigger className={cn('bg-white h-9 text-xs', selId <= 0 && 'text-rose-600 ring-rose-200')}>
                                <SelectValue placeholder="Selecione a regra..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0" disabled>Selecione</SelectItem>
                                {(comissoesAtivas || []).map(c => (
                                  <SelectItem key={c.id} value={String(c.id)}>
                                    <span className="inline-flex items-center gap-2">
                                      <span className="text-sm text-slate-800">{c.nome}</span>
                                      <span className="text-xs text-slate-500 font-mono">• {c.valor_apresentavel || ''}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {selReg && (
                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 px-0.5">
                                <span><span className="font-medium text-slate-600">Tipo:</span> {selReg.tipo_comissao === 1 ? 'Percentual (%)' : 'Valor Fixo (R$)'}</span>
                                <span className="font-mono font-semibold text-slate-700">{selReg.valor_apresentavel || ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  {/* <h2 className="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção</h2>
                  <p className="text-sm text-gray-500 mt-1">Confira os dados para faturamento do Pedido de Inserção.</p>
                  <p className="text-xs font-bold text-red-500 text-center mt-1">Bi-Semana: {biSemanaLabel}</p> */}
                </div>
                <button type="button" onClick={() => setEditStepThree(v => !v)}
                  className={cn('rounded-full h-10 w-10 text-white flex items-center justify-center',
                    editStepThree ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600')}>
                  <User className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5 sm:w-[48%]">
                  <label className="label text-sm font-medium text-slate-700">Faturar Sobre:</label>
                  <Select value={String(Number(faturar_sobre) || 0)} onValueChange={(v) => setFaturarSobre(parseInt(v) || 0)} disabled={!editStepThree}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>SELECIONE</SelectItem>
                      <SelectItem value="1">VALOR BRUTO</SelectItem>
                      <SelectItem value="2">VALOR LIQUIDO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
                  <div className="space-y-1.5">
                    <label className="label text-sm font-medium text-slate-700">Faturar Contra:</label>
                    <Select value={String(Number(faturar_contra) || 0)} onValueChange={(v) => setFaturarContra(parseInt(v) || 0)} disabled={!editStepThree}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0" disabled>SELECIONE</SelectItem>
                        <SelectItem value="1">CLIENTE</SelectItem>
                        <SelectItem value="2">AGÊNCIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="label text-sm font-medium text-slate-700">Enviar Faturamento:</label>
                    <Select value={String(Number(enviar_faturamento) || 0)} onValueChange={(v) => setEnviarFaturamento(parseInt(v) || 0)} disabled={!editStepThree}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0" disabled>SELECIONE</SelectItem>
                        <SelectItem value="1">CLIENTE</SelectItem>
                        <SelectItem value="2">AGÊNCIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  {/* <h2 className="text-base font-semibold leading-6 text-gray-900">Pedido de Inserção</h2>
                  <p className="text-sm text-gray-500 mt-1">Confira os dados Financeiros do Pedido de Inserção.</p>
                  <p className="text-xs font-bold text-red-500 text-center mt-1">Bi-Semana: {biSemanaLabel}</p> */}
                </div>
                <button type="button" onClick={() => { setEditStepFour(v => !v); handleGetUsuariosServicos(); }}
                  className={cn('rounded-full h-10 w-10 text-white flex items-center justify-center',
                    editStepFour ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600')}>
                  <User className="w-5 h-5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-12 gap-4 sm:gap-5">
                <div className="sm:col-span-7 space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Serviço:</label>
                  <Select value={String(Number(servicoComboId) || 0)} onValueChange={handleGetServico} disabled={!editStepFour}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>Selecione um Serviço</SelectItem>
                      {(servicoList || []).filter(s => !servicosPagos.some(sp => String(sp.nome) === String(s.nome))).map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-5 space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Pago</label>
                  <label className={cn(
                    'inline-flex items-center justify-between w-full h-10 px-3 border border-slate-200 rounded-md bg-white transition-colors',
                    !editStepFour ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  )}>
                    <span className={cn(
                      'text-sm font-semibold transition-colors',
                      String(pgto) === '1' ? 'text-slate-400' : 'text-slate-700'
                    )}>
                      NÃO
                    </span>
                    <span className="relative inline-block mx-2">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={String(pgto) === '1'}
                        onChange={(e) => setPgto(e.target.checked ? '1' : '0')}
                        disabled={!editStepFour}
                      />
                      <div className="w-12 h-6 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-6"></div>
                    </span>
                    <span className={cn(
                      'text-sm font-semibold transition-colors',
                      String(pgto) === '1' ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      SIM
                    </span>
                  </label>
                </div>
              </div>
              {Number(servicoComboId) > 0 && (
                <div className="border border-sky-300 rounded-lg p-4 space-y-4 bg-sky-50/30">
                  <div className="grid sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7 space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Serviço</label>
                      <Input disabled value={servicoSelecionado?.nome || ''} className="bg-slate-100 text-center" />
                    </div>
                    <div className="sm:col-span-3 space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Quantidade</label>
                      <Input type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)} className="text-center" disabled={!editStepFour} />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Bonificado</label>
                      <Input type="number" min={0} max={quantidade} value={bonificado} onChange={(e) => setBonificado(Math.max(0, parseInt(e.target.value) || 0))} className="text-center" disabled={!editStepFour} />
                    </div>
                  </div>
              <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Valor Unit.</label>
                      <Input
                        value={formatMoneyDisplay(vlrUnit)}
                        onChange={(e) => setVlrUnit(e.target.value)}
                        onBlur={(e) => {
                          const v = parseMoney(e.target.value);
                          if (v > 0) setVlrUnit(formatMoney(v.toFixed(2)));
                        }}
                        inputMode="decimal"
                        placeholder="0,00"
                        className="text-center font-mono"
                        disabled={!editStepFour}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Desc. Unit.</label>
                      <Input
                        value={formatMoneyDisplay(vlrDesc)}
                        onChange={(e) => setVlrDesc(e.target.value)}
                        onBlur={(e) => {
                          const v = parseMoney(e.target.value);
                          setVlrDesc(v > 0 ? formatMoney(v.toFixed(2)) : '');
                        }}
                        inputMode="decimal"
                        placeholder="0,00"
                        className="text-center font-mono"
                        disabled={!editStepFour}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Custo. Unit.</label>
                      <Input
                        value={formatMoneyDisplay(vlrCusto)}
                        onChange={(e) => setVlrCusto(e.target.value)}
                        onBlur={(e) => {
                          const v = parseMoney(e.target.value);
                          setVlrCusto(v > 0 ? formatMoney(v.toFixed(2)) : '');
                        }}
                        inputMode="decimal"
                        placeholder="0,00"
                        className="text-center font-mono"
                        disabled={!editStepFour}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Total (s/custo)</label>
                      <Input
                        value={brl(vlrTotalCalc || 0)}
                        disabled
                        className="text-center font-bold font-mono bg-slate-100 text-[#006397]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Total (c/custo)</label>
                      <Input
                        value={brl(vlrTotalFinCalc || 0)}
                        disabled
                        className="text-center font-bold font-mono bg-slate-100 text-slate-700"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="default" size="sm" onClick={handleAddServico} className="bg-[#006397] hover:bg-[#004b73] text-white cursor-pointer" disabled={!editStepFour}>OK / Adicionar</Button>
                    </div>
                  </div>
                </div>
              )}
              {servicosPagos.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="label text-sm font-medium text-slate-700 m-0">Serviços Adicionados ({servicosPagos.length})</label>
                    {(participantesComissoes || []).length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Info className="w-3.5 h-3.5" /> Expanda o serviço para ajustar comissões por participante
                      </span>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {servicosPagos.map((sp, idx) => {
                      const ovKeys = sp.comissoesOverride && typeof sp.comissoesOverride === 'object' ? Object.keys(sp.comissoesOverride) : [];
                      const temOverride = ovKeys.length > 0;
                      return (
                        <Accordion key={idx} type="multiple">
                          <AccordionItem value={`svc-${idx}`} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                            <AccordionTrigger className="px-3.5 py-2.5 hover:bg-slate-50/80 transition-colors">
                              <div className="flex items-center justify-between w-full gap-3 text-left">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <span className="w-8 h-8 rounded-md bg-[#006397]/10 text-[#006397] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                                    #{idx + 1}
                                  </span>
                                  <div className="flex flex-col min-w-0 flex-1">
                                    <span className="truncate text-sm font-semibold text-slate-800">{sp.nome}</span>
                                    <div className="flex items-center gap-2.5 text-[11px] text-slate-500 flex-wrap">
                                      <span>Qtd: <span className="font-medium text-slate-700">{sp.quantidade}</span></span>
                                      {Number(sp.bonificado) > 0 && <span>Bon: <span className="font-medium text-amber-700">{sp.bonificado}</span></span>}
                                      <span>Unit.: <span className="font-mono font-medium text-slate-700">{brl(sp.vlr_unit)}</span></span>
                                      {parseNumber(sp.vlr_desc) > 0 && <span>Desc: <span className="font-mono font-medium text-rose-600">-{brl(sp.vlr_desc)}</span></span>}
                                      {parseNumber(sp.vlr_custo) > 0 && <span>Custo: <span className="font-mono font-medium text-orange-600">-{brl(sp.vlr_custo)}</span></span>}
                                      {(participantesComissoes || []).length > 0 && temOverride && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-amber-300 bg-amber-50 text-amber-700 font-semibold uppercase tracking-wide">
                                          {ovKeys.length} overrides
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <div className="text-right mr-1.5">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide leading-none">Total</div>
                                    <div className="font-black font-mono text-[#006397] text-sm leading-tight">{brl(sp.vlr_total)}</div>
                                  </div>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveServicoPago(idx); }} className="h-8 w-8 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3.5 pb-3.5 pt-1 bg-slate-50/40 border-t border-slate-100">
                              {(participantesComissoes || []).length === 0 ? (
                                <div className="text-[11px] text-slate-500 italic text-center py-2.5">
                                  Volte ao Step 2 e selecione participantes com regras de comissão para configurar overrides por serviço.
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Comissões por participante para este serviço</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {editStepFour && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleServicoZerarTodasComissoes(idx)}
                                            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                                          >
                                            Zerar Todas
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleServicoRestaurarTodasComissoes(idx)}
                                            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                                          >
                                            Restaurar Padrão
                                          </button>
                                        </>
                                      )}
                                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Base cálculo = Líq. (Bruto - Desc - Custo)
                                      </span>
                                    </div>
                                  </div>
                                  <div className="rounded-md border border-slate-200 overflow-hidden bg-white shadow-sm">
                                    <div className="grid grid-cols-12 gap-2 px-2.5 py-1.5 bg-slate-100 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                      <div className="col-span-12 sm:col-span-4">Participante</div>
                                      <div className="col-span-12 sm:col-span-5">Regra de Comissão</div>
                                      <div className="col-span-8 sm:col-span-2 text-right">Valor Calculado</div>
                                      <div className="col-span-4 sm:col-span-1 text-right pr-1">Ação</div>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                      {(participantesComissoes || []).map((pc, pIdx) => {
                                        const chave = pc.chave;
                                        const isUser = pc.pessoa_tipo === 'user';
                                        const padraoCid = Number(pc.comissao_id) || 0;
                                        const override = sp.comissoesOverride && typeof sp.comissoesOverride === 'object' ? sp.comissoesOverride[chave] : null;
                                        const overrideCidRaw = override ? Number(override.comissao_id) : null;
                                        const atualCid = overrideCidRaw !== null && !isNaN(overrideCidRaw) ? overrideCidRaw : padraoCid;
                                        const isZerado = override && (atualCid === -1 || override.zerado === true);
                                        const regTipo = isZerado ? 0 : (override ? Number(override.comissao_tipo) || 0 : Number(pc.comissao_tipo) || 0);
                                        const regVal = isZerado ? 0 : (override ? Number(override.comissao_valor_numerico) || 0 : Number(pc.comissao_valor_numerico) || 0);
                                        const isPadrao = !override;
                                        const vlrCalc = isZerado ? 0 : calcularValorComissao({
                                          regraTipo: regTipo,
                                          regraValor: regVal,
                                          vlrServicoUnit: sp.vlr_unit,
                                          vlrServicoDescUnit: sp.vlr_desc,
                                          vlrServicoCustoUnit: sp.vlr_custo,
                                          qtdCobrada: sp.qtd_cobrada,
                                        });
                                        return (
                                          <div key={chave} className="grid grid-cols-12 gap-2 px-2.5 py-2 items-center text-xs">
                                            <div className="col-span-12 sm:col-span-4 flex items-center gap-2 min-w-0">
                                              <span className={cn(
                                                'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white',
                                                isUser ? 'bg-slate-600' : 'bg-sky-600'
                                              )}>
                                                {getInitials(pc.nome)}
                                              </span>
                                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                <span className="truncate text-slate-800 font-medium">{pc.nome}</span>
                                                <span className={cn(
                                                  'flex-shrink-0 text-[9px] font-semibold uppercase tracking-tight rounded px-1 py-0.5',
                                                  isUser ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                                                )}>
                                                  {pc.badge_label || (isUser ? 'Vend' : 'Agt')}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="col-span-12 sm:col-span-5 flex items-center gap-1.5">
                                              <Select
                                                value={String(atualCid)}
                                                onValueChange={(v) => handleServicoOverrideComissaoChange(idx, chave, Number(v))}
                                                disabled={!editStepFour}
                                              >
                                                <SelectTrigger className="bg-white h-8 text-[11px]">
                                                  <SelectValue placeholder="(herdado Step 2)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="0">— Usar Padrão (Step 2) —</SelectItem>
                                                  <SelectItem value="-1">— Zerar Comissão (R$ 0,00) —</SelectItem>
                                                  {(comissoesAtivas || []).map(c => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                      <span className="inline-flex items-center gap-2">
                                                        <span>{c.nome}</span>
                                                        <span className="text-slate-500 font-mono text-[10px]">{c.valor_apresentavel || ''}</span>
                                                      </span>
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                              {isPadrao ? (
                                                <Badge variant="outline" className="hidden sm:inline-flex text-[9px] px-1.5 py-0 h-5 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-tight whitespace-nowrap">
                                                  Padrão Step 2
                                                </Badge>
                                              ) : isZerado ? (
                                                <Badge variant="outline" className="hidden sm:inline-flex text-[9px] px-1.5 py-0 h-5 border-rose-300 bg-rose-50 text-rose-700 font-bold uppercase tracking-tight whitespace-nowrap">
                                                  Zerada
                                                </Badge>
                                              ) : (
                                                <Badge variant="outline" className="hidden sm:inline-flex text-[9px] px-1.5 py-0 h-5 border-amber-300 bg-amber-50 text-amber-700 font-bold uppercase tracking-tight whitespace-nowrap">
                                                  Override
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="col-span-8 sm:col-span-2 text-right">
                                              <div className={cn(
                                                'font-mono font-bold text-sm',
                                                isZerado ? 'text-slate-400 line-through' : 'text-[#006397]'
                                              )}>{brl(vlrCalc)}</div>
                                              <div className="text-[9px] text-slate-500 uppercase tracking-wide">
                                                {isZerado ? 'Sem comissão' : (regTipo === 1 ? `${(regVal).toFixed(2).replace('.',',')}% × Líq.` : 'Valor fixo')}
                                              </div>
                                            </div>
                                            <div className="col-span-4 sm:col-span-1 flex items-center justify-end pr-1">
                                              {!isPadrao && (
                                                <button type="button" onClick={() => handleServicoOverrideComissaoChange(idx, chave, 0)} title="Restaurar padrão" className="text-slate-400 hover:text-emerald-600 cursor-pointer p-1">
                                                  <RefreshCw className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 px-2.5 py-2 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200">
                                      <div className="col-span-12 sm:col-span-9 text-right flex items-center justify-end gap-2">
                                        <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                                          Soma comissões este serviço
                                        </span>
                                      </div>
                                      <div className="col-span-12 sm:col-span-3 text-right">
                                        <span className="font-mono font-bold text-sm text-rose-600">
                                          - {brl((participantesComissoes || []).reduce((sum, pc) => {
                                            const chave = pc.chave;
                                            const override = sp.comissoesOverride && typeof sp.comissoesOverride === 'object' ? sp.comissoesOverride[chave] : null;
                                            const ovCid = override ? Number(override.comissao_id) : null;
                                            const isZ = override && (ovCid === -1 || override.zerado === true);
                                            if (isZ) return sum;
                                            const regTipo = override ? Number(override.comissao_tipo) || 0 : Number(pc.comissao_tipo) || 0;
                                            const regVal = override ? Number(override.comissao_valor_numerico) || 0 : Number(pc.comissao_valor_numerico) || 0;
                                            return sum + calcularValorComissao({
                                              regraTipo: regTipo, regraValor: regVal,
                                              vlrServicoUnit: sp.vlr_unit,
                                              vlrServicoDescUnit: sp.vlr_desc,
                                              vlrServicoCustoUnit: sp.vlr_custo,
                                              qtdCobrada: sp.qtd_cobrada,
                                            });
                                          }, 0))}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    })}
                    <div className="rounded-md bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 border border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase font-bold tracking-wide text-slate-600">Total Serviços (Líquido)</div>
                      </div>
                      <div className="font-black font-mono text-[#006397] text-base">{brl(totalServicosN || 0)}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="label text-sm font-medium text-slate-700">Forma de Pagamento</label>
                  <Select value={String(Number(formaPgto) || 0)} onValueChange={(v) => { setFormaPgto(parseInt(v) || 0); if (Number(v) < 3) setParcelado(0); }} disabled={!editStepFour}>
                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>SELECIONE</SelectItem>
                      <SelectItem value="1">DINHEIRO</SelectItem>
                      <SelectItem value="2">PIX</SelectItem>
                      <SelectItem value="3">CARTÃO</SelectItem>
                      <SelectItem value="4">BOLETO</SelectItem>
                      <SelectItem value="5">TRANSFERÊNCIA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="label text-sm font-medium text-slate-700">Parcelado</label>
                    <Select value={String(Number(parcelado) || 0)} onValueChange={(v) => setParcelado(parseInt(v) || 0)} disabled={!editStepFour || Number(formaPgto) < 3}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0" disabled>SELECIONE</SelectItem>
                        <SelectItem value="1">SIM</SelectItem>
                        <SelectItem value="2">NÃO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {Number(formaPgto) >= 3 && Number(parcelado) === 1 && (
                    <div className="space-y-1.5">
                      <label className="label text-sm font-medium text-slate-700">Parcelas</label>
                      <Select value={String(Number(qtdParcelas) || 1)} onValueChange={(v) => setQtdParcelas(parseInt(v) || 1)} disabled={!editStepFour}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[2,3,4,5,6,7,8,9,10,11,12].map(n => <SelectItem key={n} value={String(n)}>{n}x</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                {Number(parcelado) !== 1 && (
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="label text-sm font-medium text-slate-700">Data de Pagamento</label>
                    <Input type="date" value={dtPgto} onChange={(e) => setDtPgto(e.target.value)} disabled={!editStepFour || String(pgto) !== '1'} className="font-mono" />
                  </div>
                )}
              </div>

              {Number(parcelado) === 1 && Number(formaPgto) >= 3 && (
                <div className="mt-2 border border-indigo-200 rounded-xl p-4 bg-indigo-50/40 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-indigo-900">Parcelas</div>
                      <div className="text-xs text-indigo-700">Total serviços: {brl(totalServicosN || 0)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-indigo-700">
                        Soma: {brl((parcelas||[]).reduce((s,p)=>s+parseNumber(p.valor||0),0)||0)}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => gerarParcelasIniciais()} disabled={!editStepFour} className="cursor-pointer text-xs">Recalcular</Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-indigo-200 bg-white">
                    <table className="min-w-full text-xs">
                      <thead className="bg-indigo-100 text-indigo-900">
                        <tr>
                          <th className="px-3 py-2 text-left w-20">#</th>
                          <th className="px-3 py-2 text-left">Valor</th>
                          <th className="px-3 py-2 text-left">Vencimento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-indigo-100">
                        {(parcelas || []).map((parc, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 font-semibold text-indigo-900">{i+1}/{parcelas.length}</td>
                            <td className="px-3 py-2">
                              <Input
                                value={formatMoneyDisplay(parc.valor)}
                                onChange={(e) => {
                                  const novas = [...parcelas];
                                  novas[i] = { ...novas[i], valor: e.target.value };
                                  setParcelas(novas);
                                }}
                                onBlur={(e) => {
                                  const v = parseMoney(e.target.value);
                                  const novas = [...parcelas];
                                  novas[i] = { ...novas[i], valor: formatMoney(v.toFixed(2)) };
                                  setParcelas(novas);
                                  if (i === 0) {
                                    setTimeout(() => {
                                      const alvo = totalServicosN || 0;
                                      if (alvo <= 0) return;
                                      let entrada = parseMoney(novas[0]?.valor || 0);
                                      if (entrada < 0) entrada = 0;
                                      if (entrada > alvo) entrada = alvo;
                                      const restantes = novas.length - 1;
                                      if (restantes <= 0) return;
                                      const restanteTotal = parseFloat((alvo - entrada).toFixed(2));
                                      const base = Math.floor((restanteTotal / restantes) * 100) / 100;
                                      const resto = parseFloat((restanteTotal - base * (restantes - 1)).toFixed(2));
                                      for (let k = 1; k < novas.length - 1; k++) {
                                        novas[k] = { ...novas[k], valor: formatMoney(base.toFixed(2)) };
                                      }
                                      if (novas.length > 1) {
                                        novas[novas.length - 1] = { ...novas[novas.length - 1], valor: formatMoney(resto.toFixed(2)) };
                                      }
                                      setParcelas(novas);
                                      ajustarUltimaParcela();
                                    }, 0);
                                  } else {
                                    setTimeout(() => ajustarUltimaParcela(), 0);
                                  }
                                }}
                                inputMode="decimal"
                                className="w-40 text-center font-mono text-xs"
                                disabled={!editStepFour}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Input type="date" value={parc.data} onChange={(e) => {
                                const novas = [...parcelas];
                                novas[i] = { ...novas[i], data: e.target.value };
                                setParcelas(novas);
                              }} className="w-44 font-mono text-xs" disabled={!editStepFour} />
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

          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Observações da Reserva</h2>
                <p className="text-sm text-slate-500 mt-1">Inclua informações complementares que devem constar na reserva.</p>
              </div>
              <div className="space-y-1.5">
                <label className="label text-sm font-medium text-slate-700">Observações</label>
                <Textarea rows={6} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Digite aqui informações adicionais..." />
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Resumo do Pedido de Inserção</div>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div>Cliente: <strong>{clienteNome}</strong></div>
                    <div>Campanha: <strong>{campanha || '—'}</strong></div>
                    <div>Painéis: <strong>{preReservation?.panel_ids_list || totalPaineis + ' painéis'}</strong></div>
                    <div>Vendedor: <strong>{(userList.find(u => Number(u.id) === Number(vendedorId))?.name) || '—'}</strong></div>
                    <div>Serviços: <strong>{servicosPagos.length}</strong></div>
                    <div>Total: <strong>{brl(totalServicosN || 0)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 z-20 bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" size="sm" disabled={isSubmitting}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer disabled:opacity-60">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="cursor-pointer disabled:opacity-60">Cancelar</Button>
            {currentStep < 5 ? (
              <Button type="button" onClick={() => {
                if (currentStep === 1) handleNextStepOne();
                else if (currentStep === 2) handleNextStepTwo();
                else if (currentStep === 3) handleNextStepThree();
                else if (currentStep === 4) handleNextStepFour();
              }} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer font-medium disabled:opacity-60">
                Avançar <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleEmitConfirm} disabled={isSuccess || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold px-6 shadow-md cursor-pointer disabled:opacity-60">
                {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Gerando Prévia...</>) :
                 isSuccess ? (<><Check className="w-4 h-4 stroke-[3]" /> PI Emitido!</>) :
                 (<><CheckCircle2 className="w-4 h-4" /> Sim, Confirmar e Emitir PI!</>)}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {showPreviewConfirm && (
      <div className="fixed inset-0 z-[9999] pointer-events-auto cursor-default bg-black/50 flex items-center justify-center p-4">
        <div className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="pt-8 pb-6 px-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-full border-[6px] border-sky-500/60 text-sky-500 flex items-center justify-center mb-4">
              <Info className="w-10 h-10" strokeWidth={2.2} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-3">Pré-visualização gerada</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Confira o PDF aberto em uma nova aba. Deseja confirmar e gravar a PI e os lançamentos?
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 px-8 pb-8 sm:justify-between">
            <button type="button" onClick={() => setShowPreviewConfirm(false)} disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white h-12 text-base font-bold px-10 rounded-md shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              Cancelar
            </button>
            <button type="button" onClick={handleGravarDefinitivo} disabled={isSubmitting || isSuccess}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-bold px-10 rounded-md shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? (<span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Gravando...</span>) :
               isSuccess ? (<span className="inline-flex items-center gap-2"><Check className="w-4 h-4 stroke-[3]" /> Gravado!</span>) : 'Sim, confirmar!'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );

  async function handleGetUsuarios() {
    try {
      const extractArr = (prom) => prom
        .then(r => {
          const d = r?.data;
          if (Array.isArray(d)) return d;
          if (d && Array.isArray(d.data)) return d.data;
          return [];
        })
        .catch(err => {
          console.warn('handleGetUsuarios falhou:', err?.config?.url, err?.response?.status, err?.message);
          return [];
        });
      const [us, ag, cm] = await Promise.all([
        extractArr(axios.get('/getUsuarios')),
        extractArr(axios.get('/listarParticipantesComissao')),
        extractArr(axios.get('/listarComissoesAtivas')),
      ]);
      if (Array.isArray(us)) setUserList(us);
      if (Array.isArray(ag)) setParticipantesOptions(ag);
      if (Array.isArray(cm)) setComissoesAtivas(cm);
      if (ag.length === 0) {
        toastr.warning('Nenhum participante (vendedor/agente) retornou no carregamento inicial. Verifique os cadastros.');
      }
    } catch (err) {
      console.error('handleGetUsuarios erro geral:', err);
      toastr.error('Erro ao carregar participantes e comissões. Tente novamente.');
    }
  }
  async function handleGetUsuariosServicos() {
    try {
      const extractArr = (prom) => prom
        .then(r => {
          const d = r?.data;
          if (Array.isArray(d)) return d;
          if (d && Array.isArray(d.data)) return d.data;
          return [];
        })
        .catch(err => {
          console.warn('handleGetUsuariosServicos falhou:', err?.config?.url, err?.response?.status, err?.message);
          return [];
        });
      const [us, svcs, partOpt, comsAt] = await Promise.all([
        extractArr(axios.get('/getUsuarios')),
        extractArr(axios.get('/ListaServicos')),
        extractArr(axios.get('/listarParticipantesComissao')),
        extractArr(axios.get('/listarComissoesAtivas')),
      ]);
      if (Array.isArray(us)) setUserList(us);
      if (Array.isArray(svcs)) setServicoList(svcs);
      if (Array.isArray(partOpt)) setParticipantesOptions(partOpt);
      if (Array.isArray(comsAt)) setComissoesAtivas(comsAt);
    } catch (err) {
      console.error('handleGetUsuariosServicos erro geral:', err);
      toastr.error('Erro ao carregar dados para serviços. Tente novamente.');
    }
  }
}

function SelectMultiAgentes({ value = [], options = [], onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const wrapRef = React.useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  const toggle = (id) => {
    if (disabled) return;
    const n = Number(id);
    if (value.includes(n)) onChange(value.filter(v => v !== n));
    else onChange([...value, n]);
  };
  const display = (() => {
    if (value.length === 0) return 'Selecione os agentes';
    return value.map(v => {
      const a = options.find(x => Number(x.id) === Number(v));
      const nome = a ? (a.nome_fantasia || a.razao_social || a.nome || '') : ('Agente #' + v);
      return nome;
    }).filter(Boolean).slice(0, 2).join(', ') + (value.length > 2 ? ` (+${value.length - 2})` : '');
  })();
  return (
    <div className="relative w-full" ref={wrapRef}>
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006397]/50 focus:border-[#006397] disabled:cursor-not-allowed disabled:opacity-50">
        <span className={cn('truncate text-left', value.length === 0 && 'text-slate-400')}>{display}</span>
        <ChevronRight className={cn('w-4 h-4 transition-transform text-slate-400 flex-shrink-0', open && 'rotate-90')} />
      </button>
      {open && (
        <div
          className="absolute z-[60] mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
          <div className="max-h-56 overflow-y-auto overflow-x-hidden p-1 text-sm">
            {options.length === 0 && (<div className="p-2 text-xs text-slate-400">Nenhum agente disponível</div>)}
            {options.map((a) => {
              const n = Number(a.id);
              const checked = value.includes(n);
              const nome = a.nome_fantasia || a.razao_social || a.nome || ('Agente #' + n);
              return (
                <div key={a.id} onClick={() => toggle(n)}
                  className={cn('flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-slate-100', checked && 'bg-blue-50')}>
                  <span className={cn('w-4 h-4 flex items-center justify-center border rounded flex-shrink-0',
                    checked ? 'bg-[#006397] border-[#006397] text-white' : 'border-slate-300 text-transparent')}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="truncate text-slate-800">{nome}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectParticipantesComissao({ value = [], options = [], onChange, disabled, onComissaoChange, comissoesMap = {}, participantesComissoes = [] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const filteredOptions = useMemo(() => {
    const s = tirarAcentos(String(search || '')).trim().toLowerCase();
    if (!s) return options || [];
    return (options || []).filter(o => {
      const nome = tirarAcentos(String(o.nome || '')).toLowerCase();
      const badge = tirarAcentos(String(o.badge_label || '')).toLowerCase();
      return nome.includes(s) || badge.includes(s);
    });
  }, [options, search]);

  useEffect(() => {
    if (!open) { setSearch(''); setActiveIdx(-1); return; }
    const handler = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => { if (activeIdx >= filteredOptions.length) setActiveIdx(Math.max(0, filteredOptions.length - 1)); }, [filteredOptions.length, activeIdx]);

  const toggle = (opt) => {
    if (disabled) return;
    const chave = `${opt.pessoa_tipo}:${opt.pessoa_id}`;
    let novoSelected;
    if (value.includes(chave)) {
      novoSelected = value.filter(v => v !== chave);
      onComissaoChange && onComissaoChange(chave, { remove: true });
    } else {
      novoSelected = [...value, chave];
      onComissaoChange && onComissaoChange(chave, { add: true, opt });
    }
    onChange(novoSelected);
  };

  const display = (() => {
    if (value.length === 0) return 'Selecione os participantes';
    let cntUser = 0, cntAg = 0;
    value.forEach(k => { if (String(k).startsWith('user:')) cntUser++; else cntAg++; });
    const primeiro = (options || []).find(o => `${o.pessoa_tipo}:${o.pessoa_id}` === value[0]);
    const primeiroNome = primeiro ? primeiro.nome : '';
    const resumo = `${value.length} participante${value.length === 1 ? '' : 's'} (${cntUser} Vendedor${cntUser === 1 ? '' : 'es'} / ${cntAg} Agente${cntAg === 1 ? '' : 's'})`;
    return primeiroNome ? `${primeiroNome} · ${resumo}` : resumo;
  })();

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => Math.min(filteredOptions.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredOptions[activeIdx >= 0 ? activeIdx : 0];
      if (target) toggle(target);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={wrapRef}>
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006397]/50 focus:border-[#006397] disabled:cursor-not-allowed disabled:opacity-50">
        <span className={cn('truncate text-left', value.length === 0 && 'text-slate-400')}>{display}</span>
        <ChevronRight className={cn('w-4 h-4 transition-transform text-slate-400 flex-shrink-0', open && 'rotate-90')} />
      </button>
      {open && (
        <div className="absolute z-[70] mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
          <div className="p-1.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-1.5 px-1 py-1 rounded-md border border-slate-200 bg-white focus-within:ring-1 focus-within:ring-[#006397]/40 focus-within:border-[#006397]">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveIdx(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Digite o nome do participante..."
                className="flex-1 bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-400"
                disabled={disabled}
              />
              {search && (
                <button type="button" onClick={(e) => { e.stopPropagation(); setSearch(''); }} className="text-slate-400 hover:text-slate-600 flex-shrink-0 p-0.5">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto overflow-x-hidden p-1 text-sm">
            {filteredOptions.length === 0 && (
              (options?.length ?? 0) === 0
                ? (search.trim() === ''
                    ? (<div className="p-3 text-xs text-slate-500 text-center leading-relaxed"><Loader2 className="w-4 h-4 animate-spin inline-block mr-1.5 align-[-2px] text-[#006397]"/>Carregando lista de vendedores e agentes... Se demorar, clique no botão lápis acima para atualizar.</div>)
                    : (<div className="p-2 text-xs text-amber-600 text-center italic">Nenhum participante cadastrado ainda — verifique cadastros de Usuário (ativo) e Cliente (agente).</div>))
                : (<div className="p-2 text-xs text-slate-400 text-center italic">Nenhum participante encontrado para: <span className="font-semibold text-slate-600 not-italic">"{String(search).trim()}"</span>. Tente outra digitação (acentos são ignorados).</div>)
            )}
            {filteredOptions.map((a, i) => {
              const chave = `${a.pessoa_tipo}:${a.pessoa_id}`;
              const checked = value.includes(chave);
              const isActive = i === activeIdx;
              return (
                <div key={chave} onClick={() => toggle(a)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-slate-100 rounded-md',
                    checked && 'bg-blue-50',
                    isActive && !checked && 'bg-slate-100/70 ring-1 ring-slate-200'
                  )}>
                  <span className={cn('w-4 h-4 flex items-center justify-center border rounded flex-shrink-0',
                    checked ? 'bg-[#006397] border-[#006397] text-white' : 'border-slate-300 text-transparent')}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="flex-1 min-w-0 truncate text-slate-800">{a.nome}</span>
                  <span className={cn(
                    'flex-shrink-0 text-[10px] font-semibold uppercase tracking-tight rounded px-1.5 py-0.5',
                    a.pessoa_tipo === 'user' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                  )}>
                    {a.badge_label || (a.pessoa_tipo === 'user' ? 'Vendedor' : 'Agente')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReservasSemPIIndex() {
  const { props } = usePage();
  const initialAnos = props.anos || [];
  const initialBisemanas = props.bisemanas || [];
  const initialBsAtual = props.bs_atual || null;
  const initialVendedores = props.vendedores || [];
  const initialPreReservations = props.pre_reservations || [];
  const initialAnoId = props.ano_id || 0;
  const initialSearch = props.search || '';
  const initialVendedorId = props.vendedor_id || 0;
  const kpis = props.kpis || { total_sem_pi: 0, total_faces: 0 };

  const anoMap = useMemo(() => {
    const m = new Map();
    initialAnos.forEach((a) => m.set(Number(a.id), Number(a.ano)));
    initialBisemanas.forEach((b) => { if (b.year) m.set(Number(b.ano_id), Number(b.year)); });
    return m;
  }, [initialAnos, initialBisemanas]);

  const reverseAnoMap = useMemo(() => {
    const m = new Map();
    initialAnos.forEach((a) => m.set(Number(a.ano), Number(a.id)));
    return m;
  }, [initialAnos]);

  const defaultYearVal = initialAnoId ? (anoMap.get(Number(initialAnoId)) || new Date().getFullYear()) : (initialBsAtual?.year || new Date().getFullYear());

  const [selectedYear, setSelectedYear] = useState(defaultYearVal);
  const currentBiSemanaId = initialBsAtual?.id ? String(initialBsAtual.id) : '';
  const [currentBiSemanaValue, setCurrentBiSemanaValue] = useState(currentBiSemanaId);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSellerFilter, setSelectedSellerFilter] = useState(initialVendedorId ? String(initialVendedorId) : 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingSearchRef = React.useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [activePre, setActivePre] = useState(null);

  const itemsPerPage = 6;

  const currentBiSemana = useMemo(() => {
    if (currentBiSemanaValue) {
      const f = initialBisemanas.find((b) => String(b.id) === String(currentBiSemanaValue));
      if (f) return f;
    }
    return initialBsAtual || initialBisemanas[0] || { id: 0, label: '—', num_bisemana: 0, year: new Date().getFullYear() };
  }, [currentBiSemanaValue, initialBisemanas, initialBsAtual]);

  const yearBiSemanas = useMemo(() => {
    return initialBisemanas.filter((b) => Number(b.year) === Number(selectedYear));
  }, [initialBisemanas, selectedYear]);

  const fireRouterGet = (params, extraOpts = {}) => {
    const base = { preserveState: true, preserveScroll: true };
    const opts = { ...base, ...extraOpts };
    if (typeof opts.onSuccess !== 'function' && typeof opts.onError !== 'function') {
      setIsRefreshing(true);
      opts.onSuccess = () => setIsRefreshing(false);
      opts.onError = () => setIsRefreshing(false);
    }
    router.get(route('react.reservassempi'), params, opts);
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
    const yr = parseInt(v);
    if (!yr || Number(yr) === Number(selectedYear)) return;
    setSelectedYear(Number(yr));
    setCurrentPage(1);
    const list = initialBisemanas.filter((b) => Number(b.year) === Number(yr));
    const primeiroBsId = list[0]?.id || 0;
    setCurrentBiSemanaValue(String(primeiroBsId));
    const params = buildParams({ selectedYear: Number(yr), bsId: primeiroBsId });
    fireRouterGet(params);
  };

  const handleBiSemanaChange = (val) => {
    if (val != null && String(val) === String(currentBiSemanaValue)) return;
    setCurrentBiSemanaValue(String(val));
    setCurrentPage(1);
    const params = buildParams({ bsId: val });
    fireRouterGet(params);
  };

  const handleSearchChange = (e) => {
    const val = e && typeof e === 'object' && e.target ? String(e.target.value || '') : String(e || '');
    setSearchTerm(val);
    setCurrentPage(1);
    if (pendingSearchRef.current) {
      clearTimeout(pendingSearchRef.current);
      pendingSearchRef.current = null;
    }
    pendingSearchRef.current = setTimeout(() => {
      pendingSearchRef.current = null;
      const params = buildParams({ q: val });
      fireRouterGet(params);
    }, 280);
  };

  const clearSearchDebounce = () => {
    if (pendingSearchRef.current) {
      clearTimeout(pendingSearchRef.current);
      pendingSearchRef.current = null;
    }
  };

  useEffect(() => () => clearSearchDebounce(), []);

  const filteredList = initialPreReservations;

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [totalPages, filteredList.length]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  const totalFacesOccupied = useMemo(() => filteredList.reduce((a, c) => a + Number(c.panels_count || 0), 0), [filteredList]);

  const handleRefresh = () => {
    const params = buildParams();
    fireRouterGet(params);
  };

  const handleClearFilters = () => {
    clearSearchDebounce();
    setSearchTerm('');
    setSelectedSellerFilter('all');
    setCurrentPage(1);
    const params = buildParams({ q: '', vendedorId: 0 });
    fireRouterGet(params);
  };

  const brl = (n) => `R$ ${Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const onOpenNovaPI = (pr) => {
    setActivePre(pr);
    setModalOpen(true);
  };
  const onCloseModal = () => { setModalOpen(false); };

  const uniqueYearsSorted = useMemo(() => {
    const s = new Set();
    initialAnos.forEach((a) => s.add(Number(a.ano)));
    initialBisemanas.forEach((b) => s.add(Number(b.year)));
    const arr = Array.from(s).filter(Boolean);
    arr.sort((a, b) => b - a);
    if (arr.length === 0) arr.push(new Date().getFullYear());
    return arr;
  }, [initialAnos, initialBisemanas]);

  return (
    <AppLayout>
      <Head title="Reservas sem PI - SGEP" />
      <div className="flex flex-col w-full animate-fade-in pb-20">
        <div className="px-4 md:px-8 py-2.5 bg-slate-100/70 border-b border-slate-200 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <span className="hover:text-slate-800 cursor-pointer">Painéis</span>
          <span>&gt;</span>
          <span className="hover:text-slate-800 cursor-pointer">Gerar PI</span>
          <span>&gt;</span>
          <span className="text-slate-900 font-semibold">Reservas sem PI</span>
        </div>

        <div className="px-4 md:px-8 py-5 bg-white border-b border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-14 z-30 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-2.5 h-10 bg-[#006397] rounded-full flex-shrink-0" />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Reservas sem PI</h1>
                {/* <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {filteredList.length} Pendentes
                </div> */}
                <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#006397] text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  Bi-Semana {currentBiSemana?.num_bisemana || 0} • {currentBiSemana?.year || selectedYear}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Pré-reservas ativas aguardando formalização do Pedido de Inserção oficial.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100/70 text-amber-800"><Clock className="w-4 h-4" /></div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total sem PI</span>
                <span className="text-sm font-bold text-slate-800">{filteredList.length} reservas</span>
              </div>
            </div>
            <div className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100/70 text-[#006397]"><Layers className="w-4 h-4" /></div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Faces Ocupadas</span>
                <span className="text-sm font-bold text-slate-800">{totalFacesOccupied} painéis</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full">
          <Card className="border border-slate-200/90 shadow-2xs bg-white rounded-xl">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ano</label>
                    <Select value={String(selectedYear)} onValueChange={handleYearChange}>
                      <SelectTrigger className="bg-slate-50/70 border-slate-200 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {uniqueYearsSorted.map((y) => (<SelectItem key={y} value={String(y)}>{y}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 sm:col-span-2 md:col-span-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bi-Semana</label>
                    <Select value={String(currentBiSemanaValue)} onValueChange={handleBiSemanaChange}>
                      <SelectTrigger className="bg-slate-50/70 border-slate-200 text-xs font-medium truncate"><SelectValue placeholder="Selecione a Bi-Semana" /></SelectTrigger>
                      <SelectContent>
                        {yearBiSemanas.map((bs) => (<SelectItem key={bs.id} value={String(bs.id)} className="text-xs">{bs.label}</SelectItem>))}
                        {yearBiSemanas.length === 0 && (<SelectItem value="" disabled>Nenhuma bi-semana para este ano</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 sm:col-span-2 md:col-span-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Buscar Cliente / Campanha</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input value={searchTerm} onChange={handleSearchChange} placeholder="Ex: Barbara, Mosca, Auto Escola..." className="pl-8 text-xs bg-slate-50/70 border-slate-200" />
                      {searchTerm && (
                        <button onClick={() => handleSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                  <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer">
                    <X className="w-3.5 h-3.5" /> Limpar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefresh} className="text-xs gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer">
                    <RefreshCw className={cn('w-3.5 h-3.5 text-[#006397]', isRefreshing && 'animate-spin')} /> Atualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-950">
                  Atenção: Existem {filteredList.length} pré-reservas ativas nesta Bi-Semana aguardando emissão do Pedido de Inserção oficial para garantir a veiculação e cronograma de colagem.
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Reservas sem PI não geram ordem de colagem para as equipes de campo e podem ter suas faces liberadas após expiração do prazo.
                </p>
              </div>
            </div>
            <Badge className="bg-amber-200/70 text-amber-900 border-amber-300 font-semibold text-[11px] whitespace-nowrap">Prioridade Alta</Badge>
          </div>

          <div className="space-y-3.5">
            {paginatedItems.map((item, idx) => {
              const isHotItem = idx === 0;
              const unit = Number(item.unit_price || 0) - Number(item.unit_discount || 0);
              const estimado = unit * Number(item.panels_count || 0);
              return (
                <Card key={item.grupo_key || `${item.cliente_id}-${item.bisemana_id}-${idx}`} className={cn('border transition-all duration-200 hover:shadow-md rounded-xl overflow-hidden', isHotItem ? 'border-[#006397]/40 bg-white ring-1 ring-[#006397]/20 shadow-2xs' : 'border-slate-200/90 bg-white hover:border-slate-300')}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-2xs', isHotItem ? 'bg-[#006397] text-white' : 'bg-slate-100 text-slate-700 border border-slate-200')}>
                          {getInitials(item.client_name)}
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base tracking-tight truncate">{item.client_name}</h3>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{item.cpf_cnpj}</span>
                            <span className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">{item.expiration_text}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            <div>
                              <span className="text-slate-400 font-medium mr-1">Campanha:</span>
                              <span className="font-semibold text-slate-800">{item.campaign_title}</span>
                              <span className="text-slate-400 ml-1">({item.campaign_segment})</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium mr-1">Data Pré-reserva:</span>
                              <span className="font-mono text-slate-700">{item.date_pre_reserva}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium mr-1">Vendedor:</span>
                              <span className="text-slate-700">{item.seller_name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            <HoverTooltip
                              content={(
                                <div className="font-mono text-[12px] leading-5 whitespace-pre-wrap break-words w-[26rem] max-w-[26rem]">
                                  {((item.panel_ids_full || []).length > 0
                                    ? item.panel_ids_full
                                    : (item.panel_ids_list ? item.panel_ids_list.split(/,\s*/).filter(Boolean).map(s => Number(s) || s) : [])
                                  ).join(', ')}
                                </div>
                              )}
                              side="right"
                              maxWidthClass="max-w-2xl w-[26rem]"
                            >
                              <Badge variant="secondary" className="bg-blue-50 text-[#006397] border-blue-200 text-xs font-bold gap-1 cursor-help">
                                <Layers className="w-3 h-3" /> {item.panels_count} Painéis Alocados
                              </Badge>
                            </HoverTooltip>
                            <span className="text-xs text-slate-500 font-mono">{item.panel_ids_list}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 w-full lg:w-auto flex-shrink-0">
                        <div className="text-left lg:text-right hidden sm:block">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Valor Estimado</span>
                          {/* <span className="text-sm font-bold text-slate-900">{brl(estimado)}</span> */}
                          <span className="text-sm font-bold text-slate-900">**,**</span>
                        </div>
                        <Button onClick={() => onOpenNovaPI(item)} className={cn('gap-2 cursor-pointer font-semibold shadow-xs', isHotItem ? 'bg-[#006397] hover:bg-[#004b73] text-white px-5' : 'bg-slate-900 hover:bg-slate-800 text-white')}>
                          <FileText className="w-4 h-4" /> {isHotItem ? 'Gerar PI para Reserva' : 'Gerar PI'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {paginatedItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Nenhuma reserva encontrada</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Tente ajustar os termos de pesquisa ou remover os filtros aplicados.</p>
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs cursor-pointer">Limpar filtros</Button>
              </div>
            )}
          </div>

          {filteredList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
              <div>
                Mostrando{' '}
                <span className="font-semibold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                a{' '}
                <span className="font-semibold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredList.length)}</span>{' '}
                de{' '}
                <span className="font-semibold text-slate-800">{filteredList.length}</span>{' '}
                reservas sem pedido emitido
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="icon-sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button key={pageNum} variant={currentPage === pageNum ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(pageNum)} className={cn('w-8 h-8 p-0 cursor-pointer text-xs', currentPage === pageNum ? 'bg-[#006397] hover:bg-[#004b73] text-white font-bold' : 'text-slate-700')}>
                    {pageNum}
                  </Button>
                ))}
                <Button variant="outline" size="icon-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <NovaPIModal
          isOpen={modalOpen}
          onClose={onCloseModal}
          preReservation={activePre}
          currentBiSemana={currentBiSemana}
          onEmitSuccess={() => {}}
        />
      </div>
    </AppLayout>
  );
}
