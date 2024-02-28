import React, { useContext, useMemo, useState } from 'react';
import * as authService from '../api/services/authService'
import { SignInData } from '../api/services/authService';
import * as userService from '../api/services/userService'
import { User } from '../types/User';

type AuthContextType = {
  user: User | null,
  isAuthorized: boolean;
  activate: (token: string, id: string) => Promise<void>;
  signIn: ({ email, password }: SignInData) => Promise<void>;
  confirmReset: (token: string, id: string) => Promise<string>;
  resetPassword: (newPassword: string, email: string) => Promise<void>;
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
    const { email } = await authService.confirmReset(token, id);
    
    return email;
  }

  const resetPassword = async(newPassword: string, email: string) => {
    await authService.resetPassword({ email, newPassword });
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
    const { user, accessToken } = await authService.confirmEmailChange(token, id);
    setUser(user);
    sessionStorage.setItem('accessToken', accessToken);

    const updatedUser = await userService.changeEmail(user.id, newEmail);
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
