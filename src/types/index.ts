export type BlockType = 'texto' | 'imagem' | 'video_youtube' | 'audio';

export type ProjectStatus = 'rascunho' | 'publicado';

export interface SocialLink {
  id?: string;
  platform: 'github' | 'linkedin' | 'behance' | 'instagram' | 'twitter' | 'dribbble' | 'youtube' | 'email' | 'other';
  label: string;
  url: string;
}

export interface ThemeColors {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  focus: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  titleFont: string;
  bodyFont: string;
  baseFontSize: number;
  scaleRatio: number;
}

export interface ThemeShape {
  borderRadius: string;
  borderWidth: string;
  borderStyle: string;
  shadowLevel: 'none' | 'small' | 'medium' | 'large';
}

export interface ThemeLayout {
  maxContainerWidth: string;
  gridColumns: number;
  sectionGap: string;
  cardGap: string;
}

export interface ThemeMotion {
  duration: string;
  easing: string;
  intensity: 'subtle' | 'moderate' | 'expressive' | 'none';
  reducedMotionSupport: boolean;
}

export interface ThemeUxWriting {
  projectCtaLabel: string;
  aboutNavLabel: string;
  projectsNavLabel: string;
  contactNavLabel: string;
  filterAllLabel: string;
  emptyProjectsMessage: string;
  emptyCategoryMessage: string;
  whatsappTemplate: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  shape: ThemeShape;
  layout: ThemeLayout;
  motion: ThemeMotion;
  uxWriting: ThemeUxWriting;
}

export interface PortfolioSettings {
  id: string;
  owner_id?: string;
  portfolio_name: string;
  tagline: string;
  about_title: string;
  about_text: string;
  short_bio: string;
  profile_image: string;
  whatsapp: string;
  email_public: string;
  location: string;
  social_links: SocialLink[];
  ux_voice: string;
  theme_config: ThemeConfig;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  owner_id?: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  created_at?: string;
  project_count?: number;
}

export interface Project {
  id: string;
  owner_id?: string;
  category_id?: string | null;
  category_name?: string;
  title: string;
  slug: string;
  short_description: string;
  cover_image: string;
  year: number;
  status: ProjectStatus;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectBlock {
  id: string;
  project_id: string;
  type: BlockType;
  content?: string;
  media_url?: string;
  alt_text?: string;
  caption?: string;
  transcript?: string;
  display_order: number;
  created_at?: string;
}

export interface ContrastCheckResult {
  ratio: number;
  formattedRatio: string;
  normalTextPass: boolean; // >= 4.5:1
  largeTextPass: boolean;  // >= 3.0:1
  uiComponentPass: boolean; // >= 3.0:1
  level: 'AAA' | 'AA' | 'AA Large' | 'Falha';
  warningMessage?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
