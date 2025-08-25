'use client';

import { useAudio } from './useAudio.hook';

export const useMessageAudio = () => {
  const { playSound } = useAudio({
    src: '/message.mp3',
    volume: 1.0,
    onPlay: () => {},
    onError: (error) => {
      console.error('Error playing sound:', error);
    },
  });

  return {
    playSound,
  };
};
