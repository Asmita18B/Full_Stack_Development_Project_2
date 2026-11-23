import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewExpense } from '../../services/expense';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  members = input<string[]>([]);   // like props in React
  groups = input<string[]>([]);
  added = output<NewExpense>();    // like a callback prop

  description = '';
  amount: number | null = null;
  paidBy = '';
  group = '';

  submit() {
    if (!this.description || !this.amount || !this.paidBy || !this.group) return;
    this.added.emit({
      description: this.description,
      amount: this.amount,
      paidBy: this.paidBy,
      group: this.group,
    });
    this.description = '';
    this.amount = null;
  }
}