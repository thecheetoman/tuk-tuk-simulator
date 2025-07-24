import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface FuelSystemState {
  fuel: number; // 0-100
  maxFuel: number;
  fuelConsumptionRate: number;
  boostConsumptionRate: number;
  
  // Actions
  consumeFuel: (amount: number) => void;
  refillFuel: (amount: number) => void;
  setFuel: (fuel: number) => void;
  canBoost: () => boolean;
}

export const useFuelSystem = create<FuelSystemState>()(
  subscribeWithSelector((set, get) => ({
    fuel: 100,
    maxFuel: 100,
    fuelConsumptionRate: 0.033, // fuel per second when moving (15x longer)
    boostConsumptionRate: 0.133, // additional fuel per second when boosting (15x longer)
    
    consumeFuel: (amount: number) => {
      set((state) => ({
        fuel: Math.max(0, state.fuel - amount)
      }));
    },
    
    refillFuel: (amount: number) => {
      set((state) => ({
        fuel: Math.min(state.maxFuel, state.fuel + amount)
      }));
    },
    
    setFuel: (fuel: number) => {
      set({ fuel: Math.max(0, Math.min(100, fuel)) });
    },
    
    canBoost: () => {
      return get().fuel > 10; // Need at least 10% fuel to boost
    }
  }))
);