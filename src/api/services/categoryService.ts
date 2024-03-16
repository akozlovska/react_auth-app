import { Category } from "../../types/Category";
import { httpClient } from "../httpClient"

export const getAllByUser = () => {
  return httpClient.get<never, Category[]>(`/categories`);
}

export const addOne = (name: string) => {
  return httpClient.post<never, Category>(`/categories`, { name });
}

export const updateOne = ( id: number, name: string ) => {
  return httpClient.patch<never, Category>(`/categories/${id}`, { name });
}

export const deleteOne = (id: number) => {
  return httpClient.delete(`/categories/${id}`);
}
