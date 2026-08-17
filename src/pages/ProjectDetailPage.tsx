import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, ZoomIn, Share2, Check } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Project, ProjectBlock } from '../types';
import { YoutubeEmbed } from '../components/common/YoutubeEmbed';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { ImageZoomModal } from '../components/common/ImageZoomModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface ProjectDetailPageProps {
  slug: string;
  onBack: () => void;
  onSelectProjectBySlug: (slug: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  slug,
  onBack,
  onSelectProjectBySlug,
}) => {
  const { projects, getProjectBlocks, categories } = usePortfolio();
  const [project, setProject] = useState<Project | null>(null);
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Zoom modal state
  const [zoomImage, setZoomImage] = useState<{ url: string; alt: string; caption?: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const found = projects.find((p) => p.slug === slug);
    if (found) {
      setProject(found);
      getProjectBlocks(found.id).then((b) => {
        if (isMounted) {
          setBlocks(b);
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }

    // Scroll to top upon opening project
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [slug, projects, getProjectBlocks]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando detalhes do projeto autoral..." size="lg" />;
  }

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold font-title text-[var(--color-text-primary)]">
          Projeto Não Encontrado
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          O projeto com o endereço <code>/{slug}</code> não existe ou foi despublicado.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white text-sm font-semibold cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Projetos</span>
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === project.category_id);

  // Próximo e anterior
  const publishedList = projects.filter((p) => p.status === 'publicado');
  const currentIndex = publishedList.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? publishedList[currentIndex - 1] : null;
  const nextProject = currentIndex < publishedList.length - 1 ? publishedList[currentIndex + 1] : null;

  return (
    <article className="space-y-12 sm:space-y-16 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Barra Superior: Voltar e Compartilhar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para a listagem de projetos"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Projetos</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Copiar link do projeto"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Compartilhar</span>
            </>
          )}
        </button>
      </div>

      {/* Header Semântico do Projeto */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)]">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{category.name}</span>
            </span>
          )}
          {project.year && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{project.year}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-title tracking-tight text-[var(--color-text-primary)] leading-[1.15]">
          {project.title}
        </h1>

        {project.short_description && (
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
            {project.short_description}
          </p>
        )}

        {/* Imagem de Capa Principal */}
        {project.cover_image && (
          <figure className="relative aspect-16/9 rounded-[var(--radius-main)] overflow-hidden bg-black/30 border border-[var(--color-border)] shadow-xl group">
            <img
              src={project.cover_image}
              alt={`Capa do projeto: ${project.title}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() =>
                setZoomImage({
                  url: project.cover_image,
                  alt: `Capa do projeto: ${project.title}`,
                  caption: project.title,
                })
              }
              aria-label="Ampliar imagem de capa"
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer backdrop-blur-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </figure>
        )}
      </header>

      {/* Sequência Dinâmica dos Blocos de Conteúdo */}
      <section aria-label="Conteúdo do Projeto" className="space-y-12 sm:space-y-16 pt-6">
        {blocks.map((block) => {
          // 1. Bloco de Texto
          if (block.type === 'texto') {
            return (
              <div
                key={block.id}
                className="prose prose-invert max-w-none text-[var(--color-text-primary)] leading-relaxed space-y-4"
              >
                {block.content?.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2
                        key={pIdx}
                        className="text-2xl font-bold font-title text-[var(--color-text-primary)] pt-4 first:pt-0"
                      >
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3
                        key={pIdx}
                        className="text-xl font-semibold font-title text-[var(--color-text-primary)] pt-2"
                      >
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-[var(--color-text-secondary)]">
                        {items.map((item, iIdx) => (
                          <li key={iIdx}>{item.replace(/^[-*]\s+/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            );
          }

          // 2. Bloco de Imagem
          if (block.type === 'imagem' && block.media_url) {
            return (
              <figure key={block.id} className="space-y-2.5">
                <div className="relative rounded-[var(--radius-main)] overflow-hidden bg-black/20 border border-[var(--color-border)] shadow-md group">
                  <img
                    src={block.media_url}
                    alt={block.alt_text || block.caption || `Imagem de detalhe do projeto ${project.title}`}
                    className="w-full h-auto object-cover max-h-[700px]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setZoomImage({
                        url: block.media_url!,
                        alt: block.alt_text || block.caption || '',
                        caption: block.caption,
                      })
                    }
                    aria-label="Ampliar imagem"
                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer backdrop-blur-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
                {block.caption && (
                  <figcaption className="text-xs sm:text-sm text-[var(--color-text-secondary)] italic text-center px-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          // 3. Bloco de Vídeo do YouTube
          if (block.type === 'video_youtube' && block.media_url) {
            return (
              <div key={block.id} className="py-2">
                <YoutubeEmbed
                  url={block.media_url}
                  title={`Vídeo explicativo: ${project.title}`}
                  caption={block.caption}
                />
              </div>
            );
          }

          // 4. Bloco de Áudio
          if (block.type === 'audio' && block.media_url) {
            return (
              <div key={block.id} className="py-2">
                <AudioPlayer
                  src={block.media_url}
                  caption={block.caption}
                  transcript={block.transcript}
                />
              </div>
            );
          }

          return null;
        })}
      </section>

      {/* Navegação Entre Projetos (Anterior / Próximo) */}
      <footer className="pt-12 mt-16 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevProject ? (
          <button
            type="button"
            onClick={() => onSelectProjectBySlug(prevProject.slug)}
            className="p-4 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-left transition-all space-y-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
          >
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider block">
              ← Projeto Anterior
            </span>
            <p className="text-sm font-bold font-title text-[var(--color-text-primary)] truncate">
              {prevProject.title}
            </p>
          </button>
        ) : (
          <div />
        )}

        {nextProject && (
          <button
            type="button"
            onClick={() => onSelectProjectBySlug(nextProject.slug)}
            className="p-4 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-right transition-all space-y-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none sm:col-start-2"
          >
            <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider block">
              Próximo Projeto →
            </span>
            <p className="text-sm font-bold font-title text-[var(--color-text-primary)] truncate">
              {nextProject.title}
            </p>
          </button>
        )}
      </footer>

      {/* Modal Lightbox de Imagem */}
      {zoomImage && (
        <ImageZoomModal
          isOpen={!!zoomImage}
          onClose={() => setZoomImage(null)}
          imageUrl={zoomImage.url}
          altText={zoomImage.alt}
          caption={zoomImage.caption}
        />
      )}
    </article>
  );
};
