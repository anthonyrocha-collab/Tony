import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, Server, Shield, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { usePortfolio } from '../../contexts/PortfolioContext';

export const AdminSupabaseTab: React.FC = () => {
  const { showToast, loadInitialData } = usePortfolio();
  const [copiedSql, setCopiedSql] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);

    if (!isConfigured || !supabase) {
      setConnectionResult({
        success: false,
        message: 'Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão definidas. O portfólio está operando no modo local com persistência resiliente.',
      });
      setTestingConnection(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('portfolio_settings').select('id').limit(1);
      if (error) {
        setConnectionResult({
          success: false,
          message: `Erro ao conectar com Supabase: ${error.message}. Verifique se a tabela 'portfolio_settings' foi criada executando o script SQL.`,
        });
      } else {
        setConnectionResult({
          success: true,
          message: 'Conexão com o banco de dados Supabase estabelecida com sucesso! Tabelas acessíveis.',
        });
      }
    } catch (err: any) {
      setConnectionResult({
        success: false,
        message: `Falha na requisição: ${err.message}`,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCopySql = () => {
    const sqlContent = `-- ============================================================================
-- SCHEMA COMPLETO DO BANCO DE DADOS: PORTFÓLIO AUTORAL
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS portfolio_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_name TEXT NOT NULL DEFAULT 'Portfólio Autoral',
  tagline TEXT DEFAULT 'Designer & Desenvolvedor Autoral',
  about_title TEXT DEFAULT 'Sobre Mim',
  about_text TEXT DEFAULT '',
  short_bio TEXT DEFAULT '',
  profile_image TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email_public TEXT DEFAULT '',
  location TEXT DEFAULT '',
  social_links JSONB DEFAULT '[]'::jsonb,
  theme_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  year INTEGER,
  short_description TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('rascunho', 'publicado')),
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('texto', 'imagem', 'video_youtube', 'audio')),
  content TEXT,
  media_url TEXT,
  alt_text TEXT,
  caption TEXT,
  transcript TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Settings" ON portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Auth Write Settings" ON portfolio_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Auth Write Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Published Projects" ON projects FOR SELECT USING (status = 'publicado' OR auth.role() = 'authenticated');
CREATE POLICY "Auth Write Projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Blocks" ON project_blocks FOR SELECT USING (true);
CREATE POLICY "Auth Write Blocks" ON project_blocks FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio_media', 'portfolio_media', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio_media');
CREATE POLICY "Auth Upload Media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio_media');
`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlContent);
      setCopiedSql(true);
      showToast('success', 'Script SQL copiado para a área de transferência!');
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  const handleResetLocal = () => {
    if (confirm('Deseja recarregar e redefinir os dados iniciais de demonstração?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Status da Conexão */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
              <Database className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Integração & Status do Supabase</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Estado atual do backend e da persistência de dados.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] min-h-[44px] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Testando...' : 'Testar Conexão'}</span>
          </button>
        </div>

        {/* Card do Status Atual */}
        <div
          className={`p-4 rounded-[var(--radius-sm)] border flex items-start gap-3 ${
            isConfigured
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}
        >
          {isConfigured ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <Server className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
          )}
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold">
              {isConfigured
                ? 'Credenciais do Supabase Detectadas no Ambiente'
                : 'Operando em Modo de Demonstração (Local Storage Resiliente)'}
            </p>
            <p className="opacity-90 leading-relaxed text-xs">
              {isConfigured
                ? 'As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY foram encontradas. Os dados de projetos, mídias e configurações são sincronizados diretamente com sua instância do Supabase.'
                : 'O aplicativo está 100% funcional com banco de dados local armazenado no seu navegador. Você pode cadastrar projetos, testar o editor de blocos, alternar temas e gerenciar categorias livremente.'}
            </p>
          </div>
        </div>

        {/* Resultado do Teste de Conexão */}
        {connectionResult && (
          <div
            role="status"
            className={`p-4 rounded-[var(--radius-sm)] border text-xs flex items-start gap-2.5 animate-in fade-in ${
              connectionResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {connectionResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{connectionResult.success ? 'Conexão Bem-Sucedida' : 'Aviso de Conexão'}</p>
              <p className="mt-0.5 leading-relaxed">{connectionResult.message}</p>
            </div>
          </div>
        )}
      </section>

      {/* Guia de Configuração e SQL Schema */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Script de Configuração SQL & Políticas RLS</span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Copie e execute este script no <strong>SQL Editor</strong> do seu painel do Supabase para criar tabelas e storage.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 min-h-[44px] cursor-pointer shadow-sm"
          >
            {copiedSql ? (
              <>
                <Check className="w-4 h-4" />
                <span>Script Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar SQL Completo</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-secondary)] overflow-x-auto max-h-64 leading-relaxed">
          <pre>{`-- TABELAS PRINCIPAIS:
CREATE TABLE portfolio_settings (...);
CREATE TABLE categories (...);
CREATE TABLE projects (...);
CREATE TABLE project_blocks (...);

-- SEGURANÇA E POLÍTICAS RLS ATIVADAS
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_blocks ENABLE ROW LEVEL SECURITY;

-- STORAGE BUCKET:
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio_media', 'portfolio_media', true);`}</pre>
        </div>
      </section>

      {/* Ações de Manutenção Local */}
      <section className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
        <h3 className="text-base font-bold font-title text-[var(--color-text-primary)]">
          Manutenção & Limpeza
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Caso queira reiniciar todos os dados e restaurar o estado inicial com os projetos de exemplo:
        </p>
        <button
          type="button"
          onClick={handleResetLocal}
          className="px-4 py-2.5 rounded-[var(--radius-sm)] text-xs font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 min-h-[44px] cursor-pointer"
        >
          Restaurar Dados Iniciais de Demonstração
        </button>
      </section>
    </div>
  );
};
