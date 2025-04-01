import { create } from "zustand";

type UserStore = {
    userId: string | undefined;
    setUserId: (id: string | undefined) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    userId: undefined,
    setUserId: (id) => set({ userId: id }),
    logout: () => set({ userId: undefined }),
}));