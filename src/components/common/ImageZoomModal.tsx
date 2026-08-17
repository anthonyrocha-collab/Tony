import React from 'react';
import { Modal } from './Modal';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
  caption?: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  altText,
  caption,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={caption || 'Visualização da Imagem'} maxWidth="4xl">
      <figure className="space-y-4">
        <div className="max-h-[75vh] flex items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-black/40">
          <img
            src={imageUrl}
            alt={altText || caption || 'Imagem do projeto'}
            className="max-h-[70vh] w-auto object-contain rounded-[var(--radius-sm)]"
            referrerPolicy="no-referrer"
          />
        </div>
        {caption && (
          <figcaption className="text-sm text-[var(--color-text-secondary)] italic text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    </Modal>
  );
};
