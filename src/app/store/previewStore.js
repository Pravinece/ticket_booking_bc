import { create } from 'zustand';

export const usePreviewStore = create((set) => ({
  isPreview: { enable: false, msg: [], value: "", resolve: null },
  setIsPreview: (x) => set(() => ({ isPreview: x })),
}));