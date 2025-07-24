import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type VehicleType = "car" | "plane";

interface VehicleGameState {
  currentVehicle: VehicleType;
  carPosition: THREE.Vector3;
  planePosition: THREE.Vector3;
  
  // Actions
  switchVehicle: () => void;
  setCarPosition: (position: THREE.Vector3) => void;
  setPlanePosition: (position: THREE.Vector3) => void;
}

export const useVehicleGame = create<VehicleGameState>()(
  subscribeWithSelector((set, get) => ({
    currentVehicle: "car",
    carPosition: new THREE.Vector3(0, 1, 0),
    planePosition: new THREE.Vector3(0, 20, 0),
    
    switchVehicle: () => {
      set((state) => ({
        currentVehicle: state.currentVehicle === "car" ? "plane" : "car"
      }));
    },
    
    setCarPosition: (position: THREE.Vector3) => {
      set({ carPosition: position });
    },
    
    setPlanePosition: (position: THREE.Vector3) => {
      set({ planePosition: position });
    }
  }))
);
