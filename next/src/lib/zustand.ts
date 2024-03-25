import { AuthUser } from '@/util/middleware/auth';
import { User } from '@prisma/client';
import {create} from 'zustand';

type UserState = {
    user: AuthUser | null;
    authenticate: (user: AuthUser) => void;
    signout: () => void;
    auth: boolean;
    setAuth: (auth: boolean) => void;
};

const useAuthStore = create<UserState>((set) => ({
    user: null,
    authenticate: (user) => set(() => ({ user: user })),
    signout: () => set(() => ({ user: null, auth: false })),
    auth: false,
    setAuth: (auth) => set(() => ({ auth: auth })),
}));

export default useAuthStore;