import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentTab: 'sobre' | 'projetos' | 'contato' | 'admin' | 'projeto-detalhe';
  onNavigate: (tab: 'sobre' | 'projetos' | 'contato' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const { settings } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fecha menu mobile no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'sobre' as const, label: settings.theme_config?.uxWriting?.aboutNavLabel || 'Sobre' },
    { id: 'projetos' as const, label: settings.theme_config?.uxWriting?.projectsNavLabel || 'Projetos' },
    { id: 'contato' as const, label: settings.theme_config?.uxWriting?.contactNavLabel || 'Contato' },
  ];

  const handleNavClick = (tabId: 'sobre' | 'projetos' | 'contato' | 'admin') => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      role="banner"
      id="site-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-[var(--color-border)] transition-colors"
    >
      <div className="max-w-[var(--container-max-w)] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          type="button"
          id="header-brand-button"
          onClick={() => handleNavClick('sobre')}
          className="text-left group cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded-lg p-1.5 transition-transform"
        >
          <span className="font-title text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)] block group-hover:text-[var(--color-primary)] transition-colors">
            {settings.portfolio_name}
          </span>
          {settings.tagline && (
            <span className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-normal block">
              {settings.tagline}
            </span>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav
          role="navigation"
          aria-label="Navegação Principal"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-4 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-surface)] shadow-xs'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]/50'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--color-primary)] rounded-full"
                  />
                )}
              </button>
            );
          })}

          {/* Botão de Acesso Administrativo */}
          <div className="ml-4 pl-4 border-l border-[var(--color-border)] flex items-center">
            <button
              type="button"
              id="nav-link-admin"
              onClick={() => handleNavClick('admin')}
              aria-label={isAuthenticated ? 'Painel Administrativo Autenticado' : 'Entrar na Área Administrativa'}
              title="Área Administrativa"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] ${
                currentTab === 'admin'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-inherit" />
              <span>Admin</span>
              {isAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sessão ativa" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="p-2.5 rounded-[var(--radius-sm)] text-[var(--color-text-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação Mobile"
          className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] text-base font-medium flex items-center justify-between min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none ${
                  isActive
                    ? 'text-[var(--color-primary)] bg-[var(--color-surface)] font-bold'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-[var(--color-border)]">
            <button
              type="button"
              id="mobile-nav-link-admin"
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-3 rounded-[var(--radius-sm)] text-sm font-semibold flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] min-h-[44px] cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Área Administrativa</span>
              </div>
              {isAuthenticated ? (
                <span className="text-xs text-emerald-400 font-normal">Autenticado</span>
              ) : (
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
