// store/useIslandStore.ts
import { create } from 'zustand'

export type IslandState = "idle" | "silent" | "music" | "phone" | "lowBattery" | "timer" | "airdrop" | "screenRecord" | "findMy" | "faceId" | "applePay"

interface IslandStore {
  islandState: IslandState
  setIslandState: (state: IslandState) => void
}

export const useIslandStore = create<IslandStore>((set) => ({
  islandState: "idle", // Default state
  setIslandState: (state) => set({ islandState: state }),
}))