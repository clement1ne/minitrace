import { create } from 'zustand';

type UserStore = {
    currentUser: any;
    setCurrentUser: (currentUser: any) => void;
    currentName: any,
    setName: (currentName: any) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    currentUser: null,
    setCurrentUser: (currentUser) => set({ currentUser }),
    currentName: null,
    setName: (currentName: any) => set({ currentName }),
}));
