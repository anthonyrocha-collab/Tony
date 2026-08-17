import React from 'react';
import { ArrowRight, Mail, MessageCircle, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

interface AboutPageProps {
  onNavigate: (tab: 'sobre' | 'projetos' | 'contato' | 'admin', param?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, projects } = usePortfolio();
  const featuredProjects = projects.filter((p) => p.status === 'publicado' && p.featured).slice(0, 2);

  return (
    <article className="space-y-16 sm:space-y-24 animate-in fade-in duration-300">
      {/* Hero / Apresentação Autoral */}
      <section
        id="about-hero"
        aria-labelledby="about-hero-heading"
        className="pt-8 sm:pt-14 pb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Foto de Perfil / Visual do Autor */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[var(--radius-main)] opacity-30 group-hover:opacity-60 transition duration-500 blur-sm" />
              <div className="relative aspect-4/5 rounded-[var(--radius-main)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl">
                {settings.profile_image ? (
                  <img
                    src={settings.profile_image}
                    alt={`Fotografia de perfil de ${settings.portfolio_name}`}
                    className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                    <Sparkles className="w-12 h-12 mb-3 text-[var(--color-primary)] opacity-50" />
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{settings.portfolio_name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">Imagem autoral do perfil</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Texto de Apresentação e Declaração Autoral */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
              <span>{settings.tagline || 'Declaração Autoral'}</span>
            </div>

            <h1
              id="about-hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-title tracking-tight text-[var(--color-text-primary)] leading-[1.15]"
            >
              {settings.about_title || 'Prática Criativa & Pesquisa Visual'}
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              {settings.about_text}
            </p>

            {/* Metadados e Localização */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
              {settings.location && (
                <div className="flex items-center gap-1.5 bg-[var(--color-surface)] px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>{settings.location}</span>
                </div>
              )}
              {settings.email_public && (
                <a
                  href={`mailto:${settings.email_public}`}
                  className="flex items-center gap-1.5 bg-[var(--color-surface)] px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
                >
                  <Mail className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>{settings.email_public}</span>
                </a>
              )}
            </div>

            {/* Ações / Botões Principais */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                id="about-view-projects-btn"
                onClick={() => onNavigate('projetos')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[var(--radius-sm)] text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] cursor-pointer"
              >
                <span>{settings.theme_config?.uxWriting?.projectsNavLabel || 'Explorar Projetos'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                id="about-contact-btn"
                onClick={() => onNavigate('contato')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[var(--radius-sm)] text-sm font-medium bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                <span>Conversar comigo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Biografia Estendida e Processo */}
      {settings.short_bio && (
        <section
          id="about-bio"
          aria-labelledby="about-bio-heading"
          className="p-8 sm:p-12 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6"
        >
          <h2
            id="about-bio-heading"
            className="text-2xl font-bold font-title text-[var(--color-text-primary)]"
          >
            Biografia & Filosofia de Trabalho
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
            <p>{settings.short_bio}</p>
            <p>
              Acredito que o design autoral precisa transcender a superficialidade dos templates pré-fabricados. Por meio de sistemas de design flexíveis, código limpo e padrões W3C/WCAG, cada projeto reflete uma postura de responsabilidade estética e inclusiva.
            </p>
          </div>

          {/* Redes e Plataformas */}
          {settings.social_links && settings.social_links.length > 0 && (
            <div className="pt-4 border-t border-[var(--color-border)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
                Presença e Portfólios Externos
              </h3>
              <div className="flex flex-wrap gap-3">
                {settings.social_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                    <span className="sr-only">(abre em nova guia)</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Projetos em Destaque */}
      {featuredProjects.length > 0 && (
        <section
          id="about-featured"
          aria-labelledby="about-featured-heading"
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="about-featured-heading"
                className="text-2xl font-bold font-title text-[var(--color-text-primary)]"
              >
                Projetos Selecionados
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
                Uma amostra das pesquisas e produções recentes
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projetos')}
              className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded p-1"
            >
              <span>Ver todos ({projects.filter((p) => p.status === 'publicado').length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-md hover:border-[var(--color-primary)]/50 transition-all duration-300"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-black/20">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={`Capa do projeto: ${project.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-text-secondary)]">
                      Sem imagem de capa
                    </div>
                  )}
                  {project.category_name && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-xs border border-white/10">
                      {project.category_name}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-lg font-bold font-title text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                      {project.short_description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('projetos', project.slug)}
                    aria-label={`Abrir projeto ${project.title}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded p-1 cursor-pointer"
                  >
                    <span>{settings.theme_config?.uxWriting?.projectCtaLabel || 'Ver projeto'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
