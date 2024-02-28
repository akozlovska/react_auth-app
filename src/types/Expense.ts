export interface Expense {
  id: string,
  title: string,
  amount: number,
  spentAt: string,
  note?: string,
  category: string,
}
