import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      id="skip-to-content-link"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-[var(--color-primary)] focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-xl focus:ring-4 focus:ring-[var(--color-focus)] focus:outline-none transition-all"
    >
      Pular para o conteúdo principal (Skip to content)
    </a>
  );
};
