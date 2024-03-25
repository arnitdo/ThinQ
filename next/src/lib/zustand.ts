import { AuthUser } from '@/util/middleware/auth';
import { User } from '@prisma/client';
import {create} from 'zustand';

type UserState = {
    user: AuthUser | null;
    authenticate: (user: AuthUser) => void;
    signout: () => void;
};

const useAuthStore = create<UserState>((set) => ({
    user: null,
    authenticate: (user) => set(() => ({ user: user })),
    signout: () => set(() => ({ user: null })),
}));

export default useAuthStore;