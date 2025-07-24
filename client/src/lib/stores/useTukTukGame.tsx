import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

interface TukTukGameState {
  tukTukPosition: THREE.Vector3;
  
  // Actions
  setTukTukPosition: (position: THREE.Vector3) => void;
}

export const useTukTukGame = create<TukTukGameState>()(
  subscribeWithSelector((set, get) => ({
    tukTukPosition: new THREE.Vector3(0, 1, 0),
    
    setTukTukPosition: (position: THREE.Vector3) => {
      set({ tukTukPosition: position });
    }
  }))
);