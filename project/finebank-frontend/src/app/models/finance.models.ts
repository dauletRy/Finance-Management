export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Card {
  id: number;
  name: string;
  balance: number;
}

export interface Transaction {
  id: number;
  card: number;
  category: Category | null;
  amount: number;
  description: string;
  transaction_type: 'income' | 'expense';
  date: string;
}

export interface DashboardSummary {
  total_balance: number;
  total_income: number;
  total_expense: number;
  recent_transactions: Transaction[];
}

export interface WeeklyStats {
  total_income: number;
  total_expense: number;
  transaction_count: number;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: { id: number; username: string };
}

export interface NewCard {
  name: string;
  balance: number;
}

export interface NewTransaction {
  card: number | null;
  category: number | null;
  amount: number | null;
  description: string;
  transaction_type: 'income' | 'expense';
}