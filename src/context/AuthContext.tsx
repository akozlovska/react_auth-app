import React, { useContext, useMemo, useState } from 'react';
import * as authService from '../api/services/authService'
import * as userService from '../api/services/userService'

export interface SignUpData {
    username: string,
    email: string,
    password: string,
}

export type SignInData = Omit<SignUpData, 'username'>;

export interface User {
    id: string,
    username: string,
    email: string,
}

export interface AuthData {
    user: User,
    accessToken: string,
}

export interface ResetPasswordData {
    email: string,
    newPassword: string,
}

type AuthContextType = {
    user: User | null,
    setUser: (user: User | null) => void;
    isAuthorized: boolean;
    activate: (token: string, id: string) => Promise<void>;
    signIn: ({ email, password }: SignInData) => Promise<void>;
    confirmReset: (token: string, id: string) => Promise<void>;
    resetPassword: (newPassword: string) => Promise<void>;
    changeUsername: (newUsername: string) => Promise<void>;
    requestEmailChange: (password: string, newEmail: string) => Promise<void>;
    changeEmail: (token: string, id: string, newEmail: string) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

type Props = {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const isAuthorized = useMemo(() => !!user, [user]);

    const activate = async(token: string, id: string) => {
        const { user, accessToken } = await authService.activate(token, id);
        setUser(user);
        sessionStorage.setItem('accessToken', accessToken);
    }

    const signIn = async({ email, password }: SignInData) => {
        const { user, accessToken } = await authService.signIn({ email, password });
        setUser(user);
        sessionStorage.setItem('accessToken', accessToken);
    }

    const confirmReset = async(token: string, id: string) => {
        const user = await authService.confirmReset(token, id);
        setUser(user);
    }

    const resetPassword = async(newPassword: string) => {
        if (!user) {
            throw new Error('Email not confirmed');
        }

        await authService.resetPassword({ email: user.email, newPassword });
    }

    const changeUsername = async(newUsername: string) => {
        if (!user) {
            throw new Error('Unauthorized');
        }

        const updatedUser = await userService.changeUsername({ userId: user?.id, newUsername })
        setUser(updatedUser);
    }

    const requestEmailChange = async(password: string, newEmail: string) => {
        if (!user) {
            throw new Error('Unauthorized');
        }

        await userService.requestEmailChange({ password, oldEmail: user.email, newEmail });
    }

    const changeEmail = async(token: string, id: string, newEmail: string) => {
        if (!user) {
            throw new Error('Unauthorized');
        }

        const updatedUser = await userService.changeEmail(token, id, newEmail);
        setUser(updatedUser);
    }

    const changePassword = async(oldPassword: string, newPassword: string) => {
        if (!user) {
            throw new Error('Unauthorized');
        }
        
        await userService.changePassword({ userId: user.id, oldPassword, newPassword });
    }

    const logout = async() => {
        await authService.logout();
        setUser(null);
    }

    const value = {
        user,
        setUser,
        isAuthorized,
        activate,
        signIn,
        confirmReset,
        resetPassword,
        changeUsername,
        requestEmailChange,
        changeEmail,
        changePassword,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);