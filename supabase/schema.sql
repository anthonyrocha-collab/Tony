-- ==========================================================
-- SUPERPROMPT: PORTFÓLIO PESSOAL AUTORAL
-- Script SQL Completo de Migração, Índices, RLS e Storage
-- ==========================================================

-- Habilita extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA: portfolio_settings (Configurações Gerais, Bio e Design System)
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_name TEXT NOT NULL DEFAULT 'Meu Portfólio',
  tagline TEXT DEFAULT 'Designer & Desenvolvedor Autoral',
  about_title TEXT DEFAULT 'Sobre Mim & Prática Criativa',
  about_text TEXT DEFAULT 'Sou um profissional multidisciplinar focado na criação de experiências digitais significativas, aliando design system, usabilidade, acessibilidade e tecnologia autoral.',
  short_bio TEXT DEFAULT 'Designer, pesquisador e criador digital focado em produtos acessíveis e expressivos.',
  profile_image TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '5511999999999',
  email_public TEXT DEFAULT 'contato@exemplo.com',
  location TEXT DEFAULT 'São Paulo, Brasil',
  social_links JSONB DEFAULT '[
    {"platform": "github", "label": "GitHub", "url": "https://github.com"},
    {"platform": "linkedin", "label": "LinkedIn", "url": "https://linkedin.com"},
    {"platform": "behance", "label": "Behance", "url": "https://behance.net"}
  ]'::jsonb,
  ux_voice TEXT DEFAULT 'direto',
  theme_config JSONB DEFAULT '{
    "colors": {
      "background": "#0c0d10",
      "surface": "#16181f",
      "textPrimary": "#f1f3f7",
      "textSecondary": "#9ca3af",
      "primary": "#3b82f6",
      "secondary": "#8b5cf6",
      "accent": "#06b6d4",
      "border": "#272a37",
      "focus": "#60a5fa",
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444"
    },
    "typography": {
      "titleFont": "Plus Jakarta Sans, sans-serif",
      "bodyFont": "Inter, sans-serif",
      "baseFontSize": 16,
      "scaleRatio": 1.25
    },
    "shape": {
      "borderRadius": "12px",
      "borderWidth": "1px",
      "borderStyle": "solid",
      "shadowLevel": "medium"
    },
    "layout": {
      "maxContainerWidth": "1200px",
      "gridColumns": 3,
      "sectionGap": "4rem",
      "cardGap": "1.5rem"
    },
    "motion": {
      "duration": "0.3s",
      "easing": "cubic-bezier(0.16, 1, 0.3, 1)",
      "intensity": "moderate",
      "reducedMotionSupport": true
    },
    "uxWriting": {
      "projectCtaLabel": "Explorar projeto",
      "aboutNavLabel": "Sobre",
      "projectsNavLabel": "Projetos",
      "contactNavLabel": "Contato",
      "filterAllLabel": "Todos os Projetos",
      "emptyProjectsMessage": "Nenhum projeto encontrado nesta categoria no momento.",
      "emptyCategoryMessage": "Ainda não há categorias cadastradas.",
      "whatsappTemplate": "Olá! Meu nome é {nome}.\nEstou entrando em contato sobre: {assunto}.\n\n{mensagem}"
    }
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA: categories (Categorias dos Projetos)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA: projects (Projetos do Portfólio)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('rascunho', 'publicado')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA: project_blocks (Blocos Dinâmicos de Conteúdo do Projeto)
CREATE TABLE IF NOT EXISTS public.project_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('texto', 'imagem', 'video_youtube', 'audio')),
  content TEXT DEFAULT '',
  media_url TEXT DEFAULT '',
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  transcript TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- ÍNDICES PARA ALTA PERFORMANCE
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_settings_owner ON public.portfolio_settings(owner_id);
CREATE INDEX IF NOT EXISTS idx_categories_owner ON public.categories(owner_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_blocks_project ON public.project_blocks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_blocks_order ON public.project_blocks(display_order);

-- ==========================================================
-- TRIGGER DE ATUALIZAÇÃO DO UPDATED_AT
-- ==========================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_portfolio_settings_updated ON public.portfolio_settings;
CREATE TRIGGER tr_portfolio_settings_updated
BEFORE UPDATE ON public.portfolio_settings
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS tr_projects_updated ON public.projects;
CREATE TRIGGER tr_projects_updated
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para portfolio_settings
-- Visitantes: leitura pública
DROP POLICY IF EXISTS "Public can view portfolio settings" ON public.portfolio_settings;
CREATE POLICY "Public can view portfolio settings"
  ON public.portfolio_settings FOR SELECT
  USING (true);

-- Dono autenticado: controle total
DROP POLICY IF EXISTS "Owner can manage portfolio settings" ON public.portfolio_settings;
CREATE POLICY "Owner can manage portfolio settings"
  ON public.portfolio_settings FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 2. Políticas para categories
-- Visitantes: leitura pública de categorias
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
  ON public.categories FOR SELECT
  USING (true);

-- Dono autenticado: controle total
DROP POLICY IF EXISTS "Owner can manage categories" ON public.categories;
CREATE POLICY "Owner can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 3. Políticas para projects
-- Visitantes: leitura de projetos publicados
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'publicado');

-- Dono autenticado: controle total de seus projetos (mesmo rascunhos)
DROP POLICY IF EXISTS "Owner can manage all their projects" ON public.projects;
CREATE POLICY "Owner can manage all their projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. Políticas para project_blocks
-- Visitantes: leitura de blocos de projetos publicados
DROP POLICY IF EXISTS "Public can view blocks of published projects" ON public.project_blocks;
CREATE POLICY "Public can view blocks of published projects"
  ON public.project_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = public.project_blocks.project_id
      AND public.projects.status = 'publicado'
    )
  );

-- Dono autenticado: controle total de blocos de seus projetos
DROP POLICY IF EXISTS "Owner can manage blocks of their projects" ON public.project_blocks;
CREATE POLICY "Owner can manage blocks of their projects"
  ON public.project_blocks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = public.project_blocks.project_id
      AND public.projects.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = public.project_blocks.project_id
      AND public.projects.owner_id = auth.uid()
    )
  );

-- ==========================================================
-- STORAGE BUCKET: portfolio-media
-- ==========================================================
-- Observação: Crie o bucket 'portfolio-media' no painel Supabase Storage como público
-- Abaixo estão as políticas de Storage para inserção segura pelo proprietário:

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública dos arquivos do bucket
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- Dono autenticado pode fazer upload
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

-- Dono autenticado pode atualizar e excluir
DROP POLICY IF EXISTS "Authenticated users can update and delete media" ON storage.objects;
CREATE POLICY "Authenticated users can update and delete media"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'portfolio-media');
