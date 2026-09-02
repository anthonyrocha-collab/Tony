import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Save,
  RotateCcw,
  Sliders,
  MessageSquare,
  Eye,
} from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { ThemeConfig } from '../../types';
import { DEFAULT_THEME, THEME_PRESETS, TYPOGRAPHY_PRESETS, GRID_PRESETS } from '../../utils/defaults';
import { PORTFOLIO_ICON_OPTIONS } from '../../utils/icons';
import { checkContrast } from '../../utils/contrast';
import { applyThemeToDOM } from '../../services/theme';

export const AdminAppearanceTab: React.FC = () => {
  const { settings, updateTheme, showToast } = usePortfolio();
  const [theme, setTheme] = useState<ThemeConfig>(settings.theme_config || DEFAULT_THEME);
  const [isSaving, setIsSaving] = useState(false);

  // Cálculos de Contraste WCAG 2.2 AA em tempo real
  const bgTextContrast = checkContrast(theme.colors.textPrimary, theme.colors.background);
  const surfaceTextContrast = checkContrast(theme.colors.textPrimary, theme.colors.surface);
  const primaryBgContrast = checkContrast(theme.colors.primary, theme.colors.background);

  const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    const nextTheme: ThemeConfig = {
      ...theme,
      colors: { ...theme.colors, [key]: value },
    };
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme); // Live preview imediato
  };

  const handleTypographyChange = (key: keyof ThemeConfig['typography'], value: any) => {
    const nextTheme: ThemeConfig = {
      ...theme,
      typography: { ...theme.typography, [key]: value },
    };
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme);
  };

  const handleShapeChange = (key: keyof ThemeConfig['shape'], value: any) => {
    const nextTheme: ThemeConfig = {
      ...theme,
      shape: { ...theme.shape, [key]: value },
    };
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme);
  };

  const handleLayoutChange = (key: keyof ThemeConfig['layout'], value: any) => {
    const nextTheme: ThemeConfig = {
      ...theme,
      layout: { ...theme.layout, [key]: value },
    };
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme);
  };

  const handleMotionChange = (key: keyof ThemeConfig['motion'], value: any) => {
    const nextTheme: ThemeConfig = {
      ...theme,
      motion: { ...theme.motion, [key]: value },
    };
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme);
  };

  const handleUxWritingChange = (key: keyof ThemeConfig['uxWriting'], value: string) => {
    const nextTheme: ThemeConfig = {
      ...theme,
      uxWriting: { ...theme.uxWriting, [key]: value },
    };
    setTheme(nextTheme);
  };

  const applyPreset = (presetTheme: Partial<ThemeConfig>) => {
    const merged: ThemeConfig = {
      ...theme,
      ...presetTheme,
      colors: { ...theme.colors, ...(presetTheme.colors || {}) },
      shape: { ...theme.shape, ...(presetTheme.shape || {}) },
      typography: { ...theme.typography, ...(presetTheme.typography || {}) },
    };
    setTheme(merged);
    applyThemeToDOM(merged);
    showToast('info', 'Preset aplicado para visualização!');
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      await updateTheme(theme);
    } catch (err: any) {
      showToast('error', 'Erro ao salvar tema', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setTheme(DEFAULT_THEME);
    applyThemeToDOM(DEFAULT_THEME);
    showToast('info', 'Valores restaurados para o padrão.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Topo do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div>
          <h2 className="text-xl font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Design System & Aparência Autoral</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Personalize cores, tipografia, grid, formas e tom de voz persistidos como tokens dinâmicos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 min-h-[44px] shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Design System'}</span>
          </button>
        </div>
      </div>

      {/* Seletor de Presets Rápidos */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Presets de Identidade Visual para Exploração</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.theme)}
              className="p-4 text-left rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer space-y-2 group focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.theme.colors?.primary || '#3b82f6' }}
                />
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: preset.theme.colors?.background || '#0d0f14' }}
                />
                <span className="font-bold text-xs text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                  {preset.name}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Auditoria de Contraste WCAG 2.2 AA em Tempo Real */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)] flex items-center gap-2">
          {bgTextContrast.normalTextPass && surfaceTextContrast.normalTextPass ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          )}
          <span>Auditoria de Contraste WCAG 2.2 AA em Tempo Real</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contraste Texto / Fundo */}
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Texto Principal / Fundo</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  bgTextContrast.normalTextPass
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {bgTextContrast.level} ({bgTextContrast.formattedRatio})
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {bgTextContrast.normalTextPass
                ? 'Conforme com o critério WCAG AA (>= 4.5:1).'
                : 'Atenção: Aumente o contraste entre a cor do texto e o fundo.'}
            </p>
          </div>

          {/* Contraste Texto / Superfície */}
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Texto / Superfície (Cards)</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  surfaceTextContrast.normalTextPass
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {surfaceTextContrast.level} ({surfaceTextContrast.formattedRatio})
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {surfaceTextContrast.normalTextPass
                ? 'Conforme com o critério WCAG AA (>= 4.5:1).'
                : 'Atenção: Contraste insuficiente dentro dos cards de conteúdo.'}
            </p>
          </div>

          {/* Contraste Cor Primária / Fundo */}
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Primária (Botões) / Fundo</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  primaryBgContrast.uiComponentPass
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {primaryBgContrast.uiComponentPass ? 'Passou' : 'Alerta'} ({primaryBgContrast.formattedRatio})
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {primaryBgContrast.uiComponentPass
                ? 'Visibilidade adequada para botões e componentes interativos (>= 3.0:1).'
                : 'Pode apresentar dificuldade de identificação para pessoas com baixa visão.'}
            </p>
          </div>
        </div>
      </section>

      {/* 1. PALETA DE CORES */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)]">
          1. Paleta de Cores & Tokens Cromáticos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(theme.colors).map(([key, val]) => (
            <div key={key} className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
              <label htmlFor={`color-token-${key}`} className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] truncate">
                {key}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id={`color-token-${key}`}
                  value={val}
                  onChange={(e) => handleColorChange(key as any, e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 cursor-pointer shrink-0 bg-transparent"
                />
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleColorChange(key as any, e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TIPOGRAFIA */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
          <Type className="w-5 h-5 text-[var(--color-primary)]" />
          <span>2. Tipografia & Escala Harmônica</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="admin-font-title" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Fonte dos Títulos (Headings)
            </label>
            <select
              id="admin-font-title"
              value={theme.typography.titleFont}
              onChange={(e) => handleTypographyChange('titleFont', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              {TYPOGRAPHY_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.titleFont}>{preset.name}</option>
              ))}
              <option value="system-ui, -apple-system, sans-serif">System UI</option>
            </select>
            <input
              aria-label="Fonte personalizada dos títulos"
              value={theme.typography.titleFont}
              onChange={(e) => handleTypographyChange('titleFont', e.target.value)}
              placeholder="Ou digite sua fonte: Nome da Fonte, sans-serif"
              className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-font-body" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Fonte do Corpo do Texto (Body)
            </label>
            <select
              id="admin-font-body"
              value={theme.typography.bodyFont}
              onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              {TYPOGRAPHY_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.bodyFont}>{preset.name}</option>
              ))}
              <option value="Georgia, serif">Georgia</option>
            </select>
            <input
              aria-label="Fonte personalizada do corpo"
              value={theme.typography.bodyFont}
              onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
              placeholder="Ou digite sua fonte: Nome da Fonte, sans-serif"
              className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-font-size" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Tamanho Base da Fonte ({theme.typography.baseFontSize}px)
            </label>
            <input
              type="range"
              id="admin-font-size"
              min="14"
              max="20"
              step="1"
              value={theme.typography.baseFontSize}
              onChange={(e) => handleTypographyChange('baseFontSize', parseInt(e.target.value))}
              className="w-full h-2 rounded bg-[var(--color-bg)] accent-[var(--color-primary)] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-font-scale" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Razão da Escala Tipográfica ({theme.typography.scaleRatio})
            </label>
            <select
              id="admin-font-scale"
              value={theme.typography.scaleRatio}
              onChange={(e) => handleTypographyChange('scaleRatio', parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="1.125">1.125 — Major Second (Compacto)</option>
              <option value="1.200">1.200 — Minor Third</option>
              <option value="1.250">1.250 — Major Third (Harmônico / Padrão)</option>
              <option value="1.333">1.333 — Perfect Fourth (Alto Contraste)</option>
              <option value="1.414">1.414 — Augmented Fourth (Expressivo)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-title-weight" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Peso dos Títulos ({theme.typography.titleWeight || 700})</label>
            <select id="admin-title-weight" value={theme.typography.titleWeight || 700} onChange={(e) => handleTypographyChange('titleWeight', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="400">400 — Regular</option><option value="500">500 — Medium</option><option value="600">600 — Semibold</option><option value="700">700 — Bold</option><option value="800">800 — Extra Bold</option><option value="900">900 — Black</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-line-height" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Altura de Linha ({theme.typography.bodyLineHeight || 1.6})</label>
            <select id="admin-line-height" value={theme.typography.bodyLineHeight || 1.6} onChange={(e) => handleTypographyChange('bodyLineHeight', parseFloat(e.target.value))} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="1.3">1.3 — Compacta</option><option value="1.5">1.5 — Legível</option><option value="1.6">1.6 — Equilibrada</option><option value="1.8">1.8 — Editorial</option><option value="2">2.0 — Muito aberta</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-letter-spacing" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Tracking dos Headings</label>
            <select id="admin-letter-spacing" value={theme.typography.headingLetterSpacing || '-0.02em'} onChange={(e) => handleTypographyChange('headingLetterSpacing', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="-0.04em">-0.04em — Apertado</option><option value="-0.02em">-0.02em — Sutil</option><option value="0em">0em — Neutro</option><option value="0.02em">0.02em — Aberto</option><option value="0.05em">0.05em — Expressivo</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. FORMAS, BORDAS E SOMBRAS */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
          <span>3. Formas, Border Radius & Sombras</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="admin-radius" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Raio dos Cantos (Border Radius: {theme.shape.borderRadius})
            </label>
            <select
              id="admin-radius"
              value={theme.shape.borderRadius}
              onChange={(e) => handleShapeChange('borderRadius', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="0px">0px (Totalmente Reto / Brutalista)</option>
              <option value="6px">6px (Levemente Arredondado)</option>
              <option value="12px">12px (Moderado / Padrão)</option>
              <option value="16px">16px (Acentuado)</option>
              <option value="24px">24px (Muito Arredondado / Orgânico)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-border-width" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Espessura da Borda
            </label>
            <select
              id="admin-border-width"
              value={theme.shape.borderWidth}
              onChange={(e) => handleShapeChange('borderWidth', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="0px">0px (Sem borda visível)</option>
              <option value="1px">1px (Linha sutil)</option>
              <option value="2px">2px (Borda marcada)</option>
              <option value="3px">3px (Borda grossa expressiva)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-shadow" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Nível de Sombra
            </label>
            <select
              id="admin-shadow"
              value={theme.shape.shadowLevel}
              onChange={(e) => handleShapeChange('shadowLevel', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="none">Nenhuma (Plano)</option>
              <option value="small">Pequena (Sutil)</option>
              <option value="medium">Média (Equilibrada)</option>
              <option value="large">Grande (Profundidade)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. LAYOUT & GRID */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
          <Layout className="w-5 h-5 text-[var(--color-primary)]" />
          <span>4. Layout & Grid Estrutural</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="admin-max-w" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Largura Máxima do Container
            </label>
            <select
              id="admin-max-w"
              value={theme.layout.maxContainerWidth}
              onChange={(e) => handleLayoutChange('maxContainerWidth', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="1024px">1024px (Compacto & Focado)</option>
              <option value="1200px">1200px (Padrão Equilibrado)</option>
              <option value="1440px">1440px (Amplo & Editorial)</option>
              <option value="100%">100% (Fluido Total)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-grid-columns" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Colunas do Grid ({theme.layout.gridColumns})</label>
            <select id="admin-grid-columns" value={theme.layout.gridColumns} onChange={(e) => handleLayoutChange('gridColumns', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              {GRID_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.columns}>{preset.name} — {preset.columns} coluna{preset.columns > 1 ? 's' : ''}</option>
              ))}
            </select>
            <input
              type="number" min="1" max="12" step="1"
              aria-label="Número personalizado de colunas"
              value={theme.layout.gridColumns}
              onChange={(e) => handleLayoutChange('gridColumns', Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)]"
            />
            <p className="text-[11px] text-[var(--color-text-secondary)]">Você pode adicionar novos presets em <code>src/utils/defaults.ts</code> ou usar qualquer valor personalizado de 1 a 12 colunas.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-card-gap" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Espaçamento entre Cards ({theme.layout.cardGap})</label>
            <select id="admin-card-gap" value={theme.layout.cardGap} onChange={(e) => handleLayoutChange('cardGap', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="0.75rem">0.75rem — Compacto</option><option value="1rem">1rem — Próximo</option><option value="1.5rem">1.5rem — Padrão</option><option value="2rem">2rem — Respirado</option><option value="3rem">3rem — Editorial</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-card-ratio" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Proporção das Imagens</label>
            <select id="admin-card-ratio" value={theme.layout.cardAspectRatio || '16 / 10'} onChange={(e) => handleLayoutChange('cardAspectRatio', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="1 / 1">1:1 — Quadrada</option><option value="4 / 3">4:3 — Clássica</option><option value="16 / 10">16:10 — Padrão</option><option value="16 / 9">16:9 — Cinemática</option><option value="3 / 2">3:2 — Fotográfica</option><option value="21 / 9">21:9 — Ultra-wide</option>
            </select>
          </div>


          <div className="space-y-1.5">
            <label htmlFor="admin-motion-dur" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Velocidade das Transições (Motion: {theme.motion.duration})
            </label>
            <select
              id="admin-motion-dur"
              value={theme.motion.duration}
              onChange={(e) => handleMotionChange('duration', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="0.15s">0.15s (Rápido / Snappy)</option>
              <option value="0.3s">0.3s (Equilibrado)</option>
              <option value="0.5s">0.5s (Suave & Dramático)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-card-hover" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Hover dos Cards</label>
            <select id="admin-card-hover" value={theme.motion.cardHover || 'lift'} onChange={(e) => handleMotionChange('cardHover', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="lift">Elevar</option><option value="scale">Ampliar</option><option value="glow">Glow / foco</option><option value="none">Nenhum</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-image-hover" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Hover das Imagens</label>
            <select id="admin-image-hover" value={theme.motion.imageHover || 'zoom'} onChange={(e) => handleMotionChange('imageHover', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="zoom">Zoom</option><option value="pan">Pan suave</option><option value="none">Nenhum</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-button-hover" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Microinteração dos Botões</label>
            <select id="admin-button-hover" value={theme.motion.buttonHover || 'lift'} onChange={(e) => handleMotionChange('buttonHover', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="lift">Elevar</option><option value="press">Press / toque</option><option value="none">Nenhum</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-entrance" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Entrada dos Cards</label>
            <select id="admin-entrance" value={theme.motion.entrance || 'fade'} onChange={(e) => handleMotionChange('entrance', e.target.value)} className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]">
              <option value="fade">Fade + subida</option><option value="slide">Slide</option><option value="none">Nenhuma</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. ÍCONES AUTORAIS CONFIGURÁVEIS */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          <span>5. Ícones & Sistema de Símbolos</span>
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)]">Escolha os ícones usados em pontos-chave do portfólio. Para adicionar novos ícones, inclua o componente no registro em <code>src/utils/icons.tsx</code> e acrescente seu nome à lista de opções.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {([
            ['filter', 'Ícone dos filtros'],
            ['category', 'Ícone de categorias'],
            ['projectFallback', 'Ícone quando o projeto não tem capa'],
            ['projectCta', 'Ícone do botão do projeto'],
          ] as const).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <label htmlFor={`admin-icon-${key}`} className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">{label}</label>
              <select
                id={`admin-icon-${key}`}
                value={theme.icons?.[key] || DEFAULT_THEME.icons![key]}
                onChange={(e) => {
                  const nextTheme: ThemeConfig = { ...theme, icons: { ...(theme.icons || DEFAULT_THEME.icons!), [key]: e.target.value } };
                  setTheme(nextTheme);
                  applyThemeToDOM(nextTheme);
                }}
                className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
              >
                {PORTFOLIO_ICON_OPTIONS.map((iconName) => <option key={iconName} value={iconName}>{iconName}</option>)}
              </select>
            </div>
          ))}
          <div className="space-y-1.5">
            <label htmlFor="admin-icon-size" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Tamanho dos ícones ({theme.icons?.size || 16}px)</label>
            <input id="admin-icon-size" type="range" min="12" max="32" value={theme.icons?.size || 16} onChange={(e) => { const nextTheme = { ...theme, icons: { ...(theme.icons || DEFAULT_THEME.icons!), size: Number(e.target.value) } }; setTheme(nextTheme); applyThemeToDOM(nextTheme); }} className="w-full h-2 rounded bg-[var(--color-bg)] accent-[var(--color-primary)] cursor-pointer" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-icon-stroke" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Espessura do traço ({theme.icons?.strokeWidth || 2})</label>
            <input id="admin-icon-stroke" type="range" min="1" max="4" step="0.5" value={theme.icons?.strokeWidth || 2} onChange={(e) => { const nextTheme = { ...theme, icons: { ...(theme.icons || DEFAULT_THEME.icons!), strokeWidth: Number(e.target.value) } }; setTheme(nextTheme); applyThemeToDOM(nextTheme); }} className="w-full h-2 rounded bg-[var(--color-bg)] accent-[var(--color-primary)] cursor-pointer" />
          </div>
        </div>
      </section>

      {/* 6. UX WRITING & TOM DE VOZ */}

      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" />
          <span>6. Tom de Voz & UX Writing Configurável</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="ux-cta" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Rótulo do Botão nos Cards (CTA do Projeto)
            </label>
            <input
              type="text"
              id="ux-cta"
              value={theme.uxWriting.projectCtaLabel}
              onChange={(e) => handleUxWritingChange('projectCtaLabel', e.target.value)}
              placeholder="Ex: Ver projeto, Explorar, Descobrir..."
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ux-filter-all" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Rótulo do Filtro Geral
            </label>
            <input
              type="text"
              id="ux-filter-all"
              value={theme.uxWriting.filterAllLabel}
              onChange={(e) => handleUxWritingChange('filterAllLabel', e.target.value)}
              placeholder="Ex: Todos os Projetos"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="ux-whatsapp-tmpl" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Template da Mensagem Enviada pelo WhatsApp
            </label>
            <textarea
              id="ux-whatsapp-tmpl"
              rows={3}
              value={theme.uxWriting.whatsappTemplate}
              onChange={(e) => handleUxWritingChange('whatsappTemplate', e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] font-mono"
            />
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Variáveis disponíveis: <code>{'{nome}'}</code>, <code>{'{assunto}'}</code>, <code>{'{mensagem}'}</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Botão Final de Salvar */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveTheme}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[var(--radius-sm)] text-sm font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 min-h-[44px] shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações de Aparência'}</span>
        </button>
      </div>
    </div>
  );
};
