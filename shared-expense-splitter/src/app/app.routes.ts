import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Expenses } from './pages/expenses/expenses';
import { Balances } from './pages/balances/balances';
import { Groups } from './pages/groups/groups';
import { Splits } from './pages/splits/splits';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'expenses', component: Expenses },
  { path: 'balances', component: Balances },
  { path: 'splits', component: Splits },
  { path: 'groups', component: Groups },
];