import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import * as toastrNS from 'toastr';
import 'toastr/build/toastr.min.css';
const toastr = toastrNS && (toastrNS.default || toastrNS.toastr || toastrNS);

import { AppLayout } from '@/react/Layouts/AppLayout';
import {
  Layers,
  Search,
  Plus,
  Tv,
  Sun,
  Eye,
  Copy,
  ExternalLink,
  Check,
  Zap,
  MapPin,
  Image as ImageIcon,
  Edit,
  Trash2,
  X,
  Filter,
  RefreshCw,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Navigation,
  Compass,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/react/Components/ui/card';
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

export default function ListaPaineisIndex({ paineis: initialPaineis = [], ufs: initialUfs = [] }) {
  const { props } = usePage();
  const userPermissions = usePage().props?.user?.permissions || [];

  // Permissões
  const canCreate = userPermissions.length === 0 || userPermissions.includes('criar painel');
  const canEdit = userPermissions.length === 0 || userPermissions.includes('editar painel');
  const canDelete = userPermissions.length === 0 || userPermissions.includes('excluir painel');

  // Estados da lista
  const [paineisList, setPaineisList] = useState(initialPaineis);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all'); // all, nobre, convencional, led
  const [selectedRegiao, setSelectedRegiao] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [copiedId, setCopiedId] = useState(null);

  // Lightbox da foto HD
  const [photoViewerPanel, setPhotoViewerPanel] = useState(null);

  // Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [panelToDelete, setPanelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal de Cadastro/Edição
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [activeFormTab, setActiveFormTab] = useState(1); // 1 = Localização, 2 = Técnico
  const [isSaving, setIsSaving] = useState(false);

  // Dados auxiliares de endereços para formulário
  const [ufsList, setUfsList] = useState(initialUfs);
  const [cidadesList, setCidadesList] = useState([]);
  const [bairrosList, setBairrosList] = useState([]);
  const [isLoadingCidades, setIsLoadingCidades] = useState(false);
  const [isLoadingBairros, setIsLoadingBairros] = useState(false);

  // Form State
  const initialFormData = {
    idPainel: null,
    // Step 1: Localização
    ender: '',
    numero: '',
    referencia: '',
    uf: '',
    cidade: '',
    bairro: '',
    latitude: '',
    longitude: '',
    // Step 2: Dados Técnicos
    ident: '',
    ident_ant: '',
    cadan: '',
    dim: '9.00 x 3.00',
    dimLona: '9.20 x 3.20',
    posicao: '',
    tipo: '1', // 1: Nobre, 2: Convencional
    is_led: 0,  // 0: Não, 1: Sim
    imagem: null,
    imagemPreview: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  // Sincronizar painéis caso as props atualizem
  useEffect(() => {
    setPaineisList(initialPaineis);
  }, [initialPaineis]);

  // Se não vier UFs pelas props, carrega via API
  useEffect(() => {
    if (initialUfs.length === 0) {
      axios.get('/dtGetUfs')
        .then((res) => setUfsList(res.data || []))
        .catch((err) => console.error('Erro ao buscar UFs:', err));
    }
  }, [initialUfs]);

  // Lista de regiões únicas presentes nos painéis para o filtro
  const regioesDisponiveis = useMemo(() => {
    const setReg = new Set();
    paineisList.forEach((p) => {
      const regNome = p.bairro?.regiao?.nome;
      if (regNome) setReg.add(regNome);
    });
    return Array.from(setReg).sort();
  }, [paineisList]);

  // Estatísticas do Inventário
  const stats = useMemo(() => {
    const total = paineisList.length;
    const nobres = paineisList.filter((p) => String(p.tipo) === '1' && !p.is_led).length;
    const convencionais = paineisList.filter((p) => String(p.tipo) === '2' && !p.is_led).length;
    const leds = paineisList.filter((p) => Number(p.is_led) === 1).length;
    return { total, nobres, convencionais, leds };
  }, [paineisList]);

  // Painéis Filtrados
  const filteredPanels = useMemo(() => {
    return paineisList.filter((p) => {
      // Busca textual
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        String(p.identificacao || '').toLowerCase().includes(term) ||
        String(p.ident_antiga || '').toLowerCase().includes(term) ||
        String(p.cadan || '').toLowerCase().includes(term) ||
        String(p.logradouro || '').toLowerCase().includes(term) ||
        String(p.numero || '').toLowerCase().includes(term) ||
        String(p.ponto_referencia || '').toLowerCase().includes(term) ||
        String(p.bairro?.nome || '').toLowerCase().includes(term) ||
        String(p.bairro?.regiao?.nome || '').toLowerCase().includes(term) ||
        String(p.bairro?.regiao?.cidade?.nome || '').toLowerCase().includes(term);

      // Filtro de formato
      let matchFormat = true;
      if (selectedFormat === 'led') {
        matchFormat = Number(p.is_led) === 1;
      } else if (selectedFormat === 'nobre') {
        matchFormat = String(p.tipo) === '1' && Number(p.is_led) !== 1;
      } else if (selectedFormat === 'convencional') {
        matchFormat = String(p.tipo) === '2' && Number(p.is_led) !== 1;
      }

      // Filtro de região
      let matchRegiao = true;
      if (selectedRegiao !== 'all') {
        matchRegiao = p.bairro?.regiao?.nome === selectedRegiao;
      }

      return matchSearch && matchFormat && matchRegiao;
    });
  }, [paineisList, searchTerm, selectedFormat, selectedRegiao]);

  // Helper de URL da Imagem do Painel
  const resolveImageUrl = (path) => {
    if (!path) return '/storage/img/painel_nobre.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/storage/')) return path;
    return `/storage/${path}`;
  };

  // Copiar link direto da imagem
  const handleCopyLink = (e, panel) => {
    e.stopPropagation();
    const url = resolveImageUrl(panel.image_url);
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(panel.id);
    if (toastr) toastr.info('Link da imagem copiado!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Abrir Lightbox
  const handleOpenPhoto = (panel) => {
    setPhotoViewerPanel(panel);
  };

  // ==========================================
  // CARREGAR CIDADES E BAIRROS DINAMICAMENTE
  // ==========================================
  const loadCidades = async (ufId, selectFirst = false) => {
    if (!ufId) {
      setCidadesList([]);
      return;
    }
    setIsLoadingCidades(true);
    try {
      const res = await axios.post('/dtGetCidades', { uf: ufId });
      const cidades = res.data || [];
      setCidadesList(cidades);
      if (selectFirst && cidades.length > 0) {
        setFormData((prev) => ({ ...prev, cidade: String(cidades[0].id) }));
        loadBairros(cidades[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar cidades:', err);
    } finally {
      setIsLoadingCidades(false);
    }
  };

  const loadBairros = async (cidadeId) => {
    if (!cidadeId) {
      setBairrosList([]);
      return;
    }
    setIsLoadingBairros(true);
    try {
      const res = await axios.post('/dtGetBairros', { cidade: cidadeId });
      setBairrosList(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar bairros:', err);
    } finally {
      setIsLoadingBairros(false);
    }
  };

  // ==========================================
  // AÇÕES: ABRIR MODAL CADASTRO / EDIÇÃO
  // ==========================================
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setActiveFormTab(1);
    setFormData({
      ...initialFormData,
      ident: String(paineisList.length + 1).padStart(3, '0'),
    });
    setCidadesList([]);
    setBairrosList([]);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = async (panel) => {
    setModalMode('edit');
    setActiveFormTab(1);

    // Carregar hierarquia do painel
    const bairroId = panel.bairro_id || panel.bairro?.id || '';
    const cidadeId = panel.bairro?.regiao?.cidade_id || panel.bairro?.regiao?.cidade?.id || '';
    const ufId = panel.bairro?.regiao?.cidade?.uf_id || panel.bairro?.regiao?.cidade?.uf?.id || '';

    setFormData({
      idPainel: panel.id,
      ender: panel.logradouro || '',
      numero: panel.numero || '',
      referencia: panel.ponto_referencia || '',
      uf: ufId ? String(ufId) : '',
      cidade: cidadeId ? String(cidadeId) : '',
      bairro: bairroId ? String(bairroId) : '',
      latitude: panel.latitude || '',
      longitude: panel.longitude || '',
      ident: panel.identificacao || '',
      ident_ant: panel.ident_antiga || '',
      cadan: panel.cadan || '',
      dim: panel.dimensao || '9.00 x 3.00',
      dimLona: Number(panel.is_led) === 1 ? '' : (panel.dimensao_lona || '9.20 x 3.20'),
      posicao: panel.posicao || '',
      tipo: panel.tipo ? String(panel.tipo) : '1',
      is_led: Number(panel.is_led) === 1 ? 1 : 0,
      imagem: null,
      imagemPreview: panel.image_url ? resolveImageUrl(panel.image_url) : null,
    });

    // Pré-carrega cidades e bairros dessa UF/Cidade
    if (ufId) {
      await loadCidades(ufId);
    }
    if (cidadeId) {
      await loadBairros(cidadeId);
    }

    setIsFormModalOpen(true);
  };

  // Tratar arquivo de imagem no formulário
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagem: file,
        imagemPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Submissão do Formulário de Painel (Salvar / Editar)
  const handleSavePainel = async (e) => {
    if (e) e.preventDefault();

    // Validações Step 1
    if (!formData.ender.trim()) {
      if (toastr) toastr.error('O campo Endereço é obrigatório!');
      setActiveFormTab(1);
      return;
    }
    if (!formData.numero.trim()) {
      if (toastr) toastr.error('O campo Número é obrigatório!');
      setActiveFormTab(1);
      return;
    }
    if (!formData.uf || formData.uf === '0') {
      if (toastr) toastr.error('Selecione uma UF!');
      setActiveFormTab(1);
      return;
    }
    if (!formData.cidade || formData.cidade === '0') {
      if (toastr) toastr.error('Selecione uma Cidade!');
      setActiveFormTab(1);
      return;
    }
    if (!formData.bairro || formData.bairro === '0') {
      if (toastr) toastr.error('Selecione um Bairro!');
      setActiveFormTab(1);
      return;
    }

    // Validações Step 2
    if (!formData.ident.trim()) {
      if (toastr) toastr.error('O campo Identificação é obrigatório!');
      setActiveFormTab(2);
      return;
    }
    if (!formData.cadan.trim()) {
      if (toastr) toastr.error('O campo CADAN é obrigatório!');
      setActiveFormTab(2);
      return;
    }
    if (!formData.dim.trim()) {
      if (toastr) toastr.error('O campo Dimensão é obrigatório!');
      setActiveFormTab(2);
      return;
    }
    if (!formData.posicao.trim()) {
      if (toastr) toastr.error('O campo Posição é obrigatório!');
      setActiveFormTab(2);
      return;
    }
    if (modalMode === 'create' && !formData.imagem) {
      if (toastr) toastr.error('É obrigatório anexar uma imagem para o novo painel!');
      setActiveFormTab(2);
      return;
    }

    setIsSaving(true);
    try {
      const dataPayload = new FormData();
      // Step 1: Localização
      dataPayload.append('dados[sOne][ender]', formData.ender);
      dataPayload.append('dados[sOne][numero]', formData.numero);
      dataPayload.append('dados[sOne][referencia]', formData.referencia || '');
      dataPayload.append('dados[sOne][uf]', formData.uf);
      dataPayload.append('dados[sOne][cidade]', formData.cidade);
      dataPayload.append('dados[sOne][bairro]', formData.bairro);
      dataPayload.append('dados[sOne][latitude]', formData.latitude || '');
      dataPayload.append('dados[sOne][longitude]', formData.longitude || '');

      // Step 2: Dados Técnicos
      if (formData.idPainel) {
        dataPayload.append('dados[sTwo][idPainel]', formData.idPainel);
      }
      dataPayload.append('dados[sTwo][ident]', formData.ident);
      dataPayload.append('dados[sTwo][ident_ant]', formData.ident_ant || '');
      dataPayload.append('dados[sTwo][cadan]', formData.cadan);
      dataPayload.append('dados[sTwo][dim]', formData.dim);
      dataPayload.append(
        'dados[sTwo][dimLona]',
        Number(formData.is_led) === 1 ? '' : (formData.dimLona || formData.dim)
      );
      dataPayload.append('dados[sTwo][posicao]', formData.posicao);
      dataPayload.append('dados[sTwo][tipo]', formData.tipo);
      dataPayload.append('dados[sTwo][is_led]', formData.is_led);

      // Arquivo de imagem
      if (formData.imagem) {
        dataPayload.append('dados[sTwo][imagem]', formData.imagem);
      } else {
        dataPayload.append('dados[sTwo][imagem]', 'existente');
      }

      await axios.post('/CadPainel', dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (toastr) {
        toastr.success(
          modalMode === 'create'
            ? 'Painel cadastrado com sucesso!'
            : 'Painel atualizado com sucesso!'
        );
      }

      setIsFormModalOpen(false);
      // Recarrega lista
      router.reload({ preserveScroll: true });
    } catch (err) {
      console.error('Erro ao salvar painel:', err);
      const msg = err.response?.data?.message || 'Erro ao processar dados do painel.';
      if (toastr) toastr.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // AÇÕES: EXCLUIR PAINEL
  // ==========================================
  const handleConfirmDelete = (panel) => {
    setPanelToDelete(panel);
    setIsDeleteModalOpen(true);
  };

  const executeDeletePainel = async () => {
    if (!panelToDelete) return;
    setIsDeleting(true);
    try {
      await axios.post('/DelPainel', { idPainel: panelToDelete.id });
      if (toastr) toastr.success('Painel excluído com sucesso!');
      setIsDeleteModalOpen(false);
      setPanelToDelete(null);
      // Atualizar localmente e recarregar props
      setPaineisList((prev) => prev.filter((p) => p.id !== panelToDelete.id));
      router.reload({ preserveScroll: true });
    } catch (err) {
      console.error('Erro ao excluir painel:', err);
      if (toastr) toastr.error('Não foi possível excluir este painel.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout
      title="Painéis e Inventário OOH • SGEP"
      activeTab="paineis"
      breadcrumbs={[
        { label: 'Início', href: '/dashboard' },
        { label: 'Painéis' },
        { label: 'Lista de Painéis' },
      ]}
    >
      <Head title="Painéis e Inventário OOH" />

      <div className="flex flex-col w-full max-w-[1520px] mx-auto space-y-5 animate-fade-in pb-12">
        {/* ==================================================== */}
        {/* TOP HEADER: ESTILO IDENTIDADE VISUAL EQUIPE PROPAGANDA */}
        {/* ==================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-2.5 h-12 bg-[#006397] rounded-full shadow-xs" />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                  Painéis e Inventário OOH
                </h1>
                <Badge className="bg-[#006397]/10 text-[#006397] font-bold border-0 px-2.5 py-0.5 text-xs">
                  {paineisList.length} Faces Cadastradas
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Catálogo de faces publicitárias, formatos (9x3m, Frontlight, Painel Digital LED) e gestão completa do inventário
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.reload({ preserveScroll: true })}
              className="text-xs text-slate-600 border-slate-200 hover:bg-slate-50"
              title="Atualizar lista"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Atualizar
            </Button>

            {canCreate && (
              <Button
                onClick={handleOpenCreateModal}
                className="bg-[#006397] hover:bg-[#004f7a] text-white shadow-xs font-semibold text-xs md:text-sm px-4 h-9"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Cadastrar Novo Painel / LED
              </Button>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* KPI CARDS: INDICADORES DO INVENTÁRIO               */}
        {/* ==================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total de Faces
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {stats.total}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#006397] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Painéis Nobres
              </span>
              <span className="text-2xl font-black text-amber-700 font-mono">
                {stats.nobres}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Convencionais
              </span>
              <span className="text-2xl font-black text-slate-700 font-mono">
                {stats.convencionais}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-purple-200/80 bg-gradient-to-br from-purple-50/50 to-white p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">
                Painéis LED Digitais
              </span>
              <span className="text-2xl font-black text-purple-900 font-mono">
                {stats.leds}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* BARRA DE FILTROS E BUSCA                             */}
        {/* ==================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar por código (ex: 001), endereço, bairro ou CADAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9.5 bg-slate-50/80 border-slate-200 focus:bg-white text-xs md:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
            {/* Formato */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Formato:</span>
              <div className="w-44">
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="h-9 bg-slate-50/80 border-slate-200 text-xs">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Formatos</SelectItem>
                    <SelectItem value="nobre">Painel Nobre</SelectItem>
                    <SelectItem value="convencional">Painel Convencional</SelectItem>
                    <SelectItem value="led">Painel Digital LED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Região */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Região:</span>
              <div className="w-44">
                <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
                  <SelectTrigger className="h-9 bg-slate-50/80 border-slate-200 text-xs">
                    <SelectValue placeholder="Região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Regiões</SelectItem>
                    {regioesDisponiveis.map((reg) => (
                      <SelectItem key={reg} value={reg}>
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Alternador de visualização: Grade vs Tabela */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 ml-auto lg:ml-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'grid'
                    ? 'bg-white shadow-xs text-[#006397]'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Visualização em Grade de Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'table'
                    ? 'bg-white shadow-xs text-[#006397]'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                title="Visualização em Tabela Detalhada"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* CONTEÚDO PRINCIPAL: GRID DE CARDS OU TABELA          */}
        {/* ==================================================== */}
        {filteredPanels.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Nenhum painel encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Não encontramos nenhum painel com os filtros atuais ({searchTerm ? `"${searchTerm}"` : 'critérios selecionados'}).
            </p>
            {(searchTerm || selectedFormat !== 'all' || selectedRegiao !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFormat('all');
                  setSelectedRegiao('all');
                }}
                className="text-xs text-[#006397] border-[#006397]/30 hover:bg-[#006397]/5"
              >
                Limpar Todos os Filtros
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ==================================================== */
          /* MODO GRADE: CARDS DE INVENTÁRIO OOH                  */
          /* ==================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPanels.map((panel) => {
              const isLed = Number(panel.is_led) === 1;
              const isNobre = String(panel.tipo) === '1' && !isLed;
              const imageUrl = resolveImageUrl(panel.image_url);

              return (
                <Card
                  key={panel.id}
                  className="group overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col border-slate-200 bg-white"
                >
                  {/* Top Header da Imagem */}
                  <div
                    onClick={() => handleOpenPhoto(panel)}
                    className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={imageUrl}
                      alt={`Painel ${panel.identificacao}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = isLed
                          ? '/storage/img/painel_nobre.png'
                          : isNobre
                            ? '/storage/img/painel_nobre.png'
                            : '/storage/img/painel_conv.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Badges do Topo */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#006397] text-white text-xs font-bold font-mono shadow-xs">
                        {panel.identificacao}
                      </span>

                      {isLed ? (
                        <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0 text-[10px] font-semibold gap-1">
                          <Tv className="w-3 h-3" />
                          LED Digital
                        </Badge>
                      ) : isNobre ? (
                        <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-0 text-[10px] font-semibold gap-1">
                          <Sun className="w-3 h-3" />
                          Nobre
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-700 hover:bg-slate-800 text-white border-0 text-[10px] font-semibold gap-1">
                          <Layers className="w-3 h-3" />
                          Convencional
                        </Badge>
                      )}
                    </div>

                    {/* Botão de Copiar Link da Foto */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopyLink(e, panel)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
                        title="Copiar link direto da foto"
                      >
                        {copiedId === panel.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Dimensões em Overlay Inferior */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                      <span className="font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                        {panel.dimensao || '9.00 x 3.00m'}
                      </span>
                      {!isLed && panel.dimensao_lona && (
                        <span className="text-white/80 text-[10px] bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                          Lona: {panel.dimensao_lona}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Corpo do Card */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      {/* Endereço Principal */}
                      <h3
                        className="text-xs md:text-sm font-bold text-slate-900 line-clamp-1 mb-1"
                        title={`${panel.logradouro}, ${panel.numero}`}
                      >
                        {panel.logradouro || 'Endereço não informado'}, {panel.numero}
                      </h3>

                      {/* Bairro, Região e Cidade */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#006397] flex-shrink-0" />
                        <span className="truncate">
                          {panel.bairro?.nome || 'Bairro'} • {panel.bairro?.regiao?.nome || 'Região'}
                          {panel.bairro?.regiao?.cidade?.nome ? ` (${panel.bairro.regiao.cidade.nome})` : ''}
                        </span>
                      </div>

                      {panel.ponto_referencia && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-1">
                          Ref: {panel.ponto_referencia}
                        </p>
                      )}
                    </div>

                    {/* Especificações Técnicas (CADAN, Posição, Ident. Antiga) */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                          CADAN
                        </span>
                        <span className="font-mono text-slate-700 font-semibold truncate block">
                          {panel.cadan || '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                          Posição
                        </span>
                        <span className="text-slate-700 font-medium truncate block">
                          {panel.posicao || '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                          Ident. Antiga
                        </span>
                        <span className="font-mono text-slate-600 truncate block">
                          {panel.ident_antiga || '—'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                          Coordenadas
                        </span>
                        {panel.latitude && panel.longitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${panel.latitude},${panel.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#006397] hover:underline flex items-center gap-1 text-[10px] font-mono"
                          >
                            <Compass className="w-3 h-3" />
                            Ver Mapa
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Sem GPS</span>
                        )}
                      </div>
                    </div>

                    {/* Botões de Ação: Edição e Exclusão (Sem Reservas, conforme instrução) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenPhoto(panel)}
                        className="h-8 px-2 text-xs text-slate-600 hover:text-[#006397] hover:bg-blue-50"
                        title="Ver foto em tela cheia"
                      >
                        <ImageIcon className="w-3.5 h-3.5 mr-1 text-[#006397]" />
                        Ver Foto
                      </Button>

                      <div className="flex items-center gap-1.5 ml-auto">
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditModal(panel)}
                            className="h-8 px-2.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" />
                            Editar
                          </Button>
                        )}

                        {canDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirmDelete(panel)}
                            className="h-8 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* ==================================================== */
          /* MODO TABELA: VISUALIZAÇÃO EM LISTA DETALHADA         */
          /* ==================================================== */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Foto</th>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Tipo / Formato</th>
                    <th className="py-3 px-4">Endereço & Localização</th>
                    <th className="py-3 px-4">Dimensões</th>
                    <th className="py-3 px-4">CADAN</th>
                    <th className="py-3 px-4">Posição</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPanels.map((panel) => {
                    const isLed = Number(panel.is_led) === 1;
                    const isNobre = String(panel.tipo) === '1' && !isLed;
                    const imageUrl = resolveImageUrl(panel.image_url);

                    return (
                      <tr key={panel.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4">
                          <div
                            onClick={() => handleOpenPhoto(panel)}
                            className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 cursor-pointer shadow-2xs"
                          >
                            <img
                              src={imageUrl}
                              alt={panel.identificacao}
                              className="w-full h-full object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {panel.identificacao}
                          </span>
                          {panel.ident_antiga && (
                            <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                              Ant: {panel.ident_antiga}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          {isLed ? (
                            <Badge className="bg-purple-600 text-white border-0 text-[10px]">
                              LED Digital
                            </Badge>
                          ) : isNobre ? (
                            <Badge className="bg-amber-600 text-white border-0 text-[10px]">
                              Nobre
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-600 text-white border-0 text-[10px]">
                              Convencional
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-4 max-w-xs">
                          <span className="font-semibold text-slate-800 line-clamp-1">
                            {panel.logradouro}, {panel.numero}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {panel.bairro?.nome} • {panel.bairro?.regiao?.nome}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-700">
                          {panel.dimensao || '—'}
                          {!isLed && panel.dimensao_lona && (
                            <span className="block text-[10px] text-slate-400">
                              Lona: {panel.dimensao_lona}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-700">
                          {panel.cadan || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {panel.posicao || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenPhoto(panel)}
                              className="h-7 w-7 p-0 text-slate-500 hover:text-[#006397]"
                              title="Ver Foto"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </Button>

                            {canEdit && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEditModal(panel)}
                                className="h-7 px-2 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                            )}

                            {canDelete && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConfirmDelete(panel)}
                                className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Excluir
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL: CADASTRO / EDIÇÃO DE PAINEL OU LED            */}
      {/* ==================================================== */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 text-lg">
              <div className="w-8 h-8 rounded-lg bg-[#006397]/10 text-[#006397] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span>
                {modalMode === 'create'
                  ? 'Cadastrar Novo Painel ou LED'
                  : `Editar Painel #${formData.ident}`}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Preencha os dados de localização geográfica e as especificações técnicas da face publicitária.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper / Tabs do Formulário */}
          <div className="flex border-b border-slate-200 mt-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveFormTab(1)}
              className={`flex-1 py-2 text-xs font-semibold border-b-2 text-center transition-colors ${activeFormTab === 1
                  ? 'border-[#006397] text-[#006397]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
            >
              1. Localização & Endereço
            </button>
            <button
              type="button"
              onClick={() => setActiveFormTab(2)}
              className={`flex-1 py-2 text-xs font-semibold border-b-2 text-center transition-colors ${activeFormTab === 2
                  ? 'border-[#006397] text-[#006397]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
            >
              2. Dados Técnicos & Foto
            </button>
          </div>

          <form onSubmit={handleSavePainel} className="space-y-4">
            {activeFormTab === 1 ? (
              /* ABA 1: LOCALIZAÇÃO */
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Endereço / Logradouro *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: Av. Presidente Vargas"
                      value={formData.ender}
                      onChange={(e) => setFormData({ ...formData, ender: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 1200 ou S/N"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ponto de Referência
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Próximo ao posto Shell / Em frente ao shopping"
                    value={formData.referencia}
                    onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* UF */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      UF (Estado) *
                    </label>
                    <Select
                      value={formData.uf ? String(formData.uf) : ''}
                      onValueChange={(val) => {
                        setFormData({ ...formData, uf: val, cidade: '', bairro: '' });
                        loadCidades(val, true);
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Selecione UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {ufsList.map((uf) => (
                          <SelectItem key={uf.id} value={String(uf.id)}>
                            {uf.nome} ({uf.sigla || uf.nome})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cidade * {isLoadingCidades && <span className="text-[10px] text-slate-400">(carregando...)</span>}
                    </label>
                    <Select
                      value={formData.cidade ? String(formData.cidade) : ''}
                      disabled={!formData.uf || isLoadingCidades}
                      onValueChange={(val) => {
                        setFormData({ ...formData, cidade: val, bairro: '' });
                        loadBairros(val);
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder={!formData.uf ? 'Selecione UF primeiro' : 'Selecione a Cidade'} />
                      </SelectTrigger>
                      <SelectContent>
                        {cidadesList.map((cid) => (
                          <SelectItem key={cid.id} value={String(cid.id)}>
                            {cid.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bairro */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bairro * {isLoadingBairros && <span className="text-[10px] text-slate-400">(carregando...)</span>}
                    </label>
                    <Select
                      value={formData.bairro ? String(formData.bairro) : ''}
                      disabled={!formData.cidade || isLoadingBairros}
                      onValueChange={(val) => setFormData({ ...formData, bairro: val })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder={!formData.cidade ? 'Selecione Cidade primeiro' : 'Selecione o Bairro'} />
                      </SelectTrigger>
                      <SelectContent>
                        {bairrosList.map((b) => (
                          <SelectItem key={b.id} value={String(b.id)}>
                            {b.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Latitude (GPS)
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: -20.8113"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Longitude (GPS)
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: -49.3758"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setActiveFormTab(2)}
                    className="bg-[#006397] hover:bg-[#004f7a] text-white text-xs"
                  >
                    Próximo: Dados Técnicos
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            ) : (
              /* ABA 2: DADOS TÉCNICOS & FOTO */
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Identificação (Código) *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 001 ou EP-001"
                      value={formData.ident}
                      onChange={(e) => setFormData({ ...formData, ident: e.target.value })}
                      className="font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Identificação Antiga
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 104-A"
                      value={formData.ident_ant}
                      onChange={(e) => setFormData({ ...formData, ident_ant: e.target.value })}
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CADAN *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 2024-00123"
                      value={formData.cadan}
                      onChange={(e) => setFormData({ ...formData, cadan: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {/* Tipo de Painel */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo do Painel *
                    </label>
                    <Select
                      value={String(formData.tipo)}
                      onValueChange={(val) => setFormData({ ...formData, tipo: val })}
                    >
                      <SelectTrigger className="h-9 text-xs bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Painel Nobre</SelectItem>
                        <SelectItem value="2">Painel Convencional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Painel LED */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      É Painel Digital LED? *
                    </label>
                    <div className="flex items-center gap-4 h-9">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="is_led"
                          checked={Number(formData.is_led) === 0}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              is_led: 0,
                              dimLona: formData.dimLona || '9.20 x 3.20',
                            })
                          }
                          className="text-[#006397] focus:ring-[#006397]"
                        />
                        <span>Não (Estático)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="is_led"
                          checked={Number(formData.is_led) === 1}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              is_led: 1,
                              dimLona: '',
                            })
                          }
                          className="text-purple-600 focus:ring-purple-600"
                        />
                        <span className="flex items-center gap-1">
                          <Tv className="w-3.5 h-3.5" />
                          Sim (LED Digital)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    Number(formData.is_led) === 1 ? 'md:grid-cols-2' : 'md:grid-cols-3'
                  } gap-3`}
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dimensão da Estrutura *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 9.00 x 3.00"
                      value={formData.dim}
                      onChange={(e) => setFormData({ ...formData, dim: e.target.value })}
                      required
                    />
                  </div>

                  {Number(formData.is_led) !== 1 && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Dimensão da Lona
                      </label>
                      <Input
                        type="text"
                        placeholder="Ex: 9.20 x 3.20"
                        value={formData.dimLona}
                        onChange={(e) => setFormData({ ...formData, dimLona: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Posição / Sentido *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: Sentido Centro/Bairro ou Face A"
                      value={formData.posicao}
                      onChange={(e) => setFormData({ ...formData, posicao: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Upload de Imagem */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Foto do Painel {modalMode === 'edit' ? '(Opcional se mantiver atual)' : '*'}
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-[#006397] rounded-xl p-4 text-center bg-slate-50/50 transition-colors">
                    {formData.imagemPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
                          <img
                            src={formData.imagemPreview}
                            alt="Pré-visualização"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <label className="cursor-pointer text-xs font-semibold text-[#006397] hover:underline">
                          Trocar foto selecionada
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center space-y-1">
                        <Upload className="w-8 h-8 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">
                          Clique para selecionar a foto do painel
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Formatos aceitos: JPG, PNG, WEBP. Tamanho máx.: 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveFormTab(1)}
                    className="text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Voltar para Localização
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsFormModalOpen(false)}
                      disabled={isSaving}
                      className="text-xs"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#006397] hover:bg-[#004f7a] text-white text-xs font-semibold"
                    >
                      {isSaving ? 'Salvando...' : modalMode === 'create' ? 'Salvar Painel' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================================================== */}
      {/* MODAL: CONFIRMAÇÃO DE EXCLUSÃO DE PAINEL             */}
      {/* ==================================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-slate-900 text-lg">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              Esta ação removerá o painel do inventário. Tem certeza que deseja prosseguir?
            </DialogDescription>
          </DialogHeader>

          {panelToDelete && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 my-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Identificação:</span>
                <span className="font-mono font-bold text-slate-900">
                  {panelToDelete.identificacao}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Endereço:</span>
                <span className="text-slate-800 font-semibold truncate max-w-[200px]">
                  {panelToDelete.logradouro}, {panelToDelete.numero}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Bairro:</span>
                <span className="text-slate-800">{panelToDelete.bairro?.nome || '—'}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={executeDeletePainel}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
            >
              {isDeleting ? 'Excluindo...' : 'Sim, Excluir Painel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================================================== */}
      {/* MODAL: LIGHTBOX DE VISUALIZAÇÃO DA FOTO HD           */}
      {/* ==================================================== */}
      <Dialog open={!!photoViewerPanel} onOpenChange={() => setPhotoViewerPanel(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-slate-950 border-slate-800 text-white">
          {photoViewerPanel && (
            <div className="flex flex-col">
              {/* Imagem em destaque */}
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={resolveImageUrl(photoViewerPanel.image_url)}
                  alt={photoViewerPanel.identificacao}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              {/* Barra de Informações do Painel */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm bg-[#006397] px-2 py-0.5 rounded">
                      {photoViewerPanel.identificacao}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {photoViewerPanel.logradouro}, {photoViewerPanel.numero}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {photoViewerPanel.bairro?.nome} • {photoViewerPanel.bairro?.regiao?.nome} • Dimensão: {photoViewerPanel.dimensao}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {photoViewerPanel.latitude && photoViewerPanel.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${photoViewerPanel.latitude},${photoViewerPanel.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#006397]" />
                      Ver no Google Maps
                    </a>
                  )}

                  <button
                    onClick={(e) => handleCopyLink(e, photoViewerPanel)}
                    className="px-3 py-1.5 rounded-lg bg-[#006397] hover:bg-[#004f7a] text-white flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Link Direto
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
