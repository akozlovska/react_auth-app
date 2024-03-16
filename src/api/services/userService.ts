import { User } from "../../types/User";
import { httpClient } from "../httpClient";

type ChangePassData = {
  oldPassword: string,
  newPassword: string,
}

type ChangeEmailData = {
  password?: string,
  oldEmail: string,
  newEmail: string,
}

export const changeUsername = (newUsername: string) => {
  return httpClient.patch<never, User>('/user/change-username', { newUsername });
}

export const changePassword = ({ oldPassword, newPassword }: ChangePassData) => {
  return httpClient.patch('/user/change-password', { oldPassword, newPassword })
}

export const requestEmailChange = ({ password, oldEmail, newEmail }: ChangeEmailData) => {
  return httpClient.post('/user/request-email-change', { password, oldEmail, newEmail });
}

export const changeEmail = (newEmail: string) => {
  return httpClient.patch<never, User>('/user/change-email', { newEmail });
}

export const getUserInfo = () => {
  return httpClient.get<never, User>('/user/get-user');
}

export const deleteUser = () => {
  return httpClient.delete(`/user`);
}

export const deleteSocialAccount = (type: string) => {
  return httpClient.delete(`/user/account/${type}`);
}
