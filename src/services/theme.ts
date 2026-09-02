import { ThemeConfig } from '../types';
import { DEFAULT_THEME } from '../utils/defaults';

/**
 * Aplica os tokens do Design System no elemento raiz (document.documentElement)
 * através de CSS Custom Properties nativas.
 */
function ensureGoogleFont(fontFamily: string): void {
  const known = ['Plus Jakarta Sans', 'Inter', 'Playfair Display', 'Syne', 'Courier Prime'];
  const family = fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  if (!known.includes(family)) return;
  const id = `theme-font-${family.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export function applyThemeToDOM(theme: ThemeConfig | null | undefined): void {
  const root = document.documentElement;
  const activeTheme = theme || DEFAULT_THEME;

  const { colors, typography, shape, layout, motion } = activeTheme;

  // 1. Cores
  root.style.setProperty('--color-bg', colors.background || DEFAULT_THEME.colors.background);
  root.style.setProperty('--color-surface', colors.surface || DEFAULT_THEME.colors.surface);
  root.style.setProperty('--color-text-primary', colors.textPrimary || DEFAULT_THEME.colors.textPrimary);
  root.style.setProperty('--color-text-secondary', colors.textSecondary || DEFAULT_THEME.colors.textSecondary);
  root.style.setProperty('--color-primary', colors.primary || DEFAULT_THEME.colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary || DEFAULT_THEME.colors.secondary);
  root.style.setProperty('--color-accent', colors.accent || DEFAULT_THEME.colors.accent);
  root.style.setProperty('--color-border', colors.border || DEFAULT_THEME.colors.border);
  root.style.setProperty('--color-focus', colors.focus || DEFAULT_THEME.colors.focus);
  root.style.setProperty('--color-success', colors.success || DEFAULT_THEME.colors.success);
  root.style.setProperty('--color-warning', colors.warning || DEFAULT_THEME.colors.warning);
  root.style.setProperty('--color-error', colors.error || DEFAULT_THEME.colors.error);

  // 2. Tipografia
  const titleFont = typography.titleFont || DEFAULT_THEME.typography.titleFont;
  const bodyFont = typography.bodyFont || DEFAULT_THEME.typography.bodyFont;
  root.style.setProperty('--font-title', titleFont);
  root.style.setProperty('--font-body', bodyFont);
  ensureGoogleFont(titleFont);
  ensureGoogleFont(bodyFont);
  root.style.setProperty('--font-base-size', `${typography.baseFontSize || 16}px`);
  root.style.setProperty('--type-scale', `${typography.scaleRatio || 1.25}`);
  root.style.setProperty('--title-weight', `${typography.titleWeight || 700}`);
  root.style.setProperty('--body-line-height', `${typography.bodyLineHeight || 1.6}`);
  root.style.setProperty('--heading-letter-spacing', typography.headingLetterSpacing || '-0.02em');

  // 3. Forma & Bordas
  const radius = shape.borderRadius || '12px';
  root.style.setProperty('--radius-main', radius);
  root.style.setProperty('--radius-sm', `calc(${radius} * 0.5)`);
  root.style.setProperty('--radius-lg', `calc(${radius} * 1.5)`);
  root.style.setProperty('--radius-full', '9999px');
  root.style.setProperty('--border-width', shape.borderWidth || '1px');
  root.style.setProperty('--border-style', shape.borderStyle || 'solid');

  // Sombras
  let shadowVal = 'none';
  if (shape.shadowLevel === 'small') {
    shadowVal = '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)';
  } else if (shape.shadowLevel === 'medium') {
    shadowVal = '0 4px 12px -2px rgba(0, 0, 0, 0.3), 0 2px 6px -2px rgba(0, 0, 0, 0.2)';
  } else if (shape.shadowLevel === 'large') {
    shadowVal = '0 12px 28px -4px rgba(0, 0, 0, 0.45), 0 4px 10px -3px rgba(0, 0, 0, 0.3)';
  }
  root.style.setProperty('--box-shadow', shadowVal);

  // 4. Layout
  root.style.setProperty('--container-max-w', layout.maxContainerWidth || '1200px');
  root.style.setProperty('--max-container-width', layout.maxContainerWidth || '1200px');
  root.style.setProperty('--section-gap', layout.sectionGap || '4rem');
  root.style.setProperty('--card-gap', layout.cardGap || '1.5rem');
  root.style.setProperty('--grid-columns', `${layout.gridColumns || 3}`);
  root.style.setProperty('--card-aspect-ratio', layout.cardAspectRatio || '16 / 10');

  // 5. Movimento & Microinterações
  root.style.setProperty('--motion-duration', motion.duration || '0.3s');
  root.style.setProperty('--motion-easing', motion.easing || 'cubic-bezier(0.16, 1, 0.3, 1)');
  const intensity = motion.intensity || 'moderate';
  const hoverDistance = intensity === 'expressive' ? '-8px' : intensity === 'subtle' ? '-2px' : intensity === 'none' ? '0px' : '-4px';
  const hoverScale = intensity === 'expressive' ? '1.035' : intensity === 'subtle' ? '1.01' : intensity === 'none' ? '1' : '1.02';
  root.style.setProperty('--card-hover-distance', motion.cardHover === 'lift' ? hoverDistance : '0px');
  root.style.setProperty('--card-hover-scale', motion.cardHover === 'scale' ? hoverScale : '1');
  root.style.setProperty('--image-hover-scale', motion.imageHover === 'zoom' ? hoverScale : '1');
  root.style.setProperty('--button-hover-distance', motion.buttonHover === 'lift' ? hoverDistance : '0px');
  root.style.setProperty('--button-press-scale', motion.buttonHover === 'press' ? '0.97' : '1');
  root.dataset.cardHover = motion.cardHover || 'lift';
  root.dataset.imageHover = motion.imageHover || 'zoom';
  root.dataset.buttonHover = motion.buttonHover || 'lift';
  root.dataset.entrance = motion.entrance || 'fade';
  root.dataset.reducedMotion = motion.reducedMotionSupport ? 'true' : 'false';
}
