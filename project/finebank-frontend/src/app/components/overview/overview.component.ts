import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { AuthService } from '../../services/auth.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit, AfterViewInit {
  cards: any[] = [];
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  categories: any[] = [];
  totalBalance = 0;
  activeCardId: number | null = null;
  searchTerm = '';
  showBudgetAlert = false;
  username = 'User';

  newTransaction: any = {
    card: null,
    category: null,
    amount: null,
    description: '',
    transaction_type: 'expense'
  };

  private chart: any;

  constructor(private finance: FinanceService, private auth: AuthService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {}

  loadData() {
    this.finance.getCards().subscribe(data => {
      this.cards = data;
      if (this.cards.length) this.activeCardId = this.cards[0].id;
      this.totalBalance = this.cards.reduce((sum: number, c: any) => sum + parseFloat(c.balance), 0);
      this.checkBudgetAlert();
    });

    this.finance.getTransactions().subscribe(data => {
      this.transactions = data;
      this.filteredTransactions = [...data];
    });

    this.finance.getDashboard().subscribe(data => {
      this.renderChart(data);
    });

    this.finance.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  nextCard() {
    const idx = this.cards.findIndex(c => c.id === this.activeCardId);
    this.activeCardId = this.cards[(idx + 1) % this.cards.length].id;
    this.checkBudgetAlert();
  }

  addTransaction() {
    this.finance.createTransaction(this.newTransaction).subscribe({
      next: () => {
        alert('Transaction added successfully!');
        this.loadData();
        this.newTransaction = { card: null, category: null, amount: null, description: '', transaction_type: 'expense' };
      },
      error: (err) => alert(err.error?.detail || 'Failed to add transaction')
    });
  }

  exportCSV() {
    this.finance.exportCSV().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finebank_transactions.csv';
      a.click();
    });
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  checkBudgetAlert() {
    const activeCard = this.cards.find(c => c.id === this.activeCardId);
    this.showBudgetAlert = activeCard && activeCard.balance < 500;
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(t =>
      t.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  private renderChart(dashboardData: any) {
    if (this.chart) this.chart.destroy();
    const ctx = document.getElementById('spendChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          data: [dashboardData.total_income || 1200, dashboardData.total_expense || 850],
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