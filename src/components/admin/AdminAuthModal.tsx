import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

export const AdminAuthModal: React.FC = () => {
  const { signIn, signUp, loginAsLocalAdmin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const res = await signUp(email, password);
        if (res.error) {
          setError(res.error);
        } else if (res.message) {
          setMessage(res.message);
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary)]/20">
          <ShieldCheck className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold font-title text-[var(--color-text-primary)]">
          Área Administrativa
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Acesso restrito para o proprietário do portfólio autoral.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-[var(--radius-sm)] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div role="status" className="p-3.5 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="admin-auth-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" aria-hidden="true" />
            <input
              type="email"
              id="admin-auth-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@dominio.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-auth-pass" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            Senha
          </label>
          <div className="relative">
            <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" aria-hidden="true" />
            <input
              type="password"
              id="admin-auth-pass"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-[var(--radius-sm)] text-sm font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] cursor-pointer shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Verificando...' : isRegister ? 'Criar Conta de Autor' : 'Entrar no Painel'}
        </button>
      </form>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
            setMessage(null);
          }}
          className="text-[var(--color-primary)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded p-1"
        >
          {isRegister ? 'Já tem conta? Fazer login' : 'Primeiro acesso? Criar conta'}
        </button>
      </div>

      {/* Acesso de Teste Imediato (Fallback de Desenvolvimento) */}
      <div className="pt-2 border-t border-[var(--color-border)]">
        <button
          type="button"
          onClick={loginAsLocalAdmin}
          className="w-full py-2 px-3 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors min-h-[44px] cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Acessar Modo Demonstração Imediata</span>
        </button>
      </div>
    </div>
  );
};
