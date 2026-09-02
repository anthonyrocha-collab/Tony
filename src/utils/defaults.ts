import { PortfolioSettings, ThemeConfig, Category, Project, ProjectBlock } from '../types';

export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    background: '#0d0f14',
    surface: '#151821',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    border: '#262b3a',
    focus: '#60a5fa',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  typography: {
    titleFont: 'Plus Jakarta Sans, system-ui, -apple-system, sans-serif',
    bodyFont: 'Inter, system-ui, -apple-system, sans-serif',
    baseFontSize: 16,
    scaleRatio: 1.25,
    titleWeight: 700,
    bodyLineHeight: 1.6,
    headingLetterSpacing: '-0.02em',
  },
  shape: {
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    shadowLevel: 'medium',
  },
  layout: {
    maxContainerWidth: '1200px',
    gridColumns: 3,
    mobileGridColumns: 1,
    sectionGap: '4rem',
    cardGap: '1.5rem',
    cardAspectRatio: '16 / 10',
  },
  motion: {
    duration: '0.3s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    intensity: 'moderate',
    reducedMotionSupport: true,
    cardHover: 'lift',
    imageHover: 'zoom',
    buttonHover: 'lift',
    entrance: 'fade',
  },
  uxWriting: {
    projectCtaLabel: 'Ver projeto',
    aboutNavLabel: 'Sobre',
    projectsNavLabel: 'Projetos',
    contactNavLabel: 'Contato',
    filterAllLabel: 'Todos os Projetos',
    emptyProjectsMessage: 'Nenhum projeto encontrado nesta categoria no momento.',
    emptyCategoryMessage: 'Ainda não há categorias cadastradas.',
    whatsappTemplate: 'Olá! Meu nome é {nome}.\nEstou entrando em contato sobre: {assunto}.\n\n{mensagem}',
  },
};

export const THEME_PRESETS: { name: string; description: string; theme: Partial<ThemeConfig> }[] = [
  {
    name: 'Estúdio Escuro (Padrão)',
    description: 'Alta imersão, contrastes precisos e foco visual na mídia autoral.',
    theme: {
      colors: {
        background: '#0d0f14',
        surface: '#151821',
        textPrimary: '#f3f4f6',
        textSecondary: '#9ca3af',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        border: '#262b3a',
        focus: '#60a5fa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      shape: {
        borderRadius: '12px',
        borderWidth: '1px',
        borderStyle: 'solid',
        shadowLevel: 'medium',
      },
    },
  },
  {
    name: 'Minimalista Editorial Claro',
    description: 'Estética clean, clara, com contrastes tipográficos nobres e espaço generoso.',
    theme: {
      colors: {
        background: '#fafaf9',
        surface: '#ffffff',
        textPrimary: '#18181b',
        textSecondary: '#52525b',
        primary: '#18181b',
        secondary: '#4f46e5',
        accent: '#0284c7',
        border: '#e4e4e7',
        focus: '#2563eb',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
      },
      shape: {
        borderRadius: '6px',
        borderWidth: '1px',
        borderStyle: 'solid',
        shadowLevel: 'small',
      },
    },
  },
  {
    name: 'Brutalismo Expressivo',
    description: 'Bordas marcadas, cantos retos, alto impacto visual e contraste vigoroso.',
    theme: {
      colors: {
        background: '#f4f4f0',
        surface: '#ffffff',
        textPrimary: '#050505',
        textSecondary: '#383838',
        primary: '#ff3366',
        secondary: '#00cc88',
        accent: '#ffcc00',
        border: '#050505',
        focus: '#050505',
        success: '#00aa55',
        warning: '#ff9900',
        error: '#ff0033',
      },
      shape: {
        borderRadius: '0px',
        borderWidth: '2px',
        borderStyle: 'solid',
        shadowLevel: 'large',
      },
    },
  },
  {
    name: 'Terra & Botânica (Orgânico)',
    description: 'Tons acolhedores, aconchegantes e formas suaves para portfólios autorais.',
    theme: {
      colors: {
        background: '#131915',
        surface: '#1b241e',
        textPrimary: '#edf3ed',
        textSecondary: '#9fb5a3',
        primary: '#10b981',
        secondary: '#eab308',
        accent: '#34d399',
        border: '#2b3a30',
        focus: '#6ee7b7',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#f87171',
      },
      shape: {
        borderRadius: '16px',
        borderWidth: '1px',
        borderStyle: 'solid',
        shadowLevel: 'medium',
      },
    },
  },
];

export const INITIAL_PORTFOLIO_SETTINGS: PortfolioSettings = {
  id: 'default-settings',
  portfolio_name: 'Ana Rocha — Portfólio Autoral',
  tagline: 'Designer de Interação & Desenvolvedora Criativa',
  about_title: 'Investigação, Estrutura e Prática Digital Autoral',
  about_text: 'Trabalho na interseção entre design visual, sistemas tipográficos acessíveis e desenvolvimento front-end. Meu processo busca construir narrativas digitais conscientes, onde a estética e a função operam sem concessões de acessibilidade.',
  short_bio: 'Criadora de sistemas de design, interfaces táteis e projetos multimídia com foco em WCAG e autoria visual.',
  profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  whatsapp: '5511987654321',
  email_public: 'contato@anarocha.design',
  location: 'São Paulo, Brasil',
  social_links: [
    { platform: 'github', label: 'GitHub', url: 'https://github.com' },
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'behance', label: 'Behance', url: 'https://behance.net' },
  ],
  ux_voice: 'direto',
  theme_config: DEFAULT_THEME,
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-interfaces',
    name: 'Design de Interfaces',
    slug: 'design-de-interfaces',
    description: 'Sistemas visuais, design systems e interfaces web acessíveis.',
    display_order: 1,
  },
  {
    id: 'cat-editorial',
    name: 'Editorial & Tipografia',
    slug: 'editorial-e-tipografia',
    description: 'Projetos editoriais, identidades de publicação e experimentações tipográficas.',
    display_order: 2,
  },
  {
    id: 'cat-multimidia',
    name: 'Audiovisual & Mídia',
    slug: 'audiovisual-e-midia',
    description: 'Projetos de som, vídeo, microinterações e narrativas multimídia.',
    display_order: 3,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    category_id: 'cat-interfaces',
    category_name: 'Design de Interfaces',
    title: 'Sistema de Acessibilidade Sonora',
    slug: 'sistema-acessibilidade-sonora',
    short_description: 'Interface web adaptativa com feedback multissensorial e transcrições sonoras dinâmicas.',
    cover_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    year: 2026,
    status: 'publicado',
    featured: true,
    display_order: 1,
  },
  {
    id: 'proj-2',
    category_id: 'cat-editorial',
    category_name: 'Editorial & Tipografia',
    title: 'Atlas da Tipografia Fluida',
    slug: 'atlas-tipografia-fluida',
    short_description: 'Estudo experimental sobre escalas tipográficas com clamp() e composições modulares.',
    cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    year: 2025,
    status: 'publicado',
    featured: true,
    display_order: 2,
  },
  {
    id: 'proj-3',
    category_id: 'cat-multimidia',
    category_name: 'Audiovisual & Mídia',
    title: 'Paisagem Sonora & Síntese Digital',
    slug: 'paisagem-sonora-sintese-digital',
    short_description: 'Composições sonoras imersivas acompanhadas de partituras visuais interativas.',
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    year: 2025,
    status: 'publicado',
    featured: false,
    display_order: 3,
  },
];

export const INITIAL_BLOCKS: Record<string, ProjectBlock[]> = {
  'proj-1': [
    {
      id: 'blk-1-1',
      project_id: 'proj-1',
      type: 'texto',
      content: '## Contexto e Desafio de Acessibilidade\n\nEste projeto investiga como interfaces digitais podem utilizar estímulos sonoros complementares para enriquecer a navegação sem excluir pessoas com deficiência auditiva ou visual. Toda a navegação foi desenhada em conformidade estrita com o WCAG 2.2 nível AA.',
      display_order: 1,
    },
    {
      id: 'blk-1-2',
      project_id: 'proj-1',
      type: 'imagem',
      media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      alt_text: 'Diagrama de fluxo de navegação multissensorial com marcações de foco e feedback háptico.',
      caption: 'Fluxo interativo mapeando estados de foco e retorno auditivo simultâneo.',
      display_order: 2,
    },
    {
      id: 'blk-1-3',
      project_id: 'proj-1',
      type: 'video_youtube',
      media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      caption: 'Demonstração em vídeo do protótipo com navegação exclusivamente por teclado.',
      display_order: 3,
    },
    {
      id: 'blk-1-4',
      project_id: 'proj-1',
      type: 'audio',
      media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      caption: 'Faixa de teste: Paisagem sonora sintetizada com modulação estéreo.',
      transcript: 'Transcrição do áudio: Uma sequência melódica sintetizada com osciladores de onda senoidal suave, variando em frequências médias de 440Hz a 880Hz, simulando a resposta tátil da interface em ação.',
      display_order: 4,
    },
  ],
  'proj-2': [
    {
      id: 'blk-2-1',
      project_id: 'proj-2',
      type: 'texto',
      content: '## Arquitetura Tipográfica e Proporção\n\nA investigação parte da premissa de que a tipografia na web não deve depender de breakpoints arbitrários, mas sim fluir matematicamente conforme a largura útil da viewport, garantindo legibilidade e ritmo vertical contínuo.',
      display_order: 1,
    },
    {
      id: 'blk-2-2',
      project_id: 'proj-2',
      type: 'imagem',
      media_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
      alt_text: 'Composição tipográfica em alto contraste demonstrando escala harmônica de 1.25.',
      caption: 'Pranchas do projeto demonstrando a hierarquia ótica de títulos e subtítulos.',
      display_order: 2,
    },
  ],
  'proj-3': [
    {
      id: 'blk-3-1',
      project_id: 'proj-3',
      type: 'texto',
      content: '## Síntese de Frequências e Visualização\n\nNesta pesquisa artística, cada frequência sonora gera uma malha gráfica vetorial correspondente. Usuários podem tanto ouvir a gravação quanto analisar a partitura descrita em texto acessível.',
      display_order: 1,
    },
    {
      id: 'blk-3-2',
      project_id: 'proj-3',
      type: 'audio',
      media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      caption: 'Gravação ambiental: Movimento das frequências em ambiente controlado.',
      transcript: 'Transcrição: Sons de ambiente com ressonâncias acústicas orgânicas seguidas por pulsos rítmicos harmônicos.',
      display_order: 2,
    },
  ],
};

/**
 * Converte um texto para slug amigável (ex: "Meu Projeto Incrível!" -> "meu-projeto-incrivel")
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extrai o ID de um vídeo do YouTube a partir de qualquer formato comum de link
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Gera URL de embed segura do YouTube
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

/**
 * Formata número de WhatsApp e cria o link para envio direto
 */
export function generateWhatsAppLink(
  rawPhone: string,
  template: string,
  params: { nome: string; assunto: string; mensagem: string }
): string {
  const cleanPhone = rawPhone.replace(/\D/g, '');
  let text = template
    .replace('{nome}', params.nome.trim())
    .replace('{assunto}', params.assunto.trim())
    .replace('{mensagem}', params.mensagem.trim());

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
