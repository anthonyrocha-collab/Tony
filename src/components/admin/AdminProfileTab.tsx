import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, Image as ImageIcon, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { uploadMediaToStorage } from '../../services/supabase';
import { SocialLink } from '../../types';

export const AdminProfileTab: React.FC = () => {
  const { settings, updateSettings, showToast } = usePortfolio();
  const [formData, setFormData] = useState({
    portfolio_name: settings.portfolio_name || '',
    tagline: settings.tagline || '',
    about_title: settings.about_title || '',
    about_text: settings.about_text || '',
    short_bio: settings.short_bio || '',
    profile_image: settings.profile_image || '',
    whatsapp: settings.whatsapp || '',
    email_public: settings.email_public || '',
    location: settings.location || '',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.social_links || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadMediaToStorage(file, 'profile');
      if (res.error) {
        showToast('error', 'Erro no upload da imagem', res.error);
      } else if (res.url) {
        setFormData((prev) => ({ ...prev, profile_image: res.url! }));
        showToast('success', 'Foto de perfil carregada com sucesso!');
      }
    } catch (err: any) {
      showToast('error', 'Erro ao carregar arquivo', err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks((prev) => [
      ...prev,
      { platform: 'other', label: 'Nova Rede', url: 'https://' },
    ]);
  };

  const handleUpdateSocialLink = (index: number, field: keyof SocialLink, val: string) => {
    setSocialLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        ...formData,
        social_links: socialLinks,
      });
    } catch (err: any) {
      showToast('error', 'Erro ao salvar perfil', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Identidade Principal */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          <span>Identidade do Portfólio & Apresentação</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="admin-portfolio-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Nome do Portfólio / Autor <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              type="text"
              id="admin-portfolio-name"
              required
              value={formData.portfolio_name}
              onChange={(e) => setFormData({ ...formData, portfolio_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-tagline" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Tagline / Subtítulo Profissional
            </label>
            <input
              type="text"
              id="admin-tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Ex: Designer de Interação & Desenvolvedor Autoral"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>
        </div>

        {/* Foto de Perfil */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            Foto de Perfil / Imagem Autoral
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-24 h-24 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              {formData.profile_image ? (
                <img
                  src={formData.profile_image}
                  alt="Preview da foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)]" />
              )}
            </div>

            <div className="space-y-2 flex-1 w-full">
              <input
                type="url"
                id="admin-profile-image-url"
                value={formData.profile_image}
                onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                placeholder="Insira a URL da imagem ou faça upload abaixo"
                aria-label="URL da Imagem de Perfil"
                className="w-full px-4 py-2 text-xs rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer transition-colors min-h-[44px]">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? 'Enviando imagem...' : 'Fazer Upload para Storage'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="sr-only"
                  />
                </label>
                {formData.profile_image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profile_image: '' })}
                    className="text-xs text-red-400 hover:underline p-1 cursor-pointer"
                  >
                    Remover Imagem
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Textos do Sobre & Biografia */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)]">
          Textos da Página "Sobre" & Biografia
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-about-title" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Título da Apresentação
            </label>
            <input
              type="text"
              id="admin-about-title"
              value={formData.about_title}
              onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-about-text" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Texto Principal do Sobre (Apresentação Detalhada)
            </label>
            <textarea
              id="admin-about-text"
              rows={4}
              value={formData.about_text}
              onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-short-bio" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Biografia Curta / Filosofia de Trabalho
            </label>
            <textarea
              id="admin-short-bio"
              rows={3}
              value={formData.short_bio}
              onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* 3. Contatos & WhatsApp */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)]">
          Canais de Contato & WhatsApp
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="admin-whatsapp" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Número do WhatsApp (com DDI e DDD)
            </label>
            <input
              type="text"
              id="admin-whatsapp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="5511999999999"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
            <p className="text-[11px] text-[var(--color-text-secondary)]">Somente números: Código do país (55) + DDD + Telefone.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              E-mail Público
            </label>
            <input
              type="email"
              id="admin-email"
              value={formData.email_public}
              onChange={(e) => setFormData({ ...formData, email_public: e.target.value })}
              placeholder="contato@seusite.com"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-location" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Localização
            </label>
            <input
              type="text"
              id="admin-location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="São Paulo, Brasil"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>
        </div>
      </section>

      {/* 4. Redes e Links Externos */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)]">
            Links & Redes Externas
          </h2>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)]">
              <select
                value={link.platform}
                onChange={(e) => handleUpdateSocialLink(idx, 'platform', e.target.value as any)}
                aria-label={`Plataforma da rede ${idx + 1}`}
                className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
              >
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="behance">Behance</option>
                <option value="instagram">Instagram</option>
                <option value="dribbble">Dribbble</option>
                <option value="youtube">YouTube</option>
                <option value="other">Outro</option>
              </select>

              <input
                type="text"
                value={link.label}
                onChange={(e) => handleUpdateSocialLink(idx, 'label', e.target.value)}
                placeholder="Rótulo (ex: Behance)"
                aria-label={`Rótulo da rede ${idx + 1}`}
                className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
              />

              <input
                type="url"
                value={link.url}
                onChange={(e) => handleUpdateSocialLink(idx, 'url', e.target.value)}
                placeholder="https://..."
                aria-label={`URL da rede ${idx + 1}`}
                className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
              />

              <button
                type="button"
                onClick={() => handleRemoveSocialLink(idx)}
                aria-label={`Remover link ${link.label}`}
                className="p-2 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Botão de Salvar Alterações */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[var(--radius-sm)] text-sm font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações do Perfil'}</span>
        </button>
      </div>
    </form>
  );
};
