'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  UserCheck,
  Tag,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { Client, Seller } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ClientesViewProps {
  clients: Client[];
  sellers: Seller[];
  onAddClient: (newClient: Client) => void;
  onSelectClientForBooking: (client: Client) => void;
}

export function ClientesView({
  clients,
  sellers,
  onAddClient,
  onSelectClientForBooking,
}: ClientesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New client form
  const [newName, setNewName] = useState('');
  const [newTradeName, setNewTradeName] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  const [newSegment, setNewSegment] = useState('Varejo & Comércio');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSellerId, setNewSellerId] = useState('taynara');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.tradeName && c.tradeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeller = selectedSeller === 'all' || c.preferredSellerId === selectedSeller;
    return matchesSearch && matchesSeller;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newC: Client = {
      id: `cli-${Date.now()}`,
      name: newName.toUpperCase(),
      tradeName: newTradeName || newName,
      cnpj: newCnpj || '00.000.000/0001-00',
      segment: newSegment,
      contactName: newContact,
      email: newEmail,
      phone: newPhone,
      preferredSellerId: newSellerId,
      status: 'Ativo',
      totalReservas: 1,
    };
    onAddClient(newC);
    setIsAddModalOpen(false);
    setNewName('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
  };

  const getSellerName = (sellerId: string) => {
    const s = sellers.find((x) => x.id === sellerId);
    return s ? s.name : 'Taynara';
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-16">
      
      {/* Header */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-14 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-9 bg-[#ab2c5d] rounded-full" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Clientes e Agências de Publicidade
            </h1>
            <p className="text-xs text-slate-500">
              Gestão da carteira de anunciantes, agências parceiras e histórico de veiculação
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#ab2c5d] hover:bg-[#8e244d] shadow-xs text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Cliente</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="px-4 md:px-8 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por razão social, nome fantasia ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Vendedor:</span>
          <div className="w-56">
            <Select value={selectedSeller} onValueChange={(val) => setSelectedSeller(val)}>
              <SelectTrigger className="h-9 bg-white">
                <SelectValue placeholder="Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Vendedores ({clients.length})</SelectItem>
                {sellers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 max-w-[1440px] mx-auto w-full">
        {filteredClients.map((client) => {
          const sellerName = getSellerName(client.preferredSellerId);
          return (
            <Card
              key={client.id}
              className="hover:shadow-md transition-shadow flex flex-col justify-between border-slate-200"
            >
              <CardContent className="p-5 flex flex-col justify-between gap-4 h-full">
                <div>
                  {/* Header with initial avatar and badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ab2c5d]/10 flex items-center justify-center font-bold text-[#ab2c5d] text-base">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{client.name}</h3>
                        <p className="text-[11px] text-slate-500">{client.tradeName || client.segment}</p>
                      </div>
                    </div>
                    <Badge variant="success">
                      {client.status}
                    </Badge>
                  </div>

                  {/* Segment & CNPJ */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#006397]" />
                      <span>{client.segment}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Building className="w-3.5 h-3.5 text-[#ab2c5d]" />
                      <span>CNPJ: {client.cnpj}</span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#006397]" />
                      <span>{client.contactName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#ab2c5d]" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Seller & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-medium block">Atendimento:</span>
                    <span
                      className={`text-xs font-bold ${
                        sellerName === 'Taynara'
                          ? 'text-[#006397]'
                          : sellerName === 'Josiane'
                          ? 'text-[#ab2c5d]'
                          : 'text-[#835500]'
                      }`}
                    >
                      {sellerName}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectClientForBooking(client)}
                    className="h-7 text-xs text-[#ab2c5d] border-[#ab2c5d]/30 hover:bg-[#ab2c5d] hover:text-white"
                  >
                    <span>Reservar Painel</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Client Modal using shadcn Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Users className="w-5 h-5 text-[#ab2c5d]" />
              Cadastrar Anunciante / Agência
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Razão Social / Nome da Empresa
              </label>
              <Input
                type="text"
                placeholder="Ex: LOJAS AMERICANAS S.A."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Nome Fantasia
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Lojas Americanas"
                  value={newTradeName}
                  onChange={(e) => setNewTradeName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  CNPJ / CPF
                </label>
                <Input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={newCnpj}
                  onChange={(e) => setNewCnpj(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Segmento
                </label>
                <Input
                  type="text"
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Vendedor Responsável
                </label>
                <Select value={newSellerId} onValueChange={(val) => setNewSellerId(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800">Dados de Contato Comercial</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Contato</label>
                  <Input
                    type="text"
                    placeholder="Nome do contato"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">E-mail</label>
                  <Input
                    type="email"
                    placeholder="contato@empresa.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Telefone</label>
                  <Input
                    type="text"
                    placeholder="(11) 9999-9999"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#ab2c5d] hover:bg-[#8e244d] text-white"
              >
                Salvar Anunciante
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
