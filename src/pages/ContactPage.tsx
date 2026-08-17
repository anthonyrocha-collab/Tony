import React, { useState } from 'react';
import { MessageSquare, Mail, MapPin, Send, CheckCircle2, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { generateWhatsAppLink } from '../utils/defaults';

export const ContactPage: React.FC = () => {
  const { settings } = usePortfolio();

  const [nome, setNome] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState<{ nome?: string; assunto?: string; mensagem?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const errs: { nome?: string; assunto?: string; mensagem?: string } = {};
    if (!nome.trim()) {
      errs.nome = 'Por favor, informe seu nome.';
    }
    if (!assunto.trim()) {
      errs.assunto = 'Por favor, informe o assunto da mensagem.';
    }
    if (!mensagem.trim()) {
      errs.mensagem = 'Por favor, digite a sua mensagem.';
    } else if (mensagem.trim().length < 10) {
      errs.mensagem = 'A mensagem deve conter pelo menos 10 caracteres.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const template =
      settings.theme_config?.uxWriting?.whatsappTemplate ||
      'Olá! Meu nome é {nome}.\nEstou entrando em contato sobre: {assunto}.\n\n{mensagem}';

    const targetPhone = settings.whatsapp || '5511999999999';
    const whatsappUrl = generateWhatsAppLink(targetPhone, template, {
      nome: email ? `${nome} (${email})` : nome,
      assunto,
      mensagem,
    });

    // Abre o WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSuccess(true);
  };

  return (
    <article className="space-y-12 sm:space-y-16 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Cabeçalho da Página de Contato */}
      <header className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)]">
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{settings.theme_config?.uxWriting?.contactNavLabel || 'Contato & Diálogo'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-title tracking-tight text-[var(--color-text-primary)]">
          Vamos Iniciar Uma Conversa?
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
          Tem interesse em encomendar um projeto, propor uma pesquisa ou discutir parcerias criativas? Preencha o formulário abaixo para abrir um diálogo direto pelo WhatsApp ou utilize os canais diretos.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Formulário Principal */}
        <section aria-labelledby="contact-form-title" className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
            <h2 id="contact-form-title" className="text-xl font-bold font-title text-[var(--color-text-primary)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
              <span>Mensagem Direta via WhatsApp</span>
            </h2>

            {isSuccess && (
              <div
                role="status"
                className="p-4 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">WhatsApp aberto com sucesso!</p>
                  <p className="text-xs text-emerald-300">
                    Sua mensagem formatada foi encaminhada para a janela do WhatsApp. Se desejar, envie outra mensagem.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSendWhatsApp} noValidate className="space-y-5">
              {/* Campo: Nome */}
              <div className="space-y-1.5">
                <label htmlFor="contact-nome" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Seu Nome <span className="text-[var(--color-primary)]">*</span>
                </label>
                <input
                  type="text"
                  id="contact-nome"
                  name="nome"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!errors.nome}
                  aria-describedby={errors.nome ? 'error-nome' : undefined}
                  placeholder="Como posso te chamar?"
                  className={`w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] ${
                    errors.nome ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
                  }`}
                />
                {errors.nome && (
                  <p id="error-nome" role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.nome}</span>
                  </p>
                )}
              </div>

              {/* Campo: E-mail (Opcional) */}
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Seu E-mail <span className="text-xs lowercase text-[var(--color-text-secondary)] font-normal">(opcional)</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@dominio.com"
                  className="w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px]"
                />
              </div>

              {/* Campo: Assunto */}
              <div className="space-y-1.5">
                <label htmlFor="contact-assunto" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Assunto <span className="text-[var(--color-primary)]">*</span>
                </label>
                <input
                  type="text"
                  id="contact-assunto"
                  name="assunto"
                  value={assunto}
                  onChange={(e) => {
                    setAssunto(e.target.value);
                    if (errors.assunto) setErrors((prev) => ({ ...prev, assunto: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!errors.assunto}
                  aria-describedby={errors.assunto ? 'error-assunto' : undefined}
                  placeholder="Ex: Proposta de Projeto, Consultoria ou Dúvida"
                  className={`w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] ${
                    errors.assunto ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
                  }`}
                />
                {errors.assunto && (
                  <p id="error-assunto" role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.assunto}</span>
                  </p>
                )}
              </div>

              {/* Campo: Mensagem */}
              <div className="space-y-1.5">
                <label htmlFor="contact-mensagem" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Mensagem <span className="text-[var(--color-primary)]">*</span>
                </label>
                <textarea
                  id="contact-mensagem"
                  name="mensagem"
                  rows={4}
                  value={mensagem}
                  onChange={(e) => {
                    setMensagem(e.target.value);
                    if (errors.mensagem) setErrors((prev) => ({ ...prev, mensagem: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!errors.mensagem}
                  aria-describedby={errors.mensagem ? 'error-mensagem' : undefined}
                  placeholder="Descreva brevemente sua ideia, objetivo ou projeto..."
                  className={`w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none ${
                    errors.mensagem ? 'border-red-500 ring-1 ring-red-500' : 'border-[var(--color-border)]'
                  }`}
                />
                {errors.mensagem && (
                  <p id="error-mensagem" role="alert" className="text-xs text-[var(--color-error)] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.mensagem}</span>
                  </p>
                )}
              </div>

              {/* Botão Enviar pelo WhatsApp */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="send-whatsapp-btn"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[var(--radius-sm)] text-sm font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[44px] cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Enviar pelo WhatsApp</span>
                </button>
                <p className="text-xs text-center text-[var(--color-text-secondary)] mt-2">
                  Uma mensagem estruturada e codificada será gerada para o número cadastrado.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Canais Diretos & Redes */}
        <aside aria-labelledby="direct-channels-title" className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-6">
            <h2 id="direct-channels-title" className="text-lg font-bold font-title text-[var(--color-text-primary)]">
              Informações Diretas
            </h2>

            <div className="space-y-4 text-sm">
              {settings.whatsapp && (
                <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                    WhatsApp Cadastrado
                  </span>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded"
                  >
                    <span>+{settings.whatsapp}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              )}

              {settings.email_public && (
                <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                    E-mail Profissional
                  </span>
                  <a
                    href={`mailto:${settings.email_public}`}
                    className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none rounded break-all"
                  >
                    <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>{settings.email_public}</span>
                  </a>
                </div>
              )}

              {settings.location && (
                <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1">
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                    Localização & Fuso Horário
                  </span>
                  <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>{settings.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Redes Sociais */}
            {settings.social_links && settings.social_links.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Redes Externas
                </h3>
                <ul className="space-y-2" aria-label="Lista de redes sociais">
                  {settings.social_links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] hover:bg-[var(--color-primary)]/10 text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
};
