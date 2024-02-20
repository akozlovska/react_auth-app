import { AuthData, ResetPasswordData, SignInData, SignUpData, User } from "../../context/AuthContext";
import { authClient } from "../authClient"

export const signUp = ({ username, email, password }: SignUpData) => {
    return authClient.post('/register', { username, email, password });
}

export const signIn = ({ email, password }: SignInData) => {
    return authClient.post<never, AuthData>('/login', { email, password });
}

export const activate = (token: string, id: string) => {
    return authClient.get<never, AuthData>(`/activation?token=${token}&id=${id}`);
}

export const requestEmailConfirmation = (email: string) => {
    return authClient.post('/confirmation', { email });
}

export const confirmReset = (token: string, id: string) => {
    return authClient.get<never, User>(`/confirmation?token=${token}&id=${id}`);
}

export const resetPassword = ({email, newPassword}: ResetPasswordData) => {
    return authClient.post('/reset-password', { email, newPassword });
}

export const refresh = () => {
    return authClient.get<never, AuthData>('/refresh');
}

export const logout = () => {
    return authClient.get('/logout');
}