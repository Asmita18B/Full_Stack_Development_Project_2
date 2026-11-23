import { Injectable, signal, computed } from '@angular/core';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  group: string;
}
export type NewExpense = Omit<Expense, 'id'>;

export interface SplitRow {
  name: string;
  paid: number;
  share: number;
  net: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  members = ['Asha', 'Ravi', 'Meera', 'Karan'];
  groups = signal<string[]>(['Goa Trip', 'Flatmates']);
  expenses = signal<Expense[]>([
    { id: 1, description: 'Hotel', amount: 4000, paidBy: 'Asha', group: 'Goa Trip' },
    { id: 2, description: 'Groceries', amount: 1200, paidBy: 'Ravi', group: 'Flatmates' },
  ]);

  total = computed(() => this.expenses().reduce((sum, e) => sum + e.amount, 0));

  // Everyone shares equally; balance = what you paid - your fair share
  balances = computed(() => {
    const share = this.total() / this.members.length;
    return this.members.map(name => {
      const paid = this.expenses()
        .filter(e => e.paidBy === name)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name, paid, balance: paid - share };
    });
  });

  // NEW: split of ONE expense, one row per person
  splitOf(e: Expense): SplitRow[] {
    const share = e.amount / this.members.length;
    return this.members.map(name => {
      const paid = name === e.paidBy ? e.amount : 0;
      return { name, paid, share, net: paid - share };
    });
  }

  // NEW: every expense from one person's point of view, with a running balance
  ledgerFor(person: string) {
    let running = 0;
    return this.expenses().map(e => {
      const share = e.amount / this.members.length;
      const paid = e.paidBy === person ? e.amount : 0;
      const net = paid - share;
      running += net;
      return {
        id: e.id,
        description: e.description,
        group: e.group,
        paidBy: e.paidBy,
        amount: e.amount,
        paid,
        share,
        net,
        running,
      };
    });
  }

  // NEW: who should pay whom, using the fewest payments
  settlements = computed<Settlement[]>(() => {
    const creditors = this.balances()
      .filter(b => b.balance > 0.005)
      .map(b => ({ name: b.name, amt: b.balance }));
    const debtors = this.balances()
      .filter(b => b.balance < -0.005)
      .map(b => ({ name: b.name, amt: -b.balance }));

    const result: Settlement[] = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);
      result.push({ from: debtors[i].name, to: creditors[j].name, amount: pay });
      debtors[i].amt -= pay;
      creditors[j].amt -= pay;
      if (debtors[i].amt < 0.005) i++;
      if (creditors[j].amt < 0.005) j++;
    }
    return result;
  });

  addExpense(e: NewExpense) {
    this.expenses.update(list => [...list, { ...e, id: Date.now() }]);
  }
  deleteExpense(id: number) {
    this.expenses.update(list => list.filter(e => e.id !== id));
  }
  addGroup(name: string) {
    if (name.trim()) this.groups.update(g => [...g, name.trim()]);
  }
}