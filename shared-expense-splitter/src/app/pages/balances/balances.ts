import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-balances',
  imports: [CurrencyPipe],
  templateUrl: './balances.html',
  styleUrl: './balances.css',
})
export class Balances {
  service = inject(ExpenseService);
}