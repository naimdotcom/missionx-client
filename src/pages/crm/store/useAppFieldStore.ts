import { APPField } from "@/api";
import { create } from "zustand";

interface AppFieldState {
  appFields: APPField | null;
  setAppFields: (fields: APPField) => void | null;
}

export const useAppFieldStore = create<AppFieldState>()((set) => ({
  appFields: null,
  setAppFields: (fields) => set({ appFields: fields }),
}));
