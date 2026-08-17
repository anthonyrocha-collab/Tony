import { ContrastCheckResult } from '../types';

/**
 * Converte cor HEX (#ffffff ou #fff) para RGB { r, g, b }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}

/**
 * Calcula a luminância relativa conforme W3C WCAG 2.2
 */
export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const srgb = val / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calcula a taxa de contraste (Contrast Ratio) entre duas cores
 */
export function checkContrast(fgHex: string, bgHex: string): ContrastCheckResult {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);

  if (!fgRgb || !bgRgb) {
    return {
      ratio: 1,
      formattedRatio: '1.0:1',
      normalTextPass: false,
      largeTextPass: false,
      uiComponentPass: false,
      level: 'Falha',
      warningMessage: 'Código de cor inválido para cálculo de contraste.',
    };
  }

  const lum1 = getRelativeLuminance(fgRgb);
  const lum2 = getRelativeLuminance(bgRgb);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  const roundedRatio = Math.round(ratio * 100) / 100;

  const normalTextPass = ratio >= 4.5;
  const largeTextPass = ratio >= 3.0;
  const uiComponentPass = ratio >= 3.0;

  let level: 'AAA' | 'AA' | 'AA Large' | 'Falha' = 'Falha';
  if (ratio >= 7.0) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  } else if (ratio >= 3.0) {
    level = 'AA Large';
  }

  let warningMessage = '';
  if (!normalTextPass) {
    warningMessage = `Contraste (${roundedRatio}:1) abaixo do mínimo WCAG AA (4.5:1) para texto normal.`;
  }

  return {
    ratio: roundedRatio,
    formattedRatio: `${roundedRatio.toFixed(1)}:1`,
    normalTextPass,
    largeTextPass,
    uiComponentPass,
    level,
    warningMessage: warningMessage || undefined,
  };
}
