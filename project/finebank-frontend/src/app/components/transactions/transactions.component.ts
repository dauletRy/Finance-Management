import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Transaction, Category, NewTransaction, Card } from '../../models/finance.models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  categories: Category[] = [];
  cards: Card[] = [];
  searchTerm = '';
  errorMessage = '';
  successMessage = '';

  newTransaction: NewTransaction = {
    card: null,
    category: null,
    amount: null,
    description: '',
    transaction_type: 'expense'
  };

  constructor(private finance: FinanceService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.finance.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = data;
      },
      error: () => this.errorMessage = 'Failed to load transactions'
    });

    this.finance.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => {}
    });

    this.finance.getCards().subscribe({
      next: (data) => this.cards = data,
      error: () => {}
    });
  }

  getAvailableCategories(): Category[] {
    if (this.newTransaction.transaction_type === 'income') {
      return this.categories.filter(cat => ['Salary', 'Freelance', 'Other'].includes(cat.name));
    }
    return this.categories.filter(cat => !['Salary', 'Freelance'].includes(cat.name));
  }

  onTypeChange() {
    this.newTransaction.category = null;
  }

  filter() {
    this.filteredTransactions = this.transactions.filter(t =>
      t.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addTransaction() {
    this.errorMessage = '';
    this.successMessage = '';
    this.finance.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.successMessage = 'Transaction added successfully!';
        this.loadData();
        this.newTransaction = { card: null, category: null, amount: null, description: '', transaction_type: 'expense' };
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => this.errorMessage = err.error?.detail || 'Failed to add transaction'
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Delete this transaction?')) {
      this.finance.deleteTransaction(id).subscribe({
        next: () => this.loadData(),
        error: () => this.errorMessage = 'Failed to delete transaction'
      });
    }
  }
}