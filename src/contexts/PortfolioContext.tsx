import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  PortfolioSettings,
  Category,
  Project,
  ProjectBlock,
  ThemeConfig,
  ToastNotification,
} from '../types';
import { db } from '../services/db';
import { applyThemeToDOM } from '../services/theme';
import { INITIAL_PORTFOLIO_SETTINGS } from '../utils/defaults';

interface PortfolioContextType {
  settings: PortfolioSettings;
  categories: Category[];
  projects: Project[];
  isLoading: boolean;
  toasts: ToastNotification[];
  showToast: (type: ToastNotification['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<PortfolioSettings>) => Promise<PortfolioSettings>;
  updateTheme: (themeConfig: ThemeConfig) => Promise<void>;
  createCategory: (cat: Omit<Category, 'id' | 'created_at'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (id: string, action?: 'set_null' | 'delete_projects' | 'reassign', reassignToId?: string) => Promise<boolean>;
  reorderCategories: (cats: Category[]) => Promise<void>;
  saveProject: (project: Partial<Project> & { title?: string }) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  reorderProjects: (projects: Project[]) => Promise<void>;
  getProjectBlocks: (projectId: string) => Promise<ProjectBlock[]>;
  saveProjectBlock: (block: Partial<ProjectBlock> & { project_id: string; type: ProjectBlock['type'] }) => Promise<ProjectBlock>;
  deleteProjectBlock: (projectId: string, blockId: string) => Promise<boolean>;
  reorderProjectBlocks: (projectId: string, blocks: ProjectBlock[]) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PortfolioSettings>(INITIAL_PORTFOLIO_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((type: ToastNotification['type'], title: string, message?: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedCategories, fetchedProjects] = await Promise.all([
        db.getSettings(),
        db.getCategories(),
        db.getProjects(undefined, true), // traz todos para admin e contexto
      ]);

      setSettings(fetchedSettings);
      setCategories(fetchedCategories);
      setProjects(fetchedProjects);
      applyThemeToDOM(fetchedSettings.theme_config);
    } catch (err) {
      console.error('Erro ao atualizar dados do portfólio:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateSettings = async (newSettings: Partial<PortfolioSettings>): Promise<PortfolioSettings> => {
    const saved = await db.saveSettings(newSettings);
    setSettings(saved);
    if (saved.theme_config) {
      applyThemeToDOM(saved.theme_config);
    }
    showToast('success', 'Configurações salvas com sucesso!');
    return saved;
  };

  const updateTheme = async (themeConfig: ThemeConfig): Promise<void> => {
    applyThemeToDOM(themeConfig);
    const updated = await db.saveSettings({ theme_config: themeConfig });
    setSettings(updated);
    showToast('success', 'Design System atualizado!');
  };

  const createCategory = async (cat: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const created = await db.createCategory(cat);
    await refreshData();
    showToast('success', `Categoria "${created.name}" criada com sucesso!`);
    return created;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    const updated = await db.updateCategory(id, updates);
    await refreshData();
    showToast('success', 'Categoria atualizada!');
    return updated;
  };

  const deleteCategory = async (
    id: string,
    action: 'set_null' | 'delete_projects' | 'reassign' = 'set_null',
    reassignToId?: string
  ): Promise<boolean> => {
    const res = await db.deleteCategory(id, action, reassignToId);
    await refreshData();
    showToast('info', 'Categoria removida com segurança.');
    return res;
  };

  const reorderCategories = async (cats: Category[]): Promise<void> => {
    await db.reorderCategories(cats);
    setCategories(cats);
    showToast('success', 'Ordem das categorias salva!');
  };

  const saveProject = async (proj: Partial<Project> & { title?: string }): Promise<Project> => {
    const saved = await db.saveProject(proj);
    await refreshData();
    showToast('success', `Projeto "${saved.title}" salvo com sucesso!`);
    return saved;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const res = await db.deleteProject(id);
    await refreshData();
    showToast('info', 'Projeto excluído com sucesso.');
    return res;
  };

  const reorderProjects = async (projs: Project[]): Promise<void> => {
    await db.reorderProjects(projs);
    setProjects(projs);
    showToast('success', 'Ordem dos projetos atualizada!');
  };

  const getProjectBlocks = async (projectId: string): Promise<ProjectBlock[]> => {
    return await db.getProjectBlocks(projectId);
  };

  const saveProjectBlock = async (
    block: Partial<ProjectBlock> & { project_id: string; type: ProjectBlock['type'] }
  ): Promise<ProjectBlock> => {
    const saved = await db.saveProjectBlock(block);
    showToast('success', 'Bloco de conteúdo atualizado!');
    return saved;
  };

  const deleteProjectBlock = async (projectId: string, blockId: string): Promise<boolean> => {
    const res = await db.deleteProjectBlock(projectId, blockId);
    showToast('info', 'Bloco removido.');
    return res;
  };

  const reorderProjectBlocks = async (projectId: string, blocks: ProjectBlock[]): Promise<void> => {
    await db.reorderProjectBlocks(projectId, blocks);
    showToast('success', 'Ordem dos blocos salva!');
  };

  return (
    <PortfolioContext.Provider
      value={{
        settings,
        categories,
        projects,
        isLoading,
        toasts,
        showToast,
        removeToast,
        refreshData,
        updateSettings,
        updateTheme,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        saveProject,
        deleteProject,
        reorderProjects,
        getProjectBlocks,
        saveProjectBlock,
        deleteProjectBlock,
        reorderProjectBlocks,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio deve ser usado dentro de um PortfolioProvider');
  }
  return context;
};
