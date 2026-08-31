import React, { useState, useMemo } from 'react';
import { Filter, ArrowRight, Layers, Search, Sparkles } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { EmptyState } from '../components/common/EmptyState';

interface ProjectsPageProps {
  onSelectProject: (slug: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const { settings, categories, projects } = usePortfolio();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.status === 'publicado');
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      // Filtro de categoria
      const matchCategory =
        selectedCategorySlug === 'todos' ||
        categories.some((c) => c.slug === selectedCategorySlug && c.id === project.category_id);

      // Filtro de busca textual
      const matchSearch =
        !searchQuery.trim() ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.category_name && project.category_name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [publishedProjects, selectedCategorySlug, searchQuery, categories]);

  const filterAllLabel = settings.theme_config?.uxWriting?.filterAllLabel || 'Todos os Projetos';
  const projectCta = settings.theme_config?.uxWriting?.projectCtaLabel || 'Ver projeto';

  return (
    <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-300">
      {/* Cabeçalho da Página de Projetos */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-title tracking-tight text-[var(--color-text-primary)]">
          {settings.theme_config?.uxWriting?.projectsNavLabel || 'Projetos'}
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
          Navegue pelas obras, pesquisas autorais e produções organizadas por categoria e mídia.
        </p>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="space-y-4 pb-2 border-b border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categorias / Filtro por Abas Acessíveis */}
          <div
            role="toolbar"
            aria-label="Filtrar projetos por categoria"
            className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
          >
            {/* Botão 'Todos' */}
            <button
              type="button"
              id="filter-btn-all"
              onClick={() => setSelectedCategorySlug('todos')}
              aria-pressed={selectedCategorySlug === 'todos'}
              className={`px-4 py-2.5 rounded-[var(--radius-sm)] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] shrink-0 flex items-center gap-2 border ${
                selectedCategorySlug === 'todos'
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50'
              }`}
            >
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>{filterAllLabel}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedCategorySlug === 'todos' ? 'bg-white/20 text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
                }`}
              >
                {publishedProjects.length}
              </span>
            </button>

            {/* Categorias Dinâmicas */}
            {categories.map((cat) => {
              const isSelected = selectedCategorySlug === cat.slug;
              const count = publishedProjects.filter((p) => p.category_id === cat.id).length;

              return (
                <button
                  key={cat.id}
                  id={`filter-btn-${cat.slug}`}
                  type="button"
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  aria-pressed={isSelected}
                  className={`px-4 py-2.5 rounded-[var(--radius-sm)] text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative min-w-[240px] shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" aria-hidden="true" />
            <input
              type="search"
              id="projects-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar projetos..."
              aria-label="Buscar projetos por título ou descrição"
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Live Region para leitores de tela indicando resultados */}
        <div aria-live="polite" className="sr-only">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}.
        </div>
      </div>

      {/* Grid de Projetos */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-8 h-8 text-[var(--color-text-secondary)]" />}
          title="Nenhum projeto encontrado"
          description={
            searchQuery
              ? `Nenhum resultado para a busca "${searchQuery}". Tente outros termos.`
              : settings.theme_config?.uxWriting?.emptyProjectsMessage || 'Nenhum projeto disponível nesta categoria.'
          }
          action={
            searchQuery || selectedCategorySlug !== 'todos'
              ? {
                  label: 'Limpar Filtros',
                  onClick: () => {
                    setSelectedCategorySlug('todos');
                    setSearchQuery('');
                  },
                }
              : undefined
          }
        />
      ) : (
        <section
          aria-label="Lista de Projetos"
          className="admin-controlled-grid grid"
        >
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group admin-controlled-card flex flex-col rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-[var(--box-shadow)] hover:border-[var(--color-primary)] hover:shadow-xl"
            >
              {/* Imagem de Capa */}
              <div className="admin-controlled-image relative overflow-hidden bg-black/20">
                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={`Capa do projeto: ${project.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-xs text-[var(--color-text-secondary)]">
                    <Sparkles className="w-6 h-6 mb-1 text-[var(--color-primary)] opacity-40" />
                    <span>{project.title}</span>
                  </div>
                )}

                {/* Badge de Categoria */}
                {project.category_name && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/75 text-white backdrop-blur-xs border border-white/10">
                    {project.category_name}
                  </span>
                )}

                {project.featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white shadow-xs">
                    Destaque
                  </span>
                )}
              </div>

              {/* Informações do Card */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span>{project.year || new Date().getFullYear()}</span>
                  </div>
                  <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                {/* Botão Acessível de Abertura */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project.slug)}
                    aria-label={`Abrir detalhes do projeto: ${project.title}`}
                    className="admin-controlled-button w-full inline-flex items-center justify-between px-4 py-2.5 rounded-[var(--radius-sm)] text-xs sm:text-sm font-semibold bg-[var(--color-bg)] hover:bg-[var(--color-primary)] text-[var(--color-text-primary)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-primary)] min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
                  >
                    <span>{projectCta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};
