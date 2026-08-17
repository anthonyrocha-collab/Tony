import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
  Layers,
} from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Project } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { AdminProjectEditor } from './AdminProjectEditor';

export const AdminProjectsTab: React.FC = () => {
  const { projects, categories, saveProject, deleteProject, reorderProjects } = usePortfolio();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'todos') return true;
    return p.category_id === selectedCategory;
  });

  const handleToggleStatus = async (proj: Project) => {
    const nextStatus = proj.status === 'publicado' ? 'rascunho' : 'publicado';
    await saveProject({
      id: proj.id,
      status: nextStatus,
    });
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= filteredProjects.length) return;

    const nextList = [...projects];
    const itemA = filteredProjects[index];
    const itemB = filteredProjects[targetIdx];

    const idxA = nextList.findIndex((p) => p.id === itemA.id);
    const idxB = nextList.findIndex((p) => p.id === itemB.id);

    const temp = nextList[idxA];
    nextList[idxA] = nextList[idxB];
    nextList[idxB] = temp;

    await reorderProjects(nextList);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    await deleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  // Se estiver editando ou criando, mostra o Editor Completo
  if (isCreating || editingProject) {
    return (
      <AdminProjectEditor
        project={editingProject}
        onBack={() => {
          setIsCreating(false);
          setEditingProject(null);
        }}
        onSaved={() => {
          setIsCreating(false);
          setEditingProject(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barra de Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div>
          <h2 className="text-xl font-bold font-title text-[var(--color-text-primary)]">
            Gerenciamento de Projetos
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Cadastre, edite, ordene e configure blocos de mídia para suas obras.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity min-h-[44px] cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Projeto</span>
        </button>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('todos')}
          className={`px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold tracking-wide border cursor-pointer min-h-[44px] transition-colors ${
            selectedCategory === 'todos'
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
          }`}
        >
          Todos ({projects.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold tracking-wide border cursor-pointer min-h-[44px] transition-colors ${
              selectedCategory === c.id
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
            }`}
          >
            {c.name} ({projects.filter((p) => p.category_id === c.id).length})
          </button>
        ))}
      </div>

      {/* Lista de Projetos */}
      <div className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)] space-y-3">
            <Layers className="w-12 h-12 mx-auto text-[var(--color-primary)] opacity-40" />
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Nenhum projeto encontrado nesta visualização</p>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Cadastrar primeiro projeto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Capa e Dados do Projeto */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 aspect-16/10 rounded overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0 flex items-center justify-center">
                    {project.cover_image ? (
                      <img src={project.cover_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-[var(--color-text-primary)] truncate">
                        {project.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(project)}
                        aria-label={`Alterar status do projeto. Atualmente ${project.status}`}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border cursor-pointer ${
                          project.status === 'publicado'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {project.status === 'publicado' ? '● Publicado' : '○ Rascunho'}
                      </button>

                      {project.featured && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
                          Destaque
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      <span>{project.category_name || 'Sem categoria'}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                      <span>•</span>
                      <span className="font-mono">/{project.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Controles de Ação e Reordenação */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, 'up')}
                    aria-label={`Mover ${project.title} para cima`}
                    className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] disabled:opacity-30 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === filteredProjects.length - 1}
                    onClick={() => handleMoveOrder(idx, 'down')}
                    aria-label={`Mover ${project.title} para baixo`}
                    className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] disabled:opacity-30 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProject(project)}
                    aria-label={`Editar projeto ${project.title}`}
                    className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectToDelete(project)}
                    aria-label={`Excluir projeto ${project.title}`}
                    className="p-2 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Exclusão do Projeto */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Excluir Projeto: ${projectToDelete?.title}`}
        message="Tem certeza de que deseja excluir permanentemente este projeto e todos os seus blocos de conteúdo? Esta ação não pode ser revertida."
        confirmLabel="Excluir Projeto Definitivamente"
      />
    </div>
  );
};
