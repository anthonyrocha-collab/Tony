import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('seu-projeto') &&
    supabaseUrl.startsWith('http')
  );
}

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.error('Erro ao inicializar cliente Supabase:', error);
  }
}

/**
 * Validação e Upload para Supabase Storage
 */
export async function uploadMediaToStorage(
  file: File,
  folder: 'profile' | 'covers' | 'blocks' | 'audio' = 'covers'
): Promise<{ url: string | null; error: string | null }> {
  // 1. Validação de tamanho
  const isAudio = file.type.startsWith('audio/');
  const maxBytes = isAudio ? 25 * 1024 * 1024 : 10 * 1024 * 1024; // 25MB para áudio, 10MB para imagem
  if (file.size > maxBytes) {
    return {
      url: null,
      error: `Arquivo excede o tamanho máximo permitido (${isAudio ? '25MB' : '10MB'}).`,
    };
  }

  // 2. Validação de formato
  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'];
  if (!isAudio && !validImageTypes.includes(file.type)) {
    return {
      url: null,
      error: 'Formato de imagem inválido. Use JPG, PNG, WebP, GIF ou SVG.',
    };
  }
  if (isAudio && !validAudioTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
    return {
      url: null,
      error: 'Formato de áudio inválido. Use MP3, WAV, OGG ou M4A.',
    };
  }

  // Se o Supabase estiver conectado, faz upload real no bucket
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${folder}/${Date.now()}_${sanitizedName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('portfolio_media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        // Se o bucket não existir ou erro de permissão
        console.warn('Erro ao subir para o Supabase Storage:', error.message);
        // Fallback para Base64 Data URL para permitir teste imediato se o bucket ainda não tiver sido criado
        const localDataUrl = await fileToDataUrl(file);
        return { url: localDataUrl, error: null };
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio_media')
        .getPublicUrl(data.path);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      console.warn('Exceção ao fazer upload para o Supabase Storage, usando conversão local:', err);
      const localDataUrl = await fileToDataUrl(file);
      return { url: localDataUrl, error: null };
    }
  }

  // Fallback se o Supabase não estiver configurado no .env
  const localDataUrl = await fileToDataUrl(file);
  return { url: localDataUrl, error: null };
}

/**
 * Converte File para DataURL (Base64)
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
