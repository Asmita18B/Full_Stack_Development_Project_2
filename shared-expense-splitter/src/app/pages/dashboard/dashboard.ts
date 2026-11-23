import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense';
import { ExpenseList } from '../../components/expense-list/expense-list';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, ExpenseList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  service = inject(ExpenseService);
  recent = computed(() => this.service.expenses().slice(-3).reverse());
}