// components/store/timeStore.ts
import { create } from 'zustand';

interface TimeState {
  savedTime: { hours: number; minutes: number; period: string } | null;
  setSavedTime: (time: {
    hours: number;
    minutes: number;
    period: string;
  }) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  savedTime: null,
  setSavedTime: (time) => set({ savedTime: time }),
}));
