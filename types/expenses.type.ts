export type Expense = {
  id: string,
  type: 'fixed' | 'transaction',
  amount: number,
  description?: string,
  paid?: number[],
  date?: string,
}