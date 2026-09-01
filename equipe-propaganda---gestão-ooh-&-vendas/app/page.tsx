'use client';

import React, { useState } from 'react';
import { Navbar, NavTab } from '@/components/Navbar';
import { SalesOverview } from '@/components/SalesOverview';
import { EnderecosView } from '@/components/EnderecosView';
import { PaineisView } from '@/components/PaineisView';
import { ClientesView } from '@/components/ClientesView';
import { VendasView } from '@/components/VendasView';
import { ArquivosCheckingView } from '@/components/ArquivosCheckingView';
import { RelatoriosView } from '@/components/RelatoriosView';
import { FinanceiroView } from '@/components/FinanceiroView';
import { DirectImageViewerModal } from '@/components/DirectImageViewerModal';
import { NewReservationModal } from '@/components/NewReservationModal';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { SettingsModal } from '@/components/SettingsModal';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import {
  BI_SEMANAS,
  INITIAL_SELLERS,
  INITIAL_CLIENTS,
  INITIAL_ADDRESSES,
  INITIAL_PANELS,
  generateInitialReservations,
  INITIAL_CHECKING_REPORTS,
  SAMPLE_OOH_IMAGES,
} from '@/lib/mock-data';
import { AddressLocation, CheckingReport, Client, Panel, Reservation } from '@/lib/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('vendas');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [currentBiSemana, setCurrentBiSemana] = useState(BI_SEMANAS[2]); // BS 16 (07/04/2025 - 20/04/2025)

  // System state
  const [sellers] = useState(INITIAL_SELLERS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [addresses, setAddresses] = useState<AddressLocation[]>(INITIAL_ADDRESSES);
  const [panels, setPanels] = useState<Panel[]>(INITIAL_PANELS);
  const [reservations, setReservations] = useState<Reservation[]>(generateInitialReservations());
  const [checkingReports, setCheckingReports] = useState<CheckingReport[]>(INITIAL_CHECKING_REPORTS);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);

  // Direct image viewer modal state
  const [imageViewerData, setImageViewerData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    subtitle?: string;
    location?: string;
    client?: string;
    seller?: string;
    biSemana?: string;
    nightImageUrl?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  // Handler to open image viewer for any item
  const handleOpenImageViewer = (params: {
    imageUrl: string;
    title: string;
    subtitle?: string;
    location?: string;
    client?: string;
    seller?: string;
    biSemana?: string;
    nightImageUrl?: string;
  }) => {
    setImageViewerData({
      isOpen: true,
      ...params,
    });
  };

  // Handler for address image click
  const handleAddressImageClick = (addr: AddressLocation) => {
    handleOpenImageViewer({
      imageUrl: addr.directImageUrl,
      nightImageUrl: addr.directNightImageUrl,
      title: `${addr.code} - ${addr.title}`,
      subtitle: `${addr.neighborhood}, ${addr.city}`,
      location: addr.reference,
    });
  };

  // Handler for panel image click
  const handlePanelImageClick = (panel: Panel) => {
    handleOpenImageViewer({
      imageUrl: panel.directImageUrl,
      title: `${panel.code} (${panel.type})`,
      subtitle: panel.addressTitle,
      location: `${panel.neighborhood}, ${panel.city}`,
    });
  };

  // Handler for reservation image click
  const handleReservationImageClick = (res: Reservation) => {
    handleOpenImageViewer({
      imageUrl: res.checkingPhotoUrl || res.artImageUrl || SAMPLE_OOH_IMAGES[0],
      title: `${res.code} - ${res.clientName}`,
      subtitle: res.campaignTitle,
      location: res.addressTitle,
      client: res.clientName,
      seller: res.sellerName,
      biSemana: res.biSemanaLabel,
    });
  };

  // Handler for checking report image click
  const handleReportImageClick = (report: CheckingReport) => {
    handleOpenImageViewer({
      imageUrl: report.directPhotoDayUrl,
      nightImageUrl: report.directPhotoNightUrl,
      title: `Checking: ${report.panelCode} - ${report.clientName}`,
      subtitle: report.campaignName,
      location: report.addressTitle,
      client: report.clientName,
      biSemana: report.biSemanaLabel,
    });
  };

  // Handlers to create new entities
  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
  };

  const handleAddAddress = (newAddr: AddressLocation) => {
    setAddresses((prev) => [newAddr, ...prev]);
  };

  const handleAddPanel = (newPanel: Panel) => {
    setPanels((prev) => [newPanel, ...prev]);
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleAddReport = (newReport: CheckingReport) => {
    setCheckingReports((prev) => [newReport, ...prev]);
  };

  // Navigation from Global Search
  const handleSearchResultSelect = (type: 'address' | 'panel' | 'client' | 'reservation', item: any) => {
    if (type === 'address') {
      setActiveTab('enderecos');
      handleAddressImageClick(item);
    } else if (type === 'panel') {
      setActiveTab('paineis');
      handlePanelImageClick(item);
    } else if (type === 'client') {
      setActiveTab('clientes');
    } else if (type === 'reservation') {
      setActiveTab('vendas');
      handleReservationImageClick(item);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low font-sans text-on-surface flex flex-col selection:bg-primary selection:text-white">
      
      {/* Top Fixed Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsNotificationsOpen(false);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen((prev) => !prev)}
        notificationCount={3}
      />

      {/* Notifications Dropdown */}
      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectNotification={(id) => {
          if (id === '1') setActiveTab('arquivos');
          if (id === '2') setActiveTab('vendas');
        }}
      />

      {/* Main Screen Body */}
      <main className="relative pt-14 w-full flex-1">
        {activeTab === 'vendas' && (
          <SalesOverview
            biSemanas={BI_SEMANAS}
            currentBiSemana={currentBiSemana}
            onSelectBiSemana={setCurrentBiSemana}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            sellers={sellers}
            reservations={reservations}
            onOpenNewReservation={() => setIsNewReservationOpen(true)}
            onOpenImageGallery={() => setActiveTab('enderecos')}
            onViewSellerDetails={(sellerId) => {
              setActiveTab('vendas');
            }}
          />
        )}

        {activeTab === 'enderecos' && (
          <EnderecosView
            addresses={addresses}
            onOpenImageViewer={handleAddressImageClick}
            onAddAddress={handleAddAddress}
          />
        )}

        {activeTab === 'paineis' && (
          <PaineisView
            panels={panels}
            onOpenImageViewer={handlePanelImageClick}
            onAddPanel={handleAddPanel}
            onQuickBook={(panel) => setIsNewReservationOpen(true)}
          />
        )}

        {activeTab === 'clientes' && (
          <ClientesView
            clients={clients}
            sellers={sellers}
            onAddClient={handleAddClient}
            onSelectClientForBooking={(client) => setIsNewReservationOpen(true)}
          />
        )}

        {activeTab === 'arquivos' && (
          <ArquivosCheckingView
            reports={checkingReports}
            onOpenImageViewer={handleReportImageClick}
            onAddReport={handleAddReport}
          />
        )}

        {activeTab === 'relatorios' && (
          <RelatoriosView
            reservations={reservations}
            sellers={sellers}
            currentBiSemana={currentBiSemana}
          />
        )}

        {activeTab === 'financeiro' && (
          <FinanceiroView
            reservations={reservations}
            sellers={sellers}
            currentBiSemana={currentBiSemana}
          />
        )}
      </main>

      {/* Direct Image Viewer Modal (Full preview with direct links and zoom) */}
      <DirectImageViewerModal
        isOpen={imageViewerData.isOpen}
        onClose={() => setImageViewerData((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={imageViewerData.imageUrl}
        title={imageViewerData.title}
        subtitle={imageViewerData.subtitle}
        location={imageViewerData.location}
        client={imageViewerData.client}
        seller={imageViewerData.seller}
        biSemana={imageViewerData.biSemana}
        nightImageUrl={imageViewerData.nightImageUrl}
      />

      {/* New Reservation Booking Modal */}
      <NewReservationModal
        isOpen={isNewReservationOpen}
        onClose={() => setIsNewReservationOpen(false)}
        biSemanas={BI_SEMANAS}
        clients={clients}
        panels={panels}
        sellers={sellers}
        currentBiSemanaId={currentBiSemana.id}
        onSaveReservation={handleAddReservation}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        addresses={addresses}
        panels={panels}
        clients={clients}
        reservations={reservations}
        onSelectResult={handleSearchResultSelect}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}
