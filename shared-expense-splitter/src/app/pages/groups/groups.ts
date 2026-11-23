import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense';

@Component({
  selector: 'app-groups',
  imports: [FormsModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  service = inject(ExpenseService);
  newGroup = '';

  count(group: string) {
    return this.service.expenses().filter(e => e.group === group).length;
  }
  add() {
    this.service.addGroup(this.newGroup);
    this.newGroup = '';
  }
}