import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Card, Transaction, Category, NewTransaction, DashboardSummary } from '../../models/finance.models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit, AfterViewInit {
  cards: Card[] = [];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  categories: Category[] = [];
  totalBalance = 0;
  activeCardId: number | null = null;
  searchTerm = '';
  showBudgetAlert = false;
  username = '';
  successMessage = '';
  errorMessage = '';
  weeklyIncome = 0;
  weeklyExpense = 0;
  weeklyCount = 0;

  newTransaction: NewTransaction = {
    card: null,
    category: null,
    amount: null,
    description: '',
    transaction_type: 'expense'
  };

  private chart: any;

  constructor(
    private finance: FinanceService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.auth.getUsername();
    this.loadData();
  }

  ngAfterViewInit() {}

  loadData() {
    this.finance.getCards().subscribe({
      next: (data) => {
        this.cards = data;
        if (this.cards.length) this.activeCardId = this.cards[0].id;
        this.totalBalance = this.cards.reduce((sum, c) => sum + parseFloat(c.balance as any), 0);
        this.checkBudgetAlert();
      },
      error: () => this.showError('Failed to load cards.')
    });

    this.finance.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
      },
      error: () => this.showError('Failed to load transactions.')
    });

    this.finance.getDashboard().subscribe({
      next: (data) => this.renderChart(data),
      error: () => this.showError('Failed to load dashboard stats.')
    });

    this.finance.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.showError('Failed to load categories.')
    });

    this.finance.getWeeklyStats().subscribe({
      next: (data) => {
        this.weeklyIncome = data.total_income;
        this.weeklyExpense = data.total_expense;
        this.weeklyCount = data.transaction_count;
      },
      error: () => this.showError('Failed to load weekly stats.')
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

  nextCard() {
    const idx = this.cards.findIndex(c => c.id === this.activeCardId);
    this.activeCardId = this.cards[(idx + 1) % this.cards.length].id;
    this.checkBudgetAlert();
  }

  addTransaction() {
    this.clearMessages();
    this.finance.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.showSuccess('Transaction added successfully!');
        this.loadData();
        this.newTransaction = { card: null, category: null, amount: null, description: '', transaction_type: 'expense' };
      },
      error: (err) => this.showError(err.error?.detail || err.error?.error || 'Failed to add transaction.')
    });
  }

  exportCSV() {
    this.finance.exportCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finebank_transactions.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.showError('Failed to export CSV.')
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  checkBudgetAlert() {
    const activeCard = this.cards.find(c => c.id === this.activeCardId);
    this.showBudgetAlert = !!activeCard && activeCard.balance < 500;
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(t =>
      t.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  private showError(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 4000);
  }

  private showSuccess(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 4000);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private renderChart(dashboardData: DashboardSummary) {
    if (this.chart) this.chart.destroy();
    const ctx = document.getElementById('spendChart') as HTMLCanvasElement;
    if (!ctx) return;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          data: [dashboardData.total_income || 0, dashboardData.total_expense || 0],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}