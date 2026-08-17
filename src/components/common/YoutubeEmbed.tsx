import React from 'react';
import { getYouTubeEmbedUrl } from '../../utils/defaults';
import { Video } from 'lucide-react';

interface YoutubeEmbedProps {
  url: string;
  title?: string;
  caption?: string;
}

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url, title = 'Vídeo do Projeto', caption }) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div
        role="alert"
        className="w-full p-6 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] text-center text-sm text-[var(--color-text-secondary)]"
      >
        <Video className="w-8 h-8 mx-auto mb-2 text-[var(--color-warning)]" />
        <p className="font-medium text-[var(--color-text-primary)]">URL do YouTube não reconhecida ou inválida</p>
        <p className="text-xs mt-1 text-[var(--color-text-secondary)]">{url || 'Nenhuma URL informada'}</p>
      </div>
    );
  }

  return (
    <figure className="w-full space-y-2.5">
      <div className="relative w-full aspect-video rounded-[var(--radius-main)] overflow-hidden bg-black border border-[var(--color-border)] shadow-md">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      {caption && (
        <figcaption className="text-xs sm:text-sm text-[var(--color-text-secondary)] italic text-center px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
