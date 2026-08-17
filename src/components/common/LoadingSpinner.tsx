import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando conteúdos...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-12 space-y-4 text-center"
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-[var(--color-primary)]`}
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">{message}</p>
      <span className="sr-only">Carregando dados</span>
    </div>
  );
};
