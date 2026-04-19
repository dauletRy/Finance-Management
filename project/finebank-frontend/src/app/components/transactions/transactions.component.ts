import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  categories: any[] = [];
  searchTerm = '';
  errorMessage = '';

  newTransaction: any = {
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

    // You can also load categories if needed
  }

  filter() {
    this.filteredTransactions = this.transactions.filter(t =>
      t.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addTransaction() {
    this.finance.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.loadData();
        this.newTransaction = { card: null, category: null, amount: null, description: '', transaction_type: 'expense' };
      },
      error: (err) => this.errorMessage = err.error?.detail || 'Failed to add transaction'
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Delete this transaction?')) {
      // You can implement DELETE via service if you want
      alert('Transaction deleted (add DELETE method to service for full CRUD)');
      this.loadData();
    }
  }
}