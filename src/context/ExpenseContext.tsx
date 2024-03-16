import React, { useContext, useState } from "react";
import * as categoryService from '../api/services/categoryService';
import * as expenseService from '../api/services/expenseService';
import { ExpensePatchData, ExpensePostData } from "../api/services/expenseService";
import { Category } from "../types/Category";
import { Expense } from "../types/Expense";

type FilterParameters = {
  query?: string,
  sort?: string,
  filters?: string[],
}

type ExpenseContextType = {
  expenses: Expense[];
  getAllExpenses: () => Promise<void>;
  addExpense: (data: ExpensePostData) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  changeExpense: (id: string, data: ExpensePatchData) => Promise<void>;
  filterAndSort: (parameters: FilterParameters) => Expense[];
  categories: Category[];
  getAllCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  changeCategory: (id: number, newName: string) => Promise<void>;
  deleteCategory: (categoryId: number) => Promise<void>;
}

const ExpenseContext = React.createContext<ExpenseContextType>({} as ExpenseContextType);

type Props = {
  children: React.ReactNode;
};

export const ExpenseProvider: React.FC<Props> = ( { children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const getAllExpenses = async() => {
    const expenses = await expenseService.getAll();
    setExpenses(expenses);
  }

  const addExpense = async(data: ExpensePostData) => {
    const newExpense = await expenseService.addOne(data);
    setExpenses(curr => [ ...curr, newExpense ]);

    if (!categories.find(category => category.name === newExpense.category)) {
      await getAllCategories();
    }
  }

  const deleteExpense = async(expenseId: string) => {
    await expenseService.removeOne(expenseId);
    setExpenses(curr => curr.filter(expense => expense.id !== expenseId));
  }

  const changeExpense = async(id: string, data: ExpensePatchData) => {
    const updatedExpense = await expenseService.updateOne(id, data);

    setExpenses(currExpenses => {
      const updatedExpenses = [ ...currExpenses ];
      const index = updatedExpenses
        .findIndex(expense => expense.id === updatedExpense.id);

      updatedExpenses.splice(index, 1, updatedExpense);

      return updatedExpenses;
    });

    if (!categories.find(category => category.name === updatedExpense.category)) {
      await getAllCategories();
    }
  }

  const filterAndSort = ({ query, sort, filters }: FilterParameters) => {
    let filtered = [...expenses];

    if (query) {
      filtered = filtered
        .filter(expense => expense.title.toLowerCase().includes(query.toLowerCase())
          || (!!expense.note && expense.note.toLowerCase().includes(query.toLowerCase()))
          || expense.category.toLowerCase().includes(query.toLowerCase()));
    }

    if (filters && filters.length) {
      filtered = filtered.filter(expense => filters.includes(expense.category));
    }

    if (sort) {
      switch (sort) {
        case 'title':
          filtered.sort((expense1, expense2) => expense1.title
            .localeCompare(expense2.title));
          break;
        case 'amountDesc':
          filtered.sort((expense1, expense2) => expense2.amount
            - expense1.amount);
          break;
        case 'amountAsc':
          filtered.sort((expense1, expense2) => expense1.amount
            - expense2.amount);
          break;
        case 'spentAtAsc':
          filtered.sort((expense1, expense2) => {
            return new Date(expense1.spentAt).getTime()
              - new Date(expense2.spentAt).getTime();
          })
          break;
        case 'spentAtDesc':
        default:
          filtered.sort((expense1, expense2) => {
            return new Date(expense2.spentAt).getTime()
              - new Date(expense1.spentAt).getTime();
          })
          break;
      }
    }

    return filtered;
  }

  const getAllCategories = async() => {
    const categories = await categoryService.getAllByUser();
    setCategories(categories);
  }

  const addCategory = async(name: string) => {
    const newCategory = await categoryService.addOne(name);
    setCategories(curr => [ ...curr, newCategory ]);
  }

  const changeCategory = async(id: number, newName: string) => {
    const updatedCategory = await categoryService.updateOne(id, newName);

    setCategories(currCategories => {
      const updatedCategories = [...currCategories ];
      const index = updatedCategories
        .findIndex(category => category.id === updatedCategory.id);

      updatedCategories.splice(index, 1, updatedCategory);

      return updatedCategories;
    });
  }

  const deleteCategory = async(categoryId: number) => {
    await categoryService.deleteOne(categoryId);
    setCategories(curr => curr.filter(category => category.id !== categoryId));
  }

  const value = {
    expenses,
    getAllExpenses,
    addExpense,
    deleteExpense,
    changeExpense,
    filterAndSort,
    categories,
    getAllCategories,
    addCategory,
    changeCategory,
    deleteCategory,
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
