import { create } from "zustand";

type ViewType = "discussion" | "members";

interface ViewStore {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

interface Student {
  name: string;
  avatar: string;
  url: string;
}

interface ViewState {
  activeView: "discussion" | "members";
  activeStudent: Student | null;
  setActiveView: (view: "discussion" | "members") => void;
  setActiveStudent: (student: Student | null) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: "discussion",
  activeStudent: null,
  setActiveView: (view) => set({ activeView: view }),
  setActiveStudent: (student) => set({ activeStudent: student }),
}));
