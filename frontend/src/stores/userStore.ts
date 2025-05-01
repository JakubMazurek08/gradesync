import { create } from "zustand";

type UserStore = {
    userId: string | undefined;
    isTeacher: boolean;
    setIsTeacher: (isStudent: boolean) => void;
    setUserId: (id: string | undefined) => void;
    logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    userId: undefined,
    isTeacher: false,
    setUserId: (id) => set({ userId: id }),
    setIsTeacher: (isTeacher: boolean) => set({ isTeacher: isTeacher }),
    logout: () => set({ userId: undefined, isTeacher: false }),
}));