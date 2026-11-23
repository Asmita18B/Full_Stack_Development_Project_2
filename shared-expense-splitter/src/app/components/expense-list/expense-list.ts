import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Expense } from '../../services/expense';

@Component({
  selector: 'app-expense-list',
  imports: [CurrencyPipe],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  expenses = input<Expense[]>([]);
  showDelete = input(true);
  remove = output<number>();
}