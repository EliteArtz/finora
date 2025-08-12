/**
 * Base for any expense to retain data consistency
 */
export type BaseExpense = {
  id: string;
  amount: number;
  date: string;
}

/**
 * Fixed or variable Expense with description
 */
export type Expense = BaseExpense & {
  type: 'fixed' | 'variable',
  description?: string,
  paid?: BaseExpense[],
}

export type CurrentExpenses = {
  expenses?: Expense[];
  savings?: BaseExpense;
  remainingBalance?: number;
  currentBalance?: BaseExpense;
}

export type ExpenseEvent = {
  eventId: string;
  action: 'added' | 'updated' | 'deleted';
  date: string;
  expense?: Expense;
  previousExpense?: BaseExpense | Expense;
  balance: CurrentExpenses['currentBalance']
  remainingBalance: CurrentExpenses['remainingBalance'],
  savings: CurrentExpenses['savings'],
}