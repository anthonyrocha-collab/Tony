import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Eye,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Project, ProjectBlock, BlockType } from '../../types';
import { uploadMediaToStorage } from '../../services/supabase';
import { slugify, getYouTubeEmbedUrl } from '../../utils/defaults';
import { ConfirmModal } from '../common/ConfirmModal';

interface AdminProjectEditorProps {
  project: Project | null;
  onBack: () => void;
  onSaved: () => void;
}

export const AdminProjectEditor: React.FC<AdminProjectEditorProps> = ({
  project,
  onBack,
  onSaved,
}) => {
  const { categories, saveProject, getProjectBlocks, saveProjectBlock, deleteProjectBlock, reorderProjectBlocks, showToast } = usePortfolio();

  // Dados Gerais do Projeto
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [categoryId, setCategoryId] = useState<string>(project?.category_id || '');
  const [year, setYear] = useState<number>(project?.year || new Date().getFullYear());
  const [shortDescription, setShortDescription] = useState(project?.short_description || '');
  const [coverImage, setCoverImage] = useState(project?.cover_image || '');
  const [status, setStatus] = useState<'rascunho' | 'publicado'>(project?.status || 'publicado');
  const [featured, setFeatured] = useState<boolean>(project?.featured || false);

  // Blocos de Conteúdo
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  // Upload por bloco index/id
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (project?.id) {
      getProjectBlocks(project.id).then((b) => setBlocks(b));
    }
  }, [project, getProjectBlocks]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!project) {
      setSlug(slugify(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const res = await uploadMediaToStorage(file, 'covers');
      if (res.error) {
        showToast('error', 'Erro no upload da capa', res.error);
      } else if (res.url) {
        setCoverImage(res.url);
        showToast('success', 'Imagem de capa carregada com sucesso!');
      }
    } catch (err: any) {
      showToast('error', 'Erro no upload', err.message);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleAddBlock = async (type: BlockType) => {
    if (!title.trim()) {
      showToast('warning', 'Defina um título para o projeto antes de adicionar blocos.');
      return;
    }

    // Se o projeto ainda não foi persistido, salva ele primeiro
    let currentProjectId = project?.id;
    if (!currentProjectId) {
      const saved = await saveProject({
        title,
        slug: slug || slugify(title),
        category_id: categoryId || null,
        year,
        short_description: shortDescription,
        cover_image: coverImage,
        status,
        featured,
      });
      currentProjectId = saved.id;
    }

    const newBlock = await saveProjectBlock({
      project_id: currentProjectId,
      type,
      content: type === 'texto' ? '## Novo Subtítulo\n\nDigite o conteúdo do seu parágrafo aqui...' : '',
      media_url: '',
      alt_text: '',
      caption: '',
      transcript: '',
      display_order: blocks.length + 1,
    });

    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleUpdateBlockField = (blockId: string, field: keyof ProjectBlock, val: any) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, [field]: val } : b))
    );
  };

  const handleSaveBlock = async (block: ProjectBlock) => {
    await saveProjectBlock(block);
  };

  const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const nextBlocks = [...blocks];
    const temp = nextBlocks[index];
    nextBlocks[index] = nextBlocks[targetIndex];
    nextBlocks[targetIndex] = temp;

    setBlocks(nextBlocks);
    if (project?.id) {
      await reorderProjectBlocks(project.id, nextBlocks);
    }
  };

  const handleDeleteBlockConfirm = async () => {
    if (!blockToDelete || !project?.id) return;
    await deleteProjectBlock(project.id, blockToDelete);
    setBlocks((prev) => prev.filter((b) => b.id !== blockToDelete));
    setBlockToDelete(null);
  };

  const handleMediaUploadForBlock = async (
    blockId: string,
    file: File,
    type: 'imagem' | 'audio'
  ) => {
    setUploadingBlockId(blockId);
    try {
      const folder = type === 'audio' ? 'audio' : 'blocks';
      const res = await uploadMediaToStorage(file, folder);
      if (res.error) {
        showToast('error', 'Erro no upload', res.error);
      } else if (res.url) {
        handleUpdateBlockField(blockId, 'media_url', res.url);
        // Salva de imediato no banco
        const targetBlock = blocks.find((b) => b.id === blockId);
        if (targetBlock) {
          await saveProjectBlock({ ...targetBlock, media_url: res.url });
        }
        showToast('success', `${type === 'audio' ? 'Áudio' : 'Imagem'} carregado com sucesso!`);
      }
    } catch (err: any) {
      showToast('error', 'Erro ao enviar mídia', err.message);
    } finally {
      setUploadingBlockId(null);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('error', 'O projeto precisa de um título.');
      return;
    }

    setIsSaving(true);
    try {
      const savedProj = await saveProject({
        id: project?.id,
        title,
        slug: slug || slugify(title),
        category_id: categoryId || null,
        year,
        short_description: shortDescription,
        cover_image: coverImage,
        status,
        featured,
      });

      // Salva todos os blocos
      for (const block of blocks) {
        await saveProjectBlock({
          ...block,
          project_id: savedProj.id,
        });
      }

      showToast('success', `Projeto "${savedProj.title}" salvo com sucesso!`);
      onSaved();
    } catch (err: any) {
      showToast('error', 'Erro ao salvar projeto', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 animate-in fade-in duration-200">
      {/* Barra de Topo do Editor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Projetos</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity min-h-[44px] shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Projeto'}</span>
          </button>
        </div>
      </div>

      {/* Dados Principais do Projeto */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
            <span>Metadados & Capa do Projeto</span>
          </h2>

          <div className="flex items-center gap-3">
            {/* Status Rascunho / Publicado */}
            <div className="flex items-center gap-2">
              <label htmlFor="proj-status" className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                Status:
              </label>
              <select
                id="proj-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase min-h-[44px] border ${
                  status === 'publicado'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                <option value="publicado">Publicado</option>
                <option value="rascunho">Rascunho</option>
              </select>
            </div>

            {/* Destaque */}
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-primary)] cursor-pointer min-h-[44px] px-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[var(--color-primary)] w-4 h-4"
              />
              <span>Destaque na Home</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="proj-title" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Título do Projeto <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              type="text"
              id="proj-title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Identidade Visual Autoral"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-slug" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Slug da URL
            </label>
            <input
              type="text"
              id="proj-slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="identidade-visual-autoral"
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] font-mono min-h-[44px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="proj-category" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Categoria
            </label>
            <select
              id="proj-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            >
              <option value="">Sem categoria definida</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-year" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
              Ano de Produção
            </label>
            <input
              type="number"
              id="proj-year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] min-h-[44px]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="proj-short-desc" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            Apresentação Breve (Sinopse do Card e Cabeçalho)
          </label>
          <textarea
            id="proj-short-desc"
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Resumo em 1 ou 2 frases sobre a essência do projeto..."
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] leading-relaxed"
          />
        </div>

        {/* Upload da Imagem de Capa */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            Imagem de Capa do Projeto
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-36 aspect-16/10 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              {coverImage ? (
                <img src={coverImage} alt="Preview da capa" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[var(--color-text-secondary)]" />
              )}
            </div>

            <div className="space-y-2 flex-1 w-full">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Insira a URL da capa ou envie o arquivo abaixo"
                aria-label="URL da Imagem de Capa"
                className="w-full px-4 py-2 text-xs rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer transition-colors min-h-[44px]">
                  <Upload className="w-4 h-4" />
                  <span>{isUploadingCover ? 'Enviando capa...' : 'Fazer Upload da Capa'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                    className="sr-only"
                  />
                </label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="text-xs text-red-400 hover:underline p-1 cursor-pointer"
                  >
                    Remover Capa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gerenciamento Dinâmico de Blocos de Conteúdo */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold font-title text-[var(--color-text-primary)]">
              Blocos Dinâmicos de Conteúdo
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
              Construa o projeto livremente combinando textos, imagens com texto alternativo, vídeos e áudios.
            </p>
          </div>

          {/* Botões para Adicionar Blocos */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddBlock('texto')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Texto</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddBlock('imagem')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Imagem</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddBlock('video_youtube')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>+ YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddBlock('audio')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
            >
              <Music className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Áudio</span>
            </button>
          </div>
        </div>

        {/* Lista de Blocos */}
        {blocks.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] space-y-2">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Este projeto ainda não possui blocos de conteúdo.</p>
            <p className="text-xs">Clique nos botões acima para adicionar parágrafos, imagens, vídeos ou áudios.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blocks.map((block, idx) => {
              const isUploadingThis = uploadingBlockId === block.id;

              return (
                <div
                  key={block.id}
                  className="p-5 sm:p-6 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] shadow-xs space-y-4"
                >
                  {/* Cabeçalho do Bloco com Tipo e Controles de Ordem */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                        {block.type === 'texto' && <FileText className="w-4 h-4" />}
                        {block.type === 'imagem' && <ImageIcon className="w-4 h-4" />}
                        {block.type === 'video_youtube' && <Video className="w-4 h-4" />}
                        {block.type === 'audio' && <Music className="w-4 h-4" />}
                        <span>Bloco de {block.type.replace('_', ' ')}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, 'up')}
                        aria-label="Mover bloco para cima"
                        className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] disabled:opacity-30 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === blocks.length - 1}
                        onClick={() => handleMoveBlock(idx, 'down')}
                        aria-label="Mover bloco para baixo"
                        className="p-1.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] disabled:opacity-30 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlockToDelete(block.id)}
                        aria-label="Excluir este bloco"
                        className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 1. EDITOR DE BLOCO DE TEXTO */}
                  {block.type === 'texto' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                        Conteúdo do Texto (Suporta ## Título, ### Subtítulo, listas com -)
                      </label>
                      <textarea
                        rows={5}
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlockField(block.id, 'content', e.target.value)}
                        onBlur={() => handleSaveBlock(block)}
                        placeholder="Digite o texto estruturado do projeto..."
                        className="w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] font-mono leading-relaxed"
                      />
                    </div>
                  )}

                  {/* 2. EDITOR DE BLOCO DE IMAGEM */}
                  {block.type === 'imagem' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-4 aspect-16/10 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                          {block.media_url ? (
                            <img src={block.media_url} alt={block.alt_text || 'Preview'} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)]" />
                          )}
                        </div>

                        <div className="md:col-span-8 space-y-3">
                          <input
                            type="url"
                            value={block.media_url || ''}
                            onChange={(e) => handleUpdateBlockField(block.id, 'media_url', e.target.value)}
                            onBlur={() => handleSaveBlock(block)}
                            placeholder="URL da Imagem ou envie arquivo abaixo"
                            className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                          />
                          <label className="inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer min-h-[44px]">
                            <Upload className="w-4 h-4" />
                            <span>{isUploadingThis ? 'Enviando imagem...' : 'Upload de Imagem (Storage)'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMediaUploadForBlock(block.id, file, 'imagem');
                              }}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Texto Alternativo Obrigatório para Acessibilidade */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-primary)] flex items-center gap-1.5">
                          <span>Texto Alternativo Acessível (Alt Text)</span>
                          <span className="text-[var(--color-primary)]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={block.alt_text || ''}
                          onChange={(e) => handleUpdateBlockField(block.id, 'alt_text', e.target.value)}
                          onBlur={() => handleSaveBlock(block)}
                          placeholder="Descreva detalhadamente o que a imagem apresenta para pessoas cegas"
                          className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                        />
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          Importante: Não utilize o nome do arquivo. Descreva a cena, diagrama ou fotografia com precisão.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                          Legenda Opcional (Figcaption)
                        </label>
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={(e) => handleUpdateBlockField(block.id, 'caption', e.target.value)}
                          onBlur={() => handleSaveBlock(block)}
                          placeholder="Legenda visível exibida abaixo da imagem"
                          className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. EDITOR DE BLOCO DE VÍDEO YOUTUBE */}
                  {block.type === 'video_youtube' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-primary)]">
                          Link / URL do YouTube (Ex: https://www.youtube.com/watch?v=...)
                        </label>
                        <input
                          type="url"
                          value={block.media_url || ''}
                          onChange={(e) => handleUpdateBlockField(block.id, 'media_url', e.target.value)}
                          onBlur={() => handleSaveBlock(block)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                        />
                      </div>

                      {block.media_url && getYouTubeEmbedUrl(block.media_url) && (
                        <div className="max-w-md aspect-video rounded overflow-hidden border border-[var(--color-border)]">
                          <iframe
                            src={getYouTubeEmbedUrl(block.media_url)!}
                            title="Preview do Vídeo"
                            className="w-full h-full"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                          Legenda do Vídeo (Opcional)
                        </label>
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={(e) => handleUpdateBlockField(block.id, 'caption', e.target.value)}
                          onBlur={() => handleSaveBlock(block)}
                          placeholder="Descrição do vídeo..."
                          className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. EDITOR DE BLOCO DE ÁUDIO */}
                  {block.type === 'audio' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-primary)]">
                          Arquivo ou URL de Áudio (MP3, WAV, OGG)
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <input
                            type="url"
                            value={block.media_url || ''}
                            onChange={(e) => handleUpdateBlockField(block.id, 'media_url', e.target.value)}
                            onBlur={() => handleSaveBlock(block)}
                            placeholder="https://... ou faça upload"
                            className="flex-1 w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                          />
                          <label className="inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold bg-[var(--color-surface)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] text-[var(--color-text-primary)] cursor-pointer min-h-[44px] shrink-0">
                            <Upload className="w-4 h-4" />
                            <span>{isUploadingThis ? 'Enviando áudio...' : 'Upload de Áudio (Storage)'}</span>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMediaUploadForBlock(block.id, file, 'audio');
                              }}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
                          Título / Legenda da Faixa
                        </label>
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={(e) => handleUpdateBlockField(block.id, 'caption', e.target.value)}
                          onBlur={() => handleSaveBlock(block)}
                          placeholder="Ex: Entrevista Sonora com o Artista"
                          className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] min-h-[44px]"
                        />
                      </div>

                      {/* Transcrição Textual Acessível */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase text-[var(--color-text-primary)] flex items-center gap-1.5">
                          <span>Transcrição Textual Completa (WCAG AA)</span>
                          <span className="text-[var(--color-primary)]">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={block.transcript || ''}
                          onChange={(e) => handleUpdateBlockField(block.id, 'transcript', e.target.value)}
                          onBlur={() => handleSaveBlock(block)}
                          placeholder="Digite aqui o texto integral do que é falado ou tocado no áudio para acessibilidade..."
                          className="w-full px-3 py-2 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] leading-relaxed"
                        />
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          Conformidade WCAG: O áudio não pode ser o único meio de comunicação. A transcrição permite leitura direta.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Botão Inferior de Salvar */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] min-h-[44px] cursor-pointer"
        >
          Cancelar e Voltar
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[var(--radius-sm)] text-sm font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 min-h-[44px] shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Alterações do Projeto'}</span>
        </button>
      </div>

      {/* Modal de Confirmação de Exclusão de Bloco */}
      <ConfirmModal
        isOpen={!!blockToDelete}
        onClose={() => setBlockToDelete(null)}
        onConfirm={handleDeleteBlockConfirm}
        title="Excluir Bloco de Conteúdo"
        message="Tem certeza de que deseja remover este bloco de conteúdo do projeto? Esta ação não pode ser desfeita."
        confirmLabel="Excluir Bloco"
      />
    </form>
  );
};
