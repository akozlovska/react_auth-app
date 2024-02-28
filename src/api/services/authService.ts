import { User } from "../../types/User";
import { authClient } from "../authClient"

export interface SignUpData {
  username: string,
  email: string,
  password: string,
}

export type SignInData = Omit<SignUpData, 'username'>;

export interface AuthData {
  user: User,
  accessToken: string,
}

export interface ResetPasswordData {
  email: string,
  newPassword: string,
}

export const signUp = ({ username, email, password }: SignUpData) => {
  return authClient.post('/register', { username, email, password });
}

export const signIn = ({ email, password }: SignInData) => {
  return authClient.post<never, AuthData>('/login', { email, password });
}

export const activate = (token: string, id: string) => {
  return authClient.get<never, AuthData>(`/activate?token=${token}&id=${id}`);
}

export const requestPasswordReset = (email: string) => {
  return authClient.post('/confirm-reset', { email });
}

export const confirmReset = (token: string, id: string) => {
  return authClient.get<never, { email: string }>(`/confirm-reset?token=${token}&id=${id}`);
}

export const resetPassword = ({email, newPassword}: ResetPasswordData) => {
  return authClient.post('/reset-password', { email, newPassword });
}

export const confirmEmailChange = (token: string, id: string) => {
  return authClient.get<never, AuthData>(`/confirm-email-change?token=${token}&id=${id}`);
}

export const refresh = () => {
  return authClient.get<never, AuthData>('/refresh');
}

export const logout = () => {
  return authClient.get('/logout');
}
