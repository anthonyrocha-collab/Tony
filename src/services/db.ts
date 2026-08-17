import { supabase, isSupabaseConfigured } from './supabase';
import {
  PortfolioSettings,
  Category,
  Project,
  ProjectBlock,
} from '../types';
import {
  INITIAL_PORTFOLIO_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PROJECTS,
  INITIAL_BLOCKS,
  slugify,
} from '../utils/defaults';

const STORAGE_KEY_SETTINGS = 'portfolio_autoral_settings_v1';
const STORAGE_KEY_CATEGORIES = 'portfolio_autoral_categories_v1';
const STORAGE_KEY_PROJECTS = 'portfolio_autoral_projects_v1';
const STORAGE_KEY_BLOCKS = 'portfolio_autoral_blocks_v1';

// Funções utilitárias de armazenamento persistente local (fallback resiliente e sincronização imediata)
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Erro ao salvar no localStorage (${key}):`, err);
  }
}

// Inicializa dados no localStorage se for a primeira execução
function ensureInitialSeed() {
  if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
    setLocal(STORAGE_KEY_SETTINGS, INITIAL_PORTFOLIO_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEY_CATEGORIES)) {
    setLocal(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(STORAGE_KEY_PROJECTS)) {
    setLocal(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
  }
  if (!localStorage.getItem(STORAGE_KEY_BLOCKS)) {
    setLocal(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
  }
}

ensureInitialSeed();

export const db = {
  // ========================================================
  // PORTFOLIO SETTINGS
  // ========================================================
  async getSettings(): Promise<PortfolioSettings> {
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('portfolio_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          // Atualiza cache local
          setLocal(STORAGE_KEY_SETTINGS, data);
          return data as PortfolioSettings;
        }
      } catch (err) {
        console.warn('Erro ao carregar settings do Supabase, usando cache local:', err);
      }
    }
    return getLocal<PortfolioSettings>(STORAGE_KEY_SETTINGS, INITIAL_PORTFOLIO_SETTINGS);
  },

  async saveSettings(settings: Partial<PortfolioSettings>): Promise<PortfolioSettings> {
    const current = await this.getSettings();
    const updated: PortfolioSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    // Salva localmente primeiro
    setLocal(STORAGE_KEY_SETTINGS, updated);

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase
          .from('portfolio_settings')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('portfolio_settings')
            .update(updated)
            .eq('id', existing.id);
        } else {
          await supabase.from('portfolio_settings').insert([updated]);
        }
      } catch (err) {
        console.warn('Erro ao salvar settings no Supabase:', err);
      }
    }

    return updated;
  },

  // ========================================================
  // CATEGORIAS
  // ========================================================
  async getCategories(): Promise<Category[]> {
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setLocal(STORAGE_KEY_CATEGORIES, data);
          return data as Category[];
        }
      } catch (err) {
        console.warn('Erro ao buscar categorias no Supabase, usando local:', err);
      }
    }
    const local = getLocal<Category[]>(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    return local.sort((a, b) => a.display_order - b.display_order);
  },

  async createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const newCategory: Category = {
      id: 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cat.name,
      slug: cat.slug || slugify(cat.name),
      description: cat.description || '',
      display_order: cat.display_order || 0,
      created_at: new Date().toISOString(),
    };

    const current = await this.getCategories();
    const nextList = [...current, newCategory];
    setLocal(STORAGE_KEY_CATEGORIES, nextList);

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([newCategory])
          .select()
          .single();
        if (!error && data) {
          return data as Category;
        }
      } catch (err) {
        console.warn('Erro ao inserir categoria no Supabase:', err);
      }
    }

    return newCategory;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const current = await this.getCategories();
    const idx = current.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const updated = {
      ...current[idx],
      ...updates,
      slug: updates.name ? slugify(updates.name) : current[idx].slug,
    };
    current[idx] = updated;
    setLocal(STORAGE_KEY_CATEGORIES, current);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('categories').update(updated).eq('id', id);
      } catch (err) {
        console.warn('Erro ao atualizar categoria no Supabase:', err);
      }
    }

    return updated;
  },

  async deleteCategory(
    id: string,
    action: 'set_null' | 'delete_projects' | 'reassign' = 'set_null',
    reassignToId?: string
  ): Promise<boolean> {
    // 1. Trata projetos associados a essa categoria
    const projects = await this.getProjects(undefined, true);
    const affectedProjects = projects.filter((p) => p.category_id === id);

    for (const proj of affectedProjects) {
      if (action === 'delete_projects') {
        await this.deleteProject(proj.id);
      } else if (action === 'reassign' && reassignToId) {
        await this.saveProject({ id: proj.id, category_id: reassignToId });
      } else {
        // default set_null
        await this.saveProject({ id: proj.id, category_id: null });
      }
    }

    // 2. Remove a categoria
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    setLocal(STORAGE_KEY_CATEGORIES, filtered);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Erro ao deletar categoria no Supabase:', err);
      }
    }

    return true;
  },

  async reorderCategories(categories: Category[]): Promise<void> {
    const updated = categories.map((cat, index) => ({
      ...cat,
      display_order: index + 1,
    }));
    setLocal(STORAGE_KEY_CATEGORIES, updated);

    if (supabase && isSupabaseConfigured()) {
      try {
        for (const cat of updated) {
          await supabase.from('categories').update({ display_order: cat.display_order }).eq('id', cat.id);
        }
      } catch (err) {
        console.warn('Erro ao reordenar categorias no Supabase:', err);
      }
    }
  },

  // ========================================================
  // PROJETOS
  // ========================================================
  async getProjects(filterCategorySlug?: string, includeDrafts: boolean = false): Promise<Project[]> {
    let list: Project[] = [];

    if (supabase && isSupabaseConfigured()) {
      try {
        let query = supabase.from('projects').select('*').order('display_order', { ascending: true });
        if (!includeDrafts) {
          query = query.eq('status', 'publicado');
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          list = data as Project[];
          setLocal(STORAGE_KEY_PROJECTS, list);
        }
      } catch (err) {
        console.warn('Erro ao carregar projetos do Supabase, usando local:', err);
      }
    }

    if (list.length === 0) {
      list = getLocal<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
      if (!includeDrafts) {
        list = list.filter((p) => p.status === 'publicado');
      }
    }

    // Enriquece com nome da categoria
    const categories = await this.getCategories();
    const enriched = list.map((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : 'Sem categoria',
      };
    });

    if (filterCategorySlug && filterCategorySlug !== 'todos') {
      const targetCat = categories.find((c) => c.slug === filterCategorySlug);
      if (targetCat) {
        return enriched.filter((p) => p.category_id === targetCat.id);
      }
    }

    return enriched.sort((a, b) => a.display_order - b.display_order);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = await this.getProjects(undefined, true);
    return projects.find((p) => p.slug === slug) || null;
  },

  async getProjectById(id: string): Promise<Project | null> {
    const projects = await this.getProjects(undefined, true);
    return projects.find((p) => p.id === id) || null;
  },

  async saveProject(project: Partial<Project> & { title?: string }): Promise<Project> {
    const currentList = getLocal<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
    let updatedProject: Project;

    if (project.id) {
      const idx = currentList.findIndex((p) => p.id === project.id);
      if (idx !== -1) {
        updatedProject = {
          ...currentList[idx],
          ...project,
          slug: project.slug || (project.title ? slugify(project.title) : currentList[idx].slug),
          updated_at: new Date().toISOString(),
        } as Project;
        currentList[idx] = updatedProject;
      } else {
        updatedProject = {
          id: project.id,
          title: project.title || 'Novo Projeto',
          slug: project.slug || slugify(project.title || 'novo-projeto'),
          short_description: project.short_description || '',
          cover_image: project.cover_image || '',
          year: project.year || new Date().getFullYear(),
          status: project.status || 'publicado',
          featured: Boolean(project.featured),
          display_order: project.display_order || currentList.length + 1,
          category_id: project.category_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        currentList.push(updatedProject);
      }
    } else {
      updatedProject = {
        id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        title: project.title || 'Novo Projeto',
        slug: project.slug || slugify(project.title || 'novo-projeto'),
        short_description: project.short_description || '',
        cover_image: project.cover_image || '',
        year: project.year || new Date().getFullYear(),
        status: project.status || 'publicado',
        featured: Boolean(project.featured),
        display_order: project.display_order || currentList.length + 1,
        category_id: project.category_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      currentList.push(updatedProject);
    }

    setLocal(STORAGE_KEY_PROJECTS, currentList);

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase.from('projects').select('id').eq('id', updatedProject.id).maybeSingle();
        if (existing) {
          await supabase.from('projects').update(updatedProject).eq('id', updatedProject.id);
        } else {
          await supabase.from('projects').insert([updatedProject]);
        }
      } catch (err) {
        console.warn('Erro ao salvar projeto no Supabase:', err);
      }
    }

    return updatedProject;
  },

  async deleteProject(id: string): Promise<boolean> {
    const currentList = getLocal<Project[]>(STORAGE_KEY_PROJECTS, INITIAL_PROJECTS);
    const filtered = currentList.filter((p) => p.id !== id);
    setLocal(STORAGE_KEY_PROJECTS, filtered);

    // Remove também blocos
    const blocksMap = getLocal<Record<string, ProjectBlock[]>>(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
    delete blocksMap[id];
    setLocal(STORAGE_KEY_BLOCKS, blocksMap);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Erro ao deletar projeto no Supabase:', err);
      }
    }

    return true;
  },

  async reorderProjects(projects: Project[]): Promise<void> {
    const updated = projects.map((p, index) => ({
      ...p,
      display_order: index + 1,
    }));
    setLocal(STORAGE_KEY_PROJECTS, updated);

    if (supabase && isSupabaseConfigured()) {
      try {
        for (const proj of updated) {
          await supabase.from('projects').update({ display_order: proj.display_order }).eq('id', proj.id);
        }
      } catch (err) {
        console.warn('Erro ao reordenar projetos no Supabase:', err);
      }
    }
  },

  // ========================================================
  // BLOCOS DE CONTEÚDO (PROJECT_BLOCKS)
  // ========================================================
  async getProjectBlocks(projectId: string): Promise<ProjectBlock[]> {
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('project_blocks')
          .select('*')
          .eq('project_id', projectId)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const blocksMap = getLocal<Record<string, ProjectBlock[]>>(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
          blocksMap[projectId] = data as ProjectBlock[];
          setLocal(STORAGE_KEY_BLOCKS, blocksMap);
          return data as ProjectBlock[];
        }
      } catch (err) {
        console.warn('Erro ao buscar blocos do projeto no Supabase:', err);
      }
    }

    const blocksMap = getLocal<Record<string, ProjectBlock[]>>(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
    const list = blocksMap[projectId] || [];
    return list.sort((a, b) => a.display_order - b.display_order);
  },

  async saveProjectBlock(block: Partial<ProjectBlock> & { project_id: string; type: ProjectBlock['type'] }): Promise<ProjectBlock> {
    const blocksMap = getLocal<Record<string, ProjectBlock[]>>(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
    const currentList = blocksMap[block.project_id] || [];
    let updatedBlock: ProjectBlock;

    if (block.id) {
      const idx = currentList.findIndex((b) => b.id === block.id);
      if (idx !== -1) {
        updatedBlock = {
          ...currentList[idx],
          ...block,
        } as ProjectBlock;
        currentList[idx] = updatedBlock;
      } else {
        updatedBlock = {
          id: block.id,
          project_id: block.project_id,
          type: block.type,
          content: block.content || '',
          media_url: block.media_url || '',
          alt_text: block.alt_text || '',
          caption: block.caption || '',
          transcript: block.transcript || '',
          display_order: block.display_order || currentList.length + 1,
          created_at: new Date().toISOString(),
        };
        currentList.push(updatedBlock);
      }
    } else {
      updatedBlock = {
        id: 'blk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        project_id: block.project_id,
        type: block.type,
        content: block.content || '',
        media_url: block.media_url || '',
        alt_text: block.alt_text || '',
        caption: block.caption || '',
        transcript: block.transcript || '',
        display_order: block.display_order || currentList.length + 1,
        created_at: new Date().toISOString(),
      };
      currentList.push(updatedBlock);
    }

    blocksMap[block.project_id] = currentList;
    setLocal(STORAGE_KEY_BLOCKS, blocksMap);

    if (supabase && isSupabaseConfigured()) {
      try {
        const { data: existing } = await supabase.from('project_blocks').select('id').eq('id', updatedBlock.id).maybeSingle();
        if (existing) {
          await supabase.from('project_blocks').update(updatedBlock).eq('id', updatedBlock.id);
        } else {
          await supabase.from('project_blocks').insert([updatedBlock]);
        }
      } catch (err) {
        console.warn('Erro ao salvar bloco no Supabase:', err);
      }
    }

    return updatedBlock;
  },

  async deleteProjectBlock(projectId: string, blockId: string): Promise<boolean> {
    const blocksMap = getLocal<Record<string, ProjectBlock[]>>(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
    const currentList = blocksMap[projectId] || [];
    blocksMap[projectId] = currentList.filter((b) => b.id !== blockId);
    setLocal(STORAGE_KEY_BLOCKS, blocksMap);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('project_blocks').delete().eq('id', blockId);
      } catch (err) {
        console.warn('Erro ao deletar bloco no Supabase:', err);
      }
    }

    return true;
  },

  async reorderProjectBlocks(projectId: string, blocks: ProjectBlock[]): Promise<void> {
    const blocksMap = getLocal<Record<string, ProjectBlock[]>>(STORAGE_KEY_BLOCKS, INITIAL_BLOCKS);
    const updated = blocks.map((b, index) => ({
      ...b,
      display_order: index + 1,
    }));
    blocksMap[projectId] = updated;
    setLocal(STORAGE_KEY_BLOCKS, blocksMap);

    if (supabase && isSupabaseConfigured()) {
      try {
        for (const block of updated) {
          await supabase.from('project_blocks').update({ display_order: block.display_order }).eq('id', block.id);
        }
      } catch (err) {
        console.warn('Erro ao reordenar blocos no Supabase:', err);
      }
    }
  },
};
