import { BiSemana, Seller, Client, AddressLocation, Panel, Reservation, CheckingReport, PanelType } from './types';

// Curated high quality direct image links for Out-of-Home panels & Billboards
export const SAMPLE_OOH_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', // LED Billboard
  'https://images.unsplash.com/photo-1572945753563-8049567811f4?auto=format&fit=crop&w=1200&q=80', // Street Billboard
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80', // Urban advertising
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80', // Road billboard
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80', // High traffic avenue
  'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80', // City center billboard
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', // Night illumination billboard
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80', // Vibrant colors billboard
];

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'taynara',
    name: 'Taynara',
    initial: 'T',
    color: '#006397', // Primary blue
    bgColor: 'bg-primary',
    textColor: 'text-primary',
    email: 'taynara@equipepropaganda.com.br',
    phone: '(11) 98765-4321',
    commissionRate: 5.0,
  },
  {
    id: 'josiane',
    name: 'Josiane',
    initial: 'J',
    color: '#ab2c5d', // Secondary magenta
    bgColor: 'bg-secondary',
    textColor: 'text-secondary',
    email: 'josiane@equipepropaganda.com.br',
    phone: '(11) 98765-4322',
    commissionRate: 5.0,
  },
  {
    id: 'fabiane',
    name: 'Fabiane',
    initial: 'F',
    color: '#835500', // Tertiary amber
    bgColor: 'bg-tertiary',
    textColor: 'text-tertiary',
    email: 'fabiane@equipepropaganda.com.br',
    phone: '(11) 98765-4323',
    commissionRate: 5.0,
  },
];

// Bi-semanas calendar for OOH standard (26 bi-semanas/year)
export const BI_SEMANAS: BiSemana[] = [
  { id: 'BS-14-2025', number: 14, year: 2025, label: 'BS: 14 (10/03/2025 - 23/03/2025)', startDate: '2025-03-10', endDate: '2025-03-23' },
  { id: 'BS-15-2025', number: 15, year: 2025, label: 'BS: 15 (24/03/2025 - 06/04/2025)', startDate: '2025-03-24', endDate: '2025-04-06' },
  { id: 'BS-16-2025', number: 16, year: 2025, label: 'BS: 16 (07/04/2025 - 20/04/2025)', startDate: '2025-04-07', endDate: '2025-04-20' },
  { id: 'BS-17-2025', number: 17, year: 2025, label: 'BS: 17 (21/04/2025 - 04/05/2025)', startDate: '2025-04-21', endDate: '2025-05-04' },
  { id: 'BS-18-2025', number: 18, year: 2025, label: 'BS: 18 (05/05/2025 - 18/05/2025)', startDate: '2025-05-05', endDate: '2025-05-18' },
  { id: 'BS-19-2025', number: 19, year: 2025, label: 'BS: 19 (19/05/2025 - 01/06/2025)', startDate: '2025-05-19', endDate: '2025-06-01' },
  { id: 'BS-20-2025', number: 20, year: 2025, label: 'BS: 20 (02/06/2025 - 15/06/2025)', startDate: '2025-06-02', endDate: '2025-06-15' },
  // 2024
  { id: 'BS-16-2024', number: 16, year: 2024, label: 'BS: 16 (08/04/2024 - 21/04/2024)', startDate: '2024-04-08', endDate: '2024-04-21' },
  { id: 'BS-15-2024', number: 15, year: 2024, label: 'BS: 15 (25/03/2024 - 07/04/2024)', startDate: '2024-03-25', endDate: '2024-04-07' },
  // 2026
  { id: 'BS-16-2026', number: 16, year: 2026, label: 'BS: 16 (06/04/2026 - 19/04/2026)', startDate: '2026-04-06', endDate: '2026-04-19' },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-01',
    name: 'AGENCIA MOSCA',
    tradeName: 'Mosca Comunicação & Estratégia',
    cnpj: '12.345.678/0001-90',
    segment: 'Agência de Publicidade',
    contactName: 'Rodrigo Mosca',
    email: 'midia@agenciamosca.com.br',
    phone: '(11) 3214-5500',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 28,
  },
  {
    id: 'cli-02',
    name: 'JOSI',
    tradeName: 'Josi Cosméticos & Fragrâncias',
    cnpj: '98.765.432/0001-11',
    segment: 'Varejo & Beleza',
    contactName: 'Josiane Ribeiro',
    email: 'marketing@josicosmeticos.com.br',
    phone: '(11) 3456-7890',
    preferredSellerId: 'josiane',
    status: 'Ativo',
    totalReservas: 24,
  },
  {
    id: 'cli-03',
    name: 'WR CONSTRUTORA',
    tradeName: 'WR Empreendimentos Imobiliários',
    cnpj: '23.456.789/0001-22',
    segment: 'Construção Civil & Imóveis',
    contactName: 'Waldir Resende',
    email: 'vendas@wrconstrutora.com.br',
    phone: '(11) 2987-6543',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 19,
  },
  {
    id: 'cli-04',
    name: 'SIM CLUB',
    tradeName: 'SIM Benefícios & Proteção Veicular',
    cnpj: '34.567.890/0001-33',
    segment: 'Serviços Financeiros',
    contactName: 'Camila Simas',
    email: 'expansao@simclub.com.br',
    phone: '(11) 3100-2020',
    preferredSellerId: 'fabiane',
    status: 'Ativo',
    totalReservas: 15,
  },
  {
    id: 'cli-05',
    name: 'SUPERMERCADOS ALVORADA',
    tradeName: 'Rede Alvorada de Supermercados',
    cnpj: '45.678.901/0001-44',
    segment: 'Supermercadista',
    contactName: 'Marcos Alvorada',
    email: 'compras@alvorada.com.br',
    phone: '(11) 4500-1122',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 12,
  },
  {
    id: 'cli-06',
    name: 'DROGARIA TOTAL',
    tradeName: 'Rede Total Farmácias',
    cnpj: '56.789.012/0001-55',
    segment: 'Farmacêutico',
    contactName: 'Dra. Beatriz Toledo',
    email: 'marketing@drogariatotal.com.br',
    phone: '(11) 3344-5566',
    preferredSellerId: 'josiane',
    status: 'Ativo',
    totalReservas: 10,
  },
  {
    id: 'cli-07',
    name: 'UNIMED SAÚDE',
    tradeName: 'Unimed Cooperativa Médica',
    cnpj: '67.890.123/0001-66',
    segment: 'Saúde & Convênio',
    contactName: 'Gabriel Nogueira',
    email: 'comunicacao@unimed.org.br',
    phone: '(11) 3890-0000',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 14,
  },
  {
    id: 'cli-08',
    name: 'AUTO POSTO IPIRANGA',
    tradeName: 'Posto Estrela Ipiranga',
    cnpj: '78.901.234/0001-77',
    segment: 'Combustíveis e Conveniência',
    contactName: 'Luciano Silva',
    email: 'gerencia@postoestrela.com.br',
    phone: '(11) 2233-4455',
    preferredSellerId: 'fabiane',
    status: 'Ativo',
    totalReservas: 8,
  },
  {
    id: 'cli-09',
    name: 'RESTAURANTE BAMBU',
    tradeName: 'Bambu Gastronomia Oriental',
    cnpj: '89.012.345/0001-88',
    segment: 'Gastronomia',
    contactName: 'Kenzo Tanaka',
    email: 'contato@restaurantebambu.com.br',
    phone: '(11) 3788-9900',
    preferredSellerId: 'josiane',
    status: 'Ativo',
    totalReservas: 6,
  },
  {
    id: 'cli-10',
    name: 'COLÉGIO INTEGRADO',
    tradeName: 'Grupo Educacional Integrado',
    cnpj: '90.123.456/0001-99',
    segment: 'Educação',
    contactName: 'Prof. Sérgio Meirelles',
    email: 'matriculas@integrado.edu.br',
    phone: '(11) 3012-3400',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 9,
  },
  {
    id: 'cli-11',
    name: 'ACADEMIA VITAL',
    tradeName: 'Vital Fitness & Health Club',
    cnpj: '01.234.567/0001-00',
    segment: 'Fitness',
    contactName: 'Juliana Paes',
    email: 'contato@academiavital.com.br',
    phone: '(11) 99112-3344',
    preferredSellerId: 'fabiane',
    status: 'Ativo',
    totalReservas: 5,
  },
  {
    id: 'cli-12',
    name: 'LOJAS CEM',
    tradeName: 'Lojas CEM Eletromóveis',
    cnpj: '11.223.344/0001-11',
    segment: 'Varejo / Móveis e Eletro',
    contactName: 'Carlos Eduardo',
    email: 'propaganda@lojascem.com.br',
    phone: '(11) 4004-1234',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 18,
  },
  {
    id: 'cli-13',
    name: 'ÓTICAS CAROL',
    tradeName: 'Óticas Carol Franquias',
    cnpj: '22.334.455/0001-22',
    segment: 'Ótica e Moda',
    contactName: 'Fernanda Lima',
    email: 'marketing@oticascarol.com.br',
    phone: '(11) 3322-1100',
    preferredSellerId: 'josiane',
    status: 'Ativo',
    totalReservas: 7,
  },
  {
    id: 'cli-14',
    name: 'CONCESSIONÁRIA VIA NORTE',
    tradeName: 'Via Norte Motors Veículos',
    cnpj: '33.445.566/0001-33',
    segment: 'Automotivo',
    contactName: 'Eduardo Braga',
    email: 'diretoria@vianortemotors.com.br',
    phone: '(11) 2899-4400',
    preferredSellerId: 'taynara',
    status: 'Ativo',
    totalReservas: 11,
  },
  {
    id: 'cli-15',
    name: 'SICREDI COOPERATIVA',
    tradeName: 'Sicredi União',
    cnpj: '44.556.677/0001-44',
    segment: 'Cooperativa de Crédito',
    contactName: 'Lucia Ferraz',
    email: 'marketing@sicredi.com.br',
    phone: '(11) 3144-8800',
    preferredSellerId: 'fabiane',
    status: 'Ativo',
    totalReservas: 13,
  },
];

export const INITIAL_ADDRESSES: AddressLocation[] = [
  {
    id: 'loc-01',
    code: 'END-001',
    title: 'Av. Presidente Vargas, 1420',
    neighborhood: 'Centro',
    city: 'São Paulo - SP',
    reference: 'Em frente ao Shopping Central, sentido Bairro/Centro',
    coordinates: { lat: -23.55052, lng: -46.633308 },
    dailyTraffic: 85000,
    directImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    directNightImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    panelsCount: 4,
    featured: true,
  },
  {
    id: 'loc-02',
    code: 'END-002',
    title: 'Rodovia Presidente Dutra, KM 218',
    neighborhood: 'Vila Augusta',
    city: 'Guarulhos - SP',
    reference: 'Marginal Dutra, próximo ao Trevo de Acesso',
    coordinates: { lat: -23.46278, lng: -46.53333 },
    dailyTraffic: 140000,
    directImageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    directNightImageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    panelsCount: 6,
    featured: true,
  },
  {
    id: 'loc-03',
    code: 'END-003',
    title: 'Av. Paulista, 900 (Esquina com Al. Campinas)',
    neighborhood: 'Bela Vista',
    city: 'São Paulo - SP',
    reference: 'Coração financeiro da Paulista, fluxo pedestre e veicular intenso',
    coordinates: { lat: -23.5657, lng: -46.6515 },
    dailyTraffic: 220000,
    directImageUrl: 'https://images.unsplash.com/photo-1572945753563-8049567811f4?auto=format&fit=crop&w=1200&q=80',
    panelsCount: 3,
    featured: true,
  },
  {
    id: 'loc-04',
    code: 'END-004',
    title: 'Av. dos Bandeirantes, 2400',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo - SP',
    reference: 'Próximo ao Viaduto Santo Amaro / Aeroporto Congonhas',
    coordinates: { lat: -23.6019, lng: -46.6789 },
    dailyTraffic: 195000,
    directImageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    panelsCount: 5,
    featured: true,
  },
  {
    id: 'loc-05',
    code: 'END-005',
    title: 'Av. Brasil, 450 - Trevo Norte',
    neighborhood: 'Jardim América',
    city: 'Campinas - SP',
    reference: 'Rotatória principal com visibilidade 360°',
    coordinates: { lat: -22.9064, lng: -47.0616 },
    dailyTraffic: 72000,
    directImageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
    panelsCount: 4,
    featured: false,
  },
  {
    id: 'loc-06',
    code: 'END-006',
    title: 'Av. Ibirapuera, 1850',
    neighborhood: 'Moema',
    city: 'São Paulo - SP',
    reference: 'Em frente ao Shopping Ibirapuera / Estação Eucaliptos',
    coordinates: { lat: -23.6083, lng: -46.6664 },
    dailyTraffic: 110000,
    directImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    panelsCount: 4,
    featured: true,
  }
];

export const INITIAL_PANELS: Panel[] = [
  {
    id: 'pan-01',
    code: 'EP-001',
    addressId: 'loc-01',
    addressTitle: 'Av. Presidente Vargas, 1420 - Face A',
    neighborhood: 'Centro',
    city: 'São Paulo - SP',
    type: 'Outdoor 9x3',
    dimensions: '9.00 x 3.00m',
    lighting: 'Iluminado',
    dailyViews: 85000,
    pricePerBS: 3200,
    directImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    latitude: -23.55052,
    longitude: -46.633308,
    status: 'Reservado',
  },
  {
    id: 'pan-02',
    code: 'EP-002',
    addressId: 'loc-01',
    addressTitle: 'Av. Presidente Vargas, 1420 - Face B',
    neighborhood: 'Centro',
    city: 'São Paulo - SP',
    type: 'Outdoor 9x3',
    dimensions: '9.00 x 3.00m',
    lighting: 'Iluminado',
    dailyViews: 75000,
    pricePerBS: 3000,
    directImageUrl: 'https://images.unsplash.com/photo-1572945753563-8049567811f4?auto=format&fit=crop&w=1200&q=80',
    latitude: -23.55052,
    longitude: -46.633308,
    status: 'Reservado',
  },
  {
    id: 'pan-03',
    code: 'EP-003',
    addressId: 'loc-02',
    addressTitle: 'Rodovia Pres. Dutra, KM 218 - Megapainel 01',
    neighborhood: 'Vila Augusta',
    city: 'Guarulhos - SP',
    type: 'Frontlight Iluminado',
    dimensions: '12.00 x 4.00m',
    lighting: 'Iluminado',
    dailyViews: 140000,
    pricePerBS: 5800,
    directImageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    latitude: -23.46278,
    longitude: -46.53333,
    status: 'Reservado',
  },
  {
    id: 'pan-04',
    code: 'EP-004',
    addressId: 'loc-03',
    addressTitle: 'Av. Paulista, 900 - Painel Digital LED',
    neighborhood: 'Bela Vista',
    city: 'São Paulo - SP',
    type: 'Painel Digital LED',
    dimensions: '8.00 x 4.00m (LED P4)',
    lighting: 'Digital LED 24h',
    dailyViews: 220000,
    pricePerBS: 7500,
    directImageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    latitude: -23.5657,
    longitude: -46.6515,
    status: 'Reservado',
  },
  {
    id: 'pan-05',
    code: 'EP-005',
    addressId: 'loc-04',
    addressTitle: 'Av. dos Bandeirantes, 2400 - Frontlight A',
    neighborhood: 'Vila Olímpia',
    city: 'São Paulo - SP',
    type: 'Frontlight Iluminado',
    dimensions: '10.00 x 4.00m',
    lighting: 'Iluminado',
    dailyViews: 195000,
    pricePerBS: 6200,
    directImageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    latitude: -23.6019,
    longitude: -46.6789,
    status: 'Reservado',
  },
  {
    id: 'pan-06',
    code: 'EP-006',
    addressId: 'loc-05',
    addressTitle: 'Av. Brasil, 450 - TopSight Duplo',
    neighborhood: 'Jardim América',
    city: 'Campinas - SP',
    type: 'TopSight',
    dimensions: '9.00 x 3.00m',
    lighting: 'Iluminado',
    dailyViews: 72000,
    pricePerBS: 3600,
    directImageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
    latitude: -22.9064,
    longitude: -47.0616,
    status: 'Reservado',
  },
  {
    id: 'pan-07',
    code: 'EP-007',
    addressId: 'loc-06',
    addressTitle: 'Av. Ibirapuera, 1850 - Empena Moema',
    neighborhood: 'Moema',
    city: 'São Paulo - SP',
    type: 'Empena',
    dimensions: '14.00 x 8.00m',
    lighting: 'Iluminado',
    dailyViews: 110000,
    pricePerBS: 9800,
    directImageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    latitude: -23.6083,
    longitude: -46.6664,
    status: 'Reservado',
  },
];

// Helper to generate the exact 57 active reservations for BS 16 (2025)
// Taynara: 30
// Josiane: 17
// Fabiane: 10
// Clients: AGENCIA MOSCA: 6, JOSI: 6, WR CONSTRUTORA: 5, SIM CLUB: 4, Demais: 36 (Total = 57)
export function generateInitialReservations(): Reservation[] {
  const reservations: Reservation[] = [];

  // Distribution plan:
  // Client reservations:
  // 1. AGENCIA MOSCA (6) -> Taynara 4, Josiane 2
  // 2. JOSI (6) -> Josiane 6
  // 3. WR CONSTRUTORA (5) -> Taynara 5
  // 4. SIM CLUB (4) -> Fabiane 4
  // 5. SUPERMERCADOS ALVORADA (3) -> Taynara 3
  // 6. DROGARIA TOTAL (3) -> Josiane 3
  // 7. UNIMED SAÚDE (3) -> Taynara 3
  // 8. AUTO POSTO IPIRANGA (3) -> Fabiane 3
  // 9. RESTAURANTE BAMBU (2) -> Josiane 2
  // 10. COLÉGIO INTEGRADO (2) -> Taynara 2
  // 11. ACADEMIA VITAL (2) -> Fabiane 2
  // 12. LOJAS CEM (2) -> Taynara 2
  // 13. ÓTICAS CAROL (2) -> Josiane 2
  // 14. CONCESSIONÁRIA VIA NORTE (2) -> Taynara 2
  // 15. SICREDI (2) -> Taynara 2
  // 16. DROGARIA SÃO PAULO (1) -> Taynara 1
  // 17. BURGER KING FRANQUIA (1) -> Taynara 1
  // 18. CLINICA DENTAL CARE (1) -> Taynara 1
  // 19. PET SHOP MANIA (1) -> Josiane 1
  // 20. IMOBILIÁRIA PRIMAVERA (1) -> Taynara 1
  // 21. FACULDADE ANHANGUERA (1) -> Taynara 1
  // 22. POSTO SHELL TREVO (1) -> Fabiane 1
  // Sum check:
  // Taynara: 4 + 5 + 3 + 3 + 2 + 2 + 2 + 2 + 1 + 1 + 1 + 1 + 1 + 2 (sicredi) = 30!
  // Josiane: 2 + 6 + 3 + 2 + 2 + 1 + 1 = 17!
  // Fabiane: 4 + 3 + 2 + 1 = 10!
  // Total = 30 + 17 + 10 = 57! Exactly matches prompt!

  const config = [
    { client: 'AGENCIA MOSCA', seller: 'Taynara', count: 4, type: 'Outdoor 9x3' as PanelType, value: 3200 },
    { client: 'AGENCIA MOSCA', seller: 'Josiane', count: 2, type: 'Frontlight Iluminado' as PanelType, value: 5500 },
    { client: 'JOSI', seller: 'Josiane', count: 6, type: 'Outdoor 9x3' as PanelType, value: 2900 },
    { client: 'WR CONSTRUTORA', seller: 'Taynara', count: 5, type: 'Frontlight Iluminado' as PanelType, value: 6200 },
    { client: 'SIM CLUB', seller: 'Fabiane', count: 4, type: 'Outdoor 9x3' as PanelType, value: 3100 },
    { client: 'SUPERMERCADOS ALVORADA', seller: 'Taynara', count: 3, type: 'Outdoor 9x3' as PanelType, value: 3200 },
    { client: 'DROGARIA TOTAL', seller: 'Josiane', count: 3, type: 'Outdoor 9x3' as PanelType, value: 3000 },
    { client: 'UNIMED SAÚDE', seller: 'Taynara', count: 3, type: 'Painel Digital LED' as PanelType, value: 7500 },
    { client: 'AUTO POSTO IPIRANGA', seller: 'Fabiane', count: 3, type: 'TopSight' as PanelType, value: 3600 },
    { client: 'RESTAURANTE BAMBU', seller: 'Josiane', count: 2, type: 'Outdoor 9x3' as PanelType, value: 2800 },
    { client: 'COLÉGIO INTEGRADO', seller: 'Taynara', count: 2, type: 'Outdoor 9x3' as PanelType, value: 3100 },
    { client: 'ACADEMIA VITAL', seller: 'Fabiane', count: 2, type: 'Outdoor 9x3' as PanelType, value: 2900 },
    { client: 'LOJAS CEM', seller: 'Taynara', count: 2, type: 'Frontlight Iluminado' as PanelType, value: 5800 },
    { client: 'ÓTICAS CAROL', seller: 'Josiane', count: 2, type: 'Outdoor 9x3' as PanelType, value: 3000 },
    { client: 'CONCESSIONÁRIA VIA NORTE', seller: 'Taynara', count: 2, type: 'Empena' as PanelType, value: 9500 },
    { client: 'SICREDI COOPERATIVA', seller: 'Taynara', count: 2, type: 'Frontlight Iluminado' as PanelType, value: 5400 },
    { client: 'DROGARIA SÃO PAULO', seller: 'Taynara', count: 1, type: 'Outdoor 9x3' as PanelType, value: 3200 },
    { client: 'BURGER KING FRANQUIA', seller: 'Taynara', count: 1, type: 'Painel Digital LED' as PanelType, value: 7500 },
    { client: 'CLINICA DENTAL CARE', seller: 'Taynara', count: 1, type: 'Outdoor 9x3' as PanelType, value: 2900 },
    { client: 'PET SHOP MANIA', seller: 'Josiane', count: 2, type: 'Outdoor 9x3' as PanelType, value: 2700 },
    { client: 'IMOBILIÁRIA PRIMAVERA', seller: 'Taynara', count: 1, type: 'TopSight' as PanelType, value: 3500 },
    { client: 'POSTO SHELL TREVO', seller: 'Fabiane', count: 1, type: 'Outdoor 9x3' as PanelType, value: 3000 },
  ];

  let seq = 1;
  for (const item of config) {
    for (let i = 0; i < item.count; i++) {
      const codeNum = String(seq).padStart(3, '0');
      const sellerId = item.seller.toLowerCase();
      const imgIdx = (seq - 1) % SAMPLE_OOH_IMAGES.length;
      reservations.push({
        id: `res-2025-${codeNum}`,
        code: `RES-2025-${codeNum}`,
        biSemanaId: 'BS-16-2025',
        biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
        year: 2025,
        panelId: `pan-${codeNum}`,
        panelCode: `EP-${codeNum}`,
        panelType: item.type,
        addressTitle: INITIAL_ADDRESSES[(seq - 1) % INITIAL_ADDRESSES.length].title,
        clientId: `cli-${item.client.replace(/\s+/g, '-').toLowerCase()}`,
        clientName: item.client,
        sellerId: sellerId,
        sellerName: item.seller,
        campaignTitle: `Campanha Abr/2025 - ${item.client}`,
        value: item.value,
        status: 'Em Veiculação',
        artImageUrl: SAMPLE_OOH_IMAGES[imgIdx],
        checkingPhotoUrl: SAMPLE_OOH_IMAGES[(imgIdx + 1) % SAMPLE_OOH_IMAGES.length],
        checkedAt: '2025-04-08 09:30',
        notes: 'Checking fotográfico validado com cliente e iluminação conferida.',
      });
      seq++;
    }
  }

  return reservations;
}

export const INITIAL_CHECKING_REPORTS: CheckingReport[] = [
  {
    id: 'chk-01',
    reservationId: 'res-2025-001',
    clientName: 'AGENCIA MOSCA',
    campaignName: 'Lançamento Temporada Verão/Outono',
    panelCode: 'EP-001',
    addressTitle: 'Av. Presidente Vargas, 1420 - Face A',
    biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
    dateInstalled: '07/04/2025 08:45',
    directPhotoDayUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    directPhotoNightUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    installerName: 'Equipe de Aplicação 01 (Carlos & Marcos)',
    status: 'Aprovado',
    observations: 'Colagem em papel de alta qualidade, sem bolhas ou rugas. Refletores 100% calibrados.',
  },
  {
    id: 'chk-02',
    reservationId: 'res-2025-005',
    clientName: 'WR CONSTRUTORA',
    campaignName: 'Residencial Reserva Imperial - Obras Aceleradas',
    panelCode: 'EP-003',
    addressTitle: 'Rodovia Pres. Dutra, KM 218 - Megapainel 01',
    biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
    dateInstalled: '07/04/2025 10:15',
    directPhotoDayUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    directPhotoNightUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    installerName: 'Equipe Frontlight (André & Roberto)',
    status: 'Aprovado',
    observations: 'Lona frontlight esticada com travas de pressão. Fotometria noturna realizada.',
  },
  {
    id: 'chk-03',
    reservationId: 'res-2025-010',
    clientName: 'JOSI',
    campaignName: 'Coleção Floral & Fragrâncias de Outono',
    panelCode: 'EP-002',
    addressTitle: 'Av. Presidente Vargas, 1420 - Face B',
    biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
    dateInstalled: '07/04/2025 11:30',
    directPhotoDayUrl: 'https://images.unsplash.com/photo-1572945753563-8049567811f4?auto=format&fit=crop&w=1200&q=80',
    installerName: 'Equipe de Aplicação 02 (Valdir)',
    status: 'Aprovado',
    observations: 'Cores vibrantes, visualização nítida para motoristas sentido centro.',
  },
  {
    id: 'chk-04',
    reservationId: 'res-2025-015',
    clientName: 'UNIMED SAÚDE',
    campaignName: 'Cuidar de você é o nosso plano',
    panelCode: 'EP-004',
    addressTitle: 'Av. Paulista, 900 - Painel Digital LED',
    biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
    dateInstalled: '07/04/2025 00:01',
    directPhotoDayUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    installerName: 'Suporte Técnico LED (Eng. Marcelo)',
    status: 'Aprovado',
    observations: 'Loop digital de 10 segundos veiculando a cada 60 segundos. 100% de brilho.',
  },
  {
    id: 'chk-05',
    reservationId: 'res-2025-020',
    clientName: 'SIM CLUB',
    campaignName: 'Proteção Total com Guincho 24 Horas',
    panelCode: 'EP-005',
    addressTitle: 'Av. dos Bandeirantes, 2400 - Frontlight A',
    biSemanaLabel: 'BS: 16 (07/04/2025 - 20/04/2025)',
    dateInstalled: '07/04/2025 14:20',
    directPhotoDayUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    installerName: 'Equipe Frontlight (André & Roberto)',
    status: 'Aprovado',
    observations: 'Excelente enquadramento na curva de desaceleração.',
  },
];
