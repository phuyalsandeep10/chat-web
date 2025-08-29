import { useCallback, useEffect, useRef } from 'react';

interface UseAudioOptions {
  src: string;
  volume?: number;
  onPlay?: () => void;
  onError?: (error: Error) => void;
}

export function useAudio({
  src,
  volume = 1.0,
  onPlay,
  onError,
}: UseAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    audioRef.current = new Audio('/message.mp3');

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.remove();
      }
    };
  }, []);

  const playSound = useCallback(() => {
    if (typeof window === 'undefined') return;
    audioRef.current?.play().catch((err) => {
      console.warn('Autoplay blocked:', err);
    });
  }, []);

  return {
    playSound,
  };
}
