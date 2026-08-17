import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, FolderPlus, AlertTriangle } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Category } from '../../types';
import { Modal } from '../common/Modal';
import { slugify } from '../../utils/defaults';

export const AdminCategoriesTab: React.FC = () => {
  const { categories, projects, createCategory, updateCategory, deleteCategory, reorderCategories } = usePortfolio();

  // Estado do Modal de Criação / Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  // Estado do Modal de Exclusão Segura
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteAction, setDeleteAction] = useState<'set_null' | 'delete_projects' | 'reassign'>('set_null');
  const [reassignTargetId, setReassignTargetId] = useState<string>('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      await updateCategory(editingCategory.id, {
        name,
        slug: slug || slugify(name),
        description,
      });
    } else {
      await createCategory({
        name,
        slug: slug || slugify(name),
        description,
        display_order: categories.length + 1,
      });
    }

    setModalOpen(false);
  };

  const handleOpenDelete = (cat: Category) => {
    setCategoryToDelete(cat);
    const otherCats = categories.filter((c) => c.id !== cat.id);
    setReassignTargetId(otherCats.length > 0 ? otherCats[0].id : '');
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id, deleteAction, reassignTargetId);
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const nextList = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextList.length) return;

    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;

    await reorderCategories(nextList);
  };

  const getProjectCount = (catId: string) => {
    return projects.filter((p) => p.category_id === catId).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div>
          <h2 className="text-xl font-bold font-title text-[var(--color-text-primary)]">
            Gerenciamento de Categorias
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Organize os eixos temáticos e áreas de atuação do seu portfólio.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity min-h-[44px] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Lista de Categorias */}
      <div className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)] space-y-3">
            <FolderPlus className="w-12 h-12 mx-auto text-[var(--color-primary)] opacity-40" />
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Nenhuma categoria cadastrada</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              Criar primeira categoria
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {categories.map((cat, idx) => {
              const count = getProjectCount(cat.id);
              return (
                <div key={cat.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--color-text-primary)]">{cat.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {count} {count === 1 ? 'projeto' : 'projetos'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[var(--color-text-secondary)] truncate max-w-md">
                        {cat.description}
                      </p>
                    )}
                    <span className="text-[11px] text-[var(--color-text-secondary)] block font-mono">
                      /{cat.slug}
                    </span>
                  </div>

                  {/* Ações de Reordenação e Edição */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveOrder(idx, 'up')}
                      aria-label={`Mover categoria ${cat.name} para cima`}
                      className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === categories.length - 1}
                      onClick={() => moveOrder(idx, 'down')}
                      aria-label={`Mover categoria ${cat.name} para baixo`}
                      className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      aria-label={`Editar categoria ${cat.name}`}
                      className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(cat)}
                      aria-label={`Excluir categoria ${cat.name}`}
                      className="p-2 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="cat-modal-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Nome da Categoria <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              type="text"
              id="cat-modal-name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Identidade Visual"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cat-modal-slug" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Slug da URL
            </label>
            <input
              type="text"
              id="cat-modal-slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="identidade-visual"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] font-mono min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cat-modal-desc" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Descrição (Opcional)
            </label>
            <textarea
              id="cat-modal-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve explicação dos projetos reunidos nesta categoria"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 min-h-[44px] cursor-pointer"
            >
              Salvar Categoria
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Exclusão Segura com Proteção contra Perda de Projetos */}
      {categoryToDelete && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={`Excluir Categoria: ${categoryToDelete.name}`}
          maxWidth="md"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-[var(--radius-sm)] bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">Atenção com os projetos vinculados</p>
                <p className="mt-1 text-amber-200/80">
                  Esta categoria possui <strong>{getProjectCount(categoryToDelete.id)} projeto(s)</strong> vinculados.
                  Escolha o que deseja fazer com esses projetos antes de excluir a categoria:
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  value="set_null"
                  checked={deleteAction === 'set_null'}
                  onChange={() => setDeleteAction('set_null')}
                  className="mt-1"
                />
                <div className="text-xs">
                  <strong className="block text-[var(--color-text-primary)]">Manter projetos sem categoria</strong>
                  <span className="text-[var(--color-text-secondary)]">Os projetos continuam existindo e publicados, mas sem categoria associada.</span>
                </div>
              </label>

              {categories.filter((c) => c.id !== categoryToDelete.id).length > 0 && (
                <label className="flex items-start gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] cursor-pointer">
                  <input
                    type="radio"
                    name="deleteAction"
                    value="reassign"
                    checked={deleteAction === 'reassign'}
                    onChange={() => setDeleteAction('reassign')}
                    className="mt-1"
                  />
                  <div className="text-xs flex-1">
                    <strong className="block text-[var(--color-text-primary)]">Mover projetos para outra categoria</strong>
                    <select
                      disabled={deleteAction !== 'reassign'}
                      value={reassignTargetId}
                      onChange={(e) => setReassignTargetId(e.target.value)}
                      className="mt-2 w-full px-3 py-1.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                    >
                      {categories
                        .filter((c) => c.id !== categoryToDelete.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-3 p-3 rounded-[var(--radius-sm)] bg-red-500/5 border border-red-500/20 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  value="delete_projects"
                  checked={deleteAction === 'delete_projects'}
                  onChange={() => setDeleteAction('delete_projects')}
                  className="mt-1"
                />
                <div className="text-xs">
                  <strong className="block text-red-400">Excluir permanentemente todos os projetos vinculados</strong>
                  <span className="text-[var(--color-text-secondary)]">Cuidado: Todos os {getProjectCount(categoryToDelete.id)} projetos serão apagados.</span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white min-h-[44px] cursor-pointer shadow-md"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
