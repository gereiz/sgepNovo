'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ZoomIn, ZoomOut, Image as ImageIcon, MapPin, Calendar, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DirectImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  location?: string;
  client?: string;
  seller?: string;
  biSemana?: string;
  nightImageUrl?: string;
}

export function DirectImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  location,
  client,
  seller,
  biSemana,
  nightImageUrl,
}: DirectImageViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<'day' | 'night'>('day');

  const currentImg = mode === 'night' && nightImageUrl ? nightImageUrl : imageUrl;

  const handleCopyLink = () => {
    const linkToCopy = mode === 'night' && nightImageUrl ? nightImageUrl : currentImg;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleDayNight = (selectedMode: 'day' | 'night') => {
    setMode(selectedMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-800 bg-slate-900 text-white flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#006397]/40 text-sky-300">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-semibold text-lg text-white leading-tight">{title}</DialogTitle>
              {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 pr-6">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyLink}
              className="h-8 text-xs bg-slate-800 hover:bg-slate-700 text-white border-0"
              title="Copiar link direto da imagem"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
            </Button>
            <a
              href={currentImg}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Abrir imagem em nova aba"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200 gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600 flex-wrap">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#006397]" />
                {location}
              </span>
            )}
            {client && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#ab2c5d]" />
                Cliente: <strong className="text-slate-900">{client}</strong>
              </span>
            )}
            {biSemana && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#006874]" />
                {biSemana}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {nightImageUrl && (
              <div className="flex bg-slate-200/80 rounded-lg p-0.5 border border-slate-300">
                <button
                  onClick={() => handleToggleDayNight('day')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'day' ? 'bg-[#006397] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ☀️ Diurno
                </button>
                <button
                  onClick={() => handleToggleDayNight('night')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === 'night' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌙 Noturno
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200 shadow-xs">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.25))}
                className="h-7 w-7 text-slate-600"
                title="Reduzir zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <span className="px-1 text-[11px] font-mono text-slate-700">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.25))}
                className="h-7 w-7 text-slate-600"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-1 bg-slate-950 overflow-auto flex items-center justify-center p-4 min-h-[350px] max-h-[60vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImg}
            alt={title}
            className="max-h-[55vh] w-auto object-contain rounded-lg shadow-2xl transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Footer with Direct Link Box */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Link Direto:
            </span>
            <Input
              type="text"
              readOnly
              value={currentImg}
              className="w-full text-xs font-mono bg-white h-8 select-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              onClick={handleCopyLink}
              className="bg-[#006397] hover:bg-[#004f7a] text-xs h-8"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copiado!' : 'Copiar URL'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="text-xs h-8"
            >
              Fechar
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
