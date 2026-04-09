import { create } from "zustand";

interface UiState {
  selectedListId: number | null;
  setSelectedListId: (id: number | null) => void;
}

const useUiStore = create<UiState>((set) => ({
  selectedListId: null,
  setSelectedListId: (id) => set({ selectedListId: id }),
}));

export default useUiStore;
