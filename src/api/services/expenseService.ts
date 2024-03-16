import { Expense } from "../../types/Expense";
import { httpClient } from "../httpClient"

export interface ExpensePostData {
  title: string,
  amount: number,
  spentAt: string,
  note?: string,
  category: string,
};

export interface ExpensePatchData {
  title?: string,
  amount?: number,
  spentAt?: string,
  note?: string,
  category?: string,
};

export const getAll = () => {
  return httpClient.get<never, Expense[]>(`/expenses`);
}

export const addOne = ( newExpense: ExpensePostData ) => {
  return httpClient.post<never, Expense>('/expenses', newExpense);
}

export const removeOne = ( id: string ) => {
  return httpClient.delete(`/expenses/${id}`);
}

export const updateOne = ( id: string, dataToUpdate: ExpensePatchData ) => {
  return httpClient.patch<never, Expense>(`/expenses/${id}`, dataToUpdate);
}
