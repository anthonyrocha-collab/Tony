export interface GoogleFontOption {
  family: string;
  category?: string;
}

const GOOGLE_FONTS_METADATA_URL = 'https://fonts.google.com/metadata/fonts';

const FALLBACK_FONTS: GoogleFontOption[] = [
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Plus Jakarta Sans', category: 'sans-serif' },
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Syne', category: 'display' },
  { family: 'Courier Prime', category: 'monospace' },
];

export async function getGoogleFonts(): Promise<GoogleFontOption[]> {
  try {
    const response = await fetch(GOOGLE_FONTS_METADATA_URL);
    if (!response.ok) throw new Error(`Google Fonts metadata: ${response.status}`);

    const metadata = await response.json();
    const fonts = Array.isArray(metadata.familyMetadataList)
      ? metadata.familyMetadataList
          .filter((font: { family?: unknown }): font is { family: string; category?: string } => typeof font.family === 'string')
          .map((font: { family: string; category?: string }) => ({ family: font.family, category: font.category }))
          .sort((first: GoogleFontOption, second: GoogleFontOption) => first.family.localeCompare(second.family))
      : [];

    return fonts.length > 0 ? fonts : FALLBACK_FONTS;
  } catch (error) {
    console.warn('Não foi possível carregar o catálogo do Google Fonts.', error);
    return FALLBACK_FONTS;
  }
}
