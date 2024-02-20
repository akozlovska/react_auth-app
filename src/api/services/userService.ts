import { User } from "../../context/AuthContext";
import { httpClient } from "../httpClient";

type ChangeNameData = {
    userId: string,
    newUsername: string,
}

type ChangePassData = {
    userId: string,
    oldPassword: string,
    newPassword: string,
}

type ChangeEmailData = {
    password: string,
    oldEmail: string,
    newEmail: string,
}

export const changeUsername = ({ userId, newUsername }: ChangeNameData) => {
    return httpClient.post<never, User>('/user/change-username', { userId, newUsername });
}

export const changePassword = ({ userId, oldPassword, newPassword }: ChangePassData) => {
    return httpClient.post('/user/change-password', { userId, oldPassword, newPassword })
}

export const requestEmailChange = ({ password, oldEmail, newEmail }: ChangeEmailData) => {
    return httpClient.post('/user/change-email', { password, oldEmail, newEmail });
}

export const changeEmail = (token: string, id: string, newEmail: string) => {
    return httpClient.get<never, User>(`/user/change-email?token=${token}&id=${id}&email=${newEmail}`);
}