import React from 'react';
import { ArrowUp, Github, Linkedin, Globe, Mail, MapPin } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';

export const Footer: React.FC = () => {
  const { settings } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const header = document.getElementById('site-header');
    header?.focus();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5" aria-hidden="true" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" aria-hidden="true" />;
      default:
        return <Globe className="w-5 h-5" aria-hidden="true" />;
    }
  };

  return (
    <footer
      role="contentinfo"
      id="site-footer"
      className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-20 pt-16 pb-12 transition-colors text-[var(--color-text-secondary)]"
    >
      <div className="max-w-[var(--container-max-w)] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[var(--color-border)]">
          {/* Coluna 1: Identidade */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="text-xl font-bold font-title text-[var(--color-text-primary)]">
              {settings.portfolio_name}
            </h2>
            <p className="text-sm max-w-md leading-relaxed text-[var(--color-text-secondary)]">
              {settings.short_bio || settings.tagline}
            </p>
            {settings.location && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                <span>{settings.location}</span>
              </div>
            )}
          </div>

          {/* Coluna 2: Redes e Links */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Conexões & Redes
            </h3>
            <ul className="space-y-2.5" aria-label="Links para redes externas">
              {settings.email_public && (
                <li>
                  <a
                    href={`mailto:${settings.email_public}`}
                    className="inline-flex items-center gap-2.5 text-sm hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded px-1 py-0.5 transition-colors"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>{settings.email_public}</span>
                  </a>
                </li>
              )}
              {settings.social_links?.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded px-1 py-0.5 transition-colors"
                  >
                    {getPlatformIcon(link.platform)}
                    <span>{link.label}</span>
                    <span className="sr-only">(abre em nova janela)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Acessibilidade e Voltar ao topo */}
          <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end">
            <div className="text-left md:text-right space-y-1">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-primary)]">
                WCAG 2.2 AA
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">Design Inclusivo & Autoral</p>
            </div>

            <button
              type="button"
              id="back-to-top-btn"
              onClick={scrollToTop}
              aria-label="Voltar para o topo da página"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none transition-colors min-h-[44px]"
            >
              <span>Topo</span>
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Linha inferior de Copyright e Autoria */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
          <p>
            © {new Date().getFullYear()} {settings.portfolio_name}. Conteúdos e direitos reservados.
          </p>
          <p className="flex items-center gap-1">
            <span>Infraestrutura de Portfólio Autoral com Supabase</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
