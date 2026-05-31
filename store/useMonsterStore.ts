import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/idbStorage";

export type CanStatus = "FULL" | "HALF" | "EMPTY";

interface MonsterState {
  cans: CanStatus[];
  setCanStatus: (index: number, status: CanStatus) => void;
  resetAll: () => void;
  _hydrated: boolean;
  _setHydrated: (value: boolean) => void;
}

const MONTHLY_MONSTER_AMOUNT = 18;
const DEFAULT_CANS: CanStatus[] = Array(MONTHLY_MONSTER_AMOUNT).fill("FULL");

export const useMonsterStore = create<MonsterState>()(
  persist(
    (set) => ({
      cans: DEFAULT_CANS,
      _hydrated: false,
      _setHydrated: (value) => set({ _hydrated: value }),
      setCanStatus: (index, status) =>
        set((state) => {
          const updated = [...state.cans];
          updated[index] = status;
          return { cans: updated };
        }),
      resetAll: () => set({ cans: DEFAULT_CANS }),
    }),
    {
      name: "monster-storage",
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true);
      },
    },
  ),
);
