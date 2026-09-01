export interface BiSemana {
  id: string; // e.g. "BS-16-2025"
  number: number; // 16
  year: number; // 2025
  label: string; // "BS: 16 (07/04/2025 - 20/04/2025)"
  startDate: string; // "2025-04-07"
  endDate: string; // "2025-04-20"
}

export interface Seller {
  id: string;
  name: string;
  initial: string;
  color: string; // hex
  bgColor: string; // tailwind class
  textColor: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  commissionRate: number; // percentage, e.g. 5%
}

export interface Client {
  id: string;
  name: string;
  tradeName?: string; // Nome fantasia
  cnpj: string;
  segment: string;
  contactName: string;
  email: string;
  phone: string;
  preferredSellerId: string;
  status: 'Ativo' | 'Inativo' | 'Potencial';
  totalReservas: number;
}

export type PanelType = 'Outdoor 9x3' | 'Frontlight Iluminado' | 'Painel Digital LED' | 'TopSight' | 'Empena';

export interface AddressLocation {
  id: string;
  code: string; // e.g. "END-012"
  title: string; // e.g. "Av. Presidente Vargas, 1420"
  neighborhood: string; // "Centro"
  city: string; // "São Paulo - SP"
  reference: string; // "Próximo ao Shopping Plaza"
  coordinates: { lat: number; lng: number };
  dailyTraffic: number; // visualizações estimadas/dia
  directImageUrl: string; // direct photo link
  directNightImageUrl?: string;
  panelsCount: number;
  featured: boolean;
}

export interface Panel {
  id: string;
  code: string; // e.g. "OUT-101"
  addressId: string;
  addressTitle: string;
  neighborhood: string;
  city: string;
  type: PanelType;
  dimensions: string; // "9.00 x 3.00m"
  lighting: 'Iluminado' | 'Sem Iluminação' | 'Digital LED 24h';
  dailyViews: number;
  pricePerBS: number; // R$ valor tabela
  directImageUrl: string;
  latitude: number;
  longitude: number;
  status: 'Disponível' | 'Reservado' | 'Em Veiculação' | 'Manutenção';
}

export interface Reservation {
  id: string;
  code: string; // e.g. "RES-2025-089"
  biSemanaId: string;
  biSemanaLabel: string;
  year: number;
  panelId: string;
  panelCode: string;
  panelType: PanelType;
  addressTitle: string;
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  campaignTitle: string;
  value: number;
  status: 'Confirmada' | 'Em Veiculação' | 'Concluída' | 'Pendente Material' | 'Cancelada';
  artImageUrl?: string; // Direct link to advertising artwork
  checkingPhotoUrl?: string; // Direct link to installed photo
  checkedAt?: string;
  notes?: string;
}

export interface CheckingReport {
  id: string;
  reservationId: string;
  clientName: string;
  campaignName: string;
  panelCode: string;
  addressTitle: string;
  biSemanaLabel: string;
  dateInstalled: string;
  directPhotoDayUrl: string;
  directPhotoNightUrl?: string;
  installerName: string;
  status: 'Aprovado' | 'Aguardando Aprovação' | 'Necessita Reparo';
  observations: string;
}
