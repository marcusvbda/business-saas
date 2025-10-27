import { create } from 'zustand';

interface IGlobalStore {
	globalLoading: boolean;
	setGlobalLoading: (value: boolean) => void;
}

export const useGlobalStore = create<IGlobalStore>((set) => ({
	globalLoading: false,
	setGlobalLoading: (value: boolean) => set({ globalLoading: value }),
}));
