import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Store } from 'redux';

import { AppState } from '../reducers';
import { Order } from '../../common/model';

@Component({
  selector: 'app-order-book',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Order book</div>
      <div class="panel-body">
        <table class="table table-striped">
          <tr>
            <th>Product</th>
            <th>Direction</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
          <tr *ngFor="let order of orders">
            <td>{{ order.product }}</td>
            <td>{{ order.direction }}</td>
            <td>{{ order.price }}</td>
            <td>{{ order.quantity }}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class OrderBookComponent implements OnInit {
  private orders: Order[];

  constructor(
    @Inject('AppStore') private store: Store<AppState>,
    public zone: NgZone
  ) {
    this.orders = [];
  }

  ngOnInit() {
    this.store.subscribe(() => {
      this.orders = this.store.getState().screen.activeOrders;
    });
  }

}
