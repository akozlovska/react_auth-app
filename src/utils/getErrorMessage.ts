import { AxiosError } from "axios";

export const getErrorMessage = (error: any) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || 'Unknown error';
  }

  if (error instanceof Error) {
    return error.message;
  }
}
