import { create } from "zustand";

interface GameStateStore {
  speed: number;
  score: number;
  
  // Actions
  setSpeed: (speed: number) => void;
  setScore: (score: number) => void;
}

export const useGameState = create<GameStateStore>((set) => ({
  speed: 0,
  score: 0,
  
  setSpeed: (speed: number) => set({ speed }),
  setScore: (score: number) => set({ score })
}));