import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cards.component.html'
})
export class CardsComponent implements OnInit {
  cards: any[] = [];
  newCard = { name: '', balance: 0 };
  errorMessage = '';

  constructor(private finance: FinanceService) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.finance.getCards().subscribe({
      next: (data) => this.cards = data,
      error: () => this.errorMessage = 'Failed to load cards'
    });
  }

  addCard() {
    if (!this.newCard.name) return;
    this.finance.createCard(this.newCard).subscribe({
      next: () => {
        this.loadCards();
        this.newCard = { name: '', balance: 0 };
      },
      error: (err) => this.errorMessage = err.error?.detail || 'Failed to create card'
    });
  }

  deleteCard(id: number) {
    if (confirm('Delete this card?')) {
      this.finance.deleteCard(id).subscribe({
        next: () => this.loadCards(),
        error: () => this.errorMessage = 'Failed to delete card'
      });
    }
  }
}