import React, { useState } from 'react';
import {
  Layers,
  FolderTree,
  User,
  Palette,
  Database,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AdminAuthModal } from '../components/admin/AdminAuthModal';
import { AdminProjectsTab } from '../components/admin/AdminProjectsTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminProfileTab } from '../components/admin/AdminProfileTab';
import { AdminAppearanceTab } from '../components/admin/AdminAppearanceTab';
import { AdminSupabaseTab } from '../components/admin/AdminSupabaseTab';
import { usePortfolio } from '../contexts/PortfolioContext';

interface AdminPageProps {
  onNavigateToPublic: (page: string) => void;
}

type AdminTab = 'projects' | 'categories' | 'profile' | 'appearance' | 'supabase';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToPublic }) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { settings } = usePortfolio();
  const [currentTab, setCurrentTab] = useState<AdminTab>('projects');

  // Se não estiver autenticado, exibe o modal de Login/Registro
  if (!isAuthenticated) {
    return (
      <div className="py-12 animate-in fade-in duration-300">
        <AdminAuthModal />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Barra de Título Administrativa */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Painel Autoral Ativo</span>
            </span>
            <span className="text-xs text-[var(--color-text-secondary)] font-mono truncate max-w-[200px] sm:max-w-xs">
              {user?.email}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-title text-[var(--color-text-primary)]">
            Painel de Gestão & Design System
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateToPublic('projects')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors min-h-[44px] cursor-pointer"
          >
            <span>Ver Portfólio Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => signOut()}
            aria-label="Encerrar sessão administrativa"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors min-h-[44px] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Navegação por Abas */}
      <nav aria-label="Abas de Administração" className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => setCurrentTab('projects')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shrink-0 ${
            currentTab === 'projects'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]/50'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Projetos & Mídias</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('categories')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shrink-0 ${
            currentTab === 'categories'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]/50'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categorias</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('profile')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shrink-0 ${
            currentTab === 'profile'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]/50'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil & Biografia</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('appearance')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shrink-0 ${
            currentTab === 'appearance'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]/50'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Design System & WCAG</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('supabase')}
          className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] cursor-pointer shrink-0 ${
            currentTab === 'supabase'
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-surface)]/50'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase & SQL</span>
        </button>
      </nav>

      {/* Conteúdo da Aba Selecionada */}
      <main>
        {currentTab === 'projects' && <AdminProjectsTab />}
        {currentTab === 'categories' && <AdminCategoriesTab />}
        {currentTab === 'profile' && <AdminProfileTab />}
        {currentTab === 'appearance' && <AdminAppearanceTab />}
        {currentTab === 'supabase' && <AdminSupabaseTab />}
      </main>
    </div>
  );
};
