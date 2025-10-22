import { create } from "zustand";

type ModelProgressStore = {
  isProcessing: boolean;
  setProcessing: (isProcessing: boolean) => void;
};

export const useModelProgressStore = create<ModelProgressStore>((set) => ({
  isProcessing: false,

  setProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },
}));
