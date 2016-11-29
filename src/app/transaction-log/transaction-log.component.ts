import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';

import { AppState } from '../reducers';
import { Transaction } from '../model';

@Component({
  selector: 'app-transaction-log',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Transaction log</div>
      <div class="panel-body">
        <table class="table table-striped">
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Date</th>
          </tr>
          <tr *ngFor="let transaction of transactions">
            <td>{{ transaction.product }}</td>
            <td>{{ transaction.price }}</td>
            <td>{{ transaction.quantity }}</td>
            <td>{{ transaction.buyer }}</td>
            <td>{{ transaction.seller }}</td>
            <td>{{ transaction.date | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class TransactionLogComponent implements OnInit {
  private transactions: Transaction[];

  constructor(
    @Inject('AppStore') private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.subscribe(() => {
      const transactions = this.store.getState().screen.transactions.slice(0);
      transactions.sort((a, b) => b.date - a.date);
      this.transactions = transactions.slice(0, 5);
    });
  }

}
