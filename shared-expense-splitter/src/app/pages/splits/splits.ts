import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-splits',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './splits.html',
  styleUrl: './splits.css',
})
export class Splits {
  service = inject(ExpenseService);

  // the person chosen in the dropdown (state)
  selected = signal(this.service.members[0]);

  // recalculated automatically when the person or expenses change
  ledger = computed(() => this.service.ledgerFor(this.selected()));

  totals = computed(() => {
    const rows = this.ledger();
    const paid = rows.reduce((sum, r) => sum + r.paid, 0);
    const share = rows.reduce((sum, r) => sum + r.share, 0);
    return { paid, share, net: paid - share };
  });
}