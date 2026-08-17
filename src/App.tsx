import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioProvider, usePortfolio } from './contexts/PortfolioContext';
import { SkipLink } from './components/common/SkipLink';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Páginas
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

type RouteState =
  | { page: 'projects' }
  | { page: 'project-detail'; slug: string }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'admin' };

const MainContent: React.FC = () => {
  const { isLoading } = usePortfolio();
  const [route, setRoute] = useState<RouteState>({ page: 'projects' });

  // Sincronização simples e limpa com hash de URL para suportar navegação e histórico do navegador
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'projetos' || hash === 'projects') {
        setRoute({ page: 'projects' });
      } else if (hash.startsWith('projeto/') || hash.startsWith('project/')) {
        const slug = hash.replace(/^(projeto|project)\//, '');
        setRoute({ page: 'project-detail', slug });
      } else if (hash === 'sobre' || hash === 'about') {
        setRoute({ page: 'about' });
      } else if (hash === 'contato' || hash === 'contact') {
        setRoute({ page: 'contact' });
      } else if (hash === 'admin') {
        setRoute({ page: 'admin' });
      }
    };

    // Lê a rota inicial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, slug?: string) => {
    if (page === 'projects' || page === 'projetos') {
      window.location.hash = '#/projetos';
      setRoute({ page: 'projects' });
    } else if (page === 'about' || page === 'sobre') {
      window.location.hash = '#/sobre';
      setRoute({ page: 'about' });
    } else if (page === 'contact' || page === 'contato') {
      window.location.hash = '#/contato';
      setRoute({ page: 'contact' });
    } else if (page === 'admin') {
      window.location.hash = '#/admin';
      setRoute({ page: 'admin' });
    } else if (page === 'project-detail' && slug) {
      window.location.hash = `#/projeto/${slug}`;
      setRoute({ page: 'project-detail', slug });
    }
  };

  const handleSelectProject = (slug: string) => {
    navigateTo('project-detail', slug);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <LoadingSpinner message="Carregando portfólio autoral..." size="lg" />
      </div>
    );
  }

  // Página ativa atual
  const activeNavPage =
    route.page === 'projects' || route.page === 'project-detail'
      ? 'projects'
      : route.page;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-200">
      {/* Link de Acessibilidade: Pular para o Conteúdo Principal (WCAG 2.2 AA) */}
      <SkipLink targetId="main-content" />

      {/* Cabeçalho Semântico Global */}
      <Header
        activePage={activeNavPage}
        onNavigate={(page) => navigateTo(page)}
      />

      {/* Conteúdo Principal com Landmark Acessível */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 w-full max-w-[var(--max-container-width)] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 focus:outline-none"
      >
        {route.page === 'projects' && (
          <ProjectsPage onSelectProject={handleSelectProject} />
        )}

        {route.page === 'project-detail' && (
          <ProjectDetailPage
            slug={route.slug}
            onBack={() => navigateTo('projects')}
            onSelectProjectBySlug={(s) => navigateTo('project-detail', s)}
          />
        )}

        {route.page === 'about' && <AboutPage />}

        {route.page === 'contact' && <ContactPage />}

        {route.page === 'admin' && (
          <AdminPage onNavigateToPublic={(p) => navigateTo(p)} />
        )}
      </main>

      {/* Rodapé Semântico Global */}
      <Footer onNavigate={(page) => navigateTo(page)} />

      {/* Contêiner de Notificações Toast com Região ARIA Live */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <MainContent />
      </PortfolioProvider>
    </AuthProvider>
  );
}
