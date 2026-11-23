import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

// Shared components used directly in app.html
import { Sidebar } from './components/sidebar/sidebar';
import { ExpenseForm } from './components/expense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';

// Shared data + types
import { ExpenseService, NewExpense } from './services/expense';

// Dashboard, Expenses, Balances, Splits and Groups are NOT imported here:
// they are loaded by <router-outlet /> through app.routes.ts.

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CurrencyPipe, Sidebar, ExpenseForm, ExpenseList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ---------- Shared data (service) ----------
  svc = inject(ExpenseService);

  // ---------- Plain values: used with ONE-WAY binding ----------
  title = 'Shared Expense Splitter';
  year = new Date().getFullYear();

  // ---------- State changed by the user: used with TWO-WAY binding ----------
  showTools = signal(true);
  spendLimit = signal(10000);
  search = signal('');
  newGroup = signal('');
  selectedPerson = signal(this.svc.members[0]);

  // ---------- Derived values (recalculate automatically) ----------
  expenseCount = computed(() => this.svc.expenses().length);
  groupCount = computed(() => this.svc.groups().length);
  perPerson = computed(() => this.svc.total() / this.svc.members.length);

  overLimit = computed(() => this.svc.total() > (this.spendLimit() || 0));
  remaining = computed(() => (this.spendLimit() || 0) - this.svc.total());
  usedPercent = computed(() => {
    const limit = this.spendLimit() || 0;
    if (limit <= 0) return 100;
    return Math.min(100, Math.round((this.svc.total() / limit) * 100));
  });

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.svc
      .expenses()
      .filter(e =>
        e.description.toLowerCase().includes(term) ||
        e.paidBy.toLowerCase().includes(term) ||
        e.group.toLowerCase().includes(term)
      );
  });

  personNet = computed(() => {
    const rows = this.svc.ledgerFor(this.selectedPerson());
    return rows.reduce((sum, r) => sum + r.net, 0);
  });

  // ---------- Event handlers (EVENT binding from the template) ----------
  toggleTools() {
    this.showTools.update(v => !v);
  }
  addExpense(e: NewExpense) {
    this.svc.addExpense(e);
  }
  removeExpense(id: number) {
    this.svc.deleteExpense(id);
  }
  clearSearch() {
    this.search.set('');
  }
  addGroup() {
    this.svc.addGroup(this.newGroup());
    this.newGroup.set('');
  }
}