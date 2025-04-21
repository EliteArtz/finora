export type Expense = {
  type: 'fixed' | 'transaction',
  amount: number,
  description?: string,
  paid?: number[],
}