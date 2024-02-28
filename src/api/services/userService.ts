import { User } from "../../types/User";
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
  return httpClient.patch<never, User>('/user/change-username', { userId, newUsername });
}

export const changePassword = ({ userId, oldPassword, newPassword }: ChangePassData) => {
  return httpClient.patch('/user/change-password', { userId, oldPassword, newPassword })
}

export const requestEmailChange = ({ password, oldEmail, newEmail }: ChangeEmailData) => {
  return httpClient.post('/user/request-email-change', { password, oldEmail, newEmail });
}

export const changeEmail = (id: string, newEmail: string) => {
  return httpClient.patch<never, User>('/user/change-email', { userId: id, newEmail });
}
