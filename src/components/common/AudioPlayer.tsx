import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, FileText, ChevronDown, ChevronUp, Music } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  caption?: string;
  transcript?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, caption, transcript }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasError, setHasError] = useState(false);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Erro ao reproduzir áudio:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setHasError(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setHasError(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <figure className="w-full space-y-3" role="region" aria-label="Player de Áudio com Transcrição">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />

      <div className="p-4 sm:p-5 rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md space-y-4">
        {/* Header do Player com Ícone e Título */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
            <Music className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {caption || 'Faixa de Áudio do Projeto'}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        {hasError && (
          <p className="text-xs text-[var(--color-error)]" role="alert">
            Não foi possível carregar a fonte deste arquivo de áudio.
          </p>
        )}

        {/* Barra de Progresso com Slider Acessível */}
        <div className="space-y-1">
          <label htmlFor={`audio-scrub-${src}`} className="sr-only">
            Posição da reprodução do áudio
          </label>
          <input
            id={`audio-scrub-${src}`}
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
            className="w-full h-2 rounded-lg bg-[var(--color-border)] accent-[var(--color-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          />
        </div>

        {/* Controles: Play/Pause, Volume, Transcrição */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
              className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none shadow-md shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Controle de Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Desmutar áudio' : 'Mutar áudio'}
                className="p-2 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume do áudio"
                className="w-20 h-1.5 rounded bg-[var(--color-border)] accent-[var(--color-primary)] cursor-pointer"
              />
            </div>
          </div>

          {/* Botão de Transcrição Textual Acessível */}
          {transcript && (
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              aria-expanded={showTranscript}
              aria-controls={`audio-transcript-${src}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-semibold bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
              <span>{showTranscript ? 'Ocultar Transcrição' : 'Ver Transcrição'}</span>
              {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Caixa de Transcrição Textual */}
        {transcript && showTranscript && (
          <div
            id={`audio-transcript-${src}`}
            className="pt-4 mt-3 border-t border-[var(--color-border)] space-y-2 animate-in fade-in duration-200"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Transcrição Acessível do Conteúdo:
            </h4>
            <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--color-bg)] text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap border border-[var(--color-border)]">
              {transcript}
            </div>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="text-xs text-[var(--color-text-secondary)] italic text-center px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
