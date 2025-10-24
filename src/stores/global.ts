import { create } from 'zustand';

interface IGlobalStore {
	loading: boolean;
	setLoading: (value: boolean) => void;
}

export const useGlobalStore = create<IGlobalStore>((set) => ({
	loading: false,
	setLoading: (value: boolean) => set({ loading: value }),
}));
