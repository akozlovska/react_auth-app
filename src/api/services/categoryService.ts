import { Category } from "../../types/Category";
import { httpClient } from "../httpClient"

export const getAllByUser = (userId: string) => {
  return httpClient.get<never, Category[]>(`/categories/${userId}`);
}

export const addOne = (userId: string, name: string) => {
  return httpClient.post<never, Category>(`/categories/${userId}`, { name });
}

export const updateOne = ( id: number, name: string ) => {
  return httpClient.patch<never, Category>(`/categories/${id}`, { name });
}

export const deleteOne = (id: number) => {
  return httpClient.delete(`/categories/${id}`);
}
