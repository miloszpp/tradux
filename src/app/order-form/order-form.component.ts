import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';

import { AppState } from '../reducers';
import { Direction } from '../model';
import { AddOrderAction, addOrder } from '../actions';

@Component({
  selector: 'app-order-form',
  template: `
    <div class="order-form">
      <form>
        <div class="form-group">
          <label for="product">Product</label>
          <input #product type="text" class="form-control" id="product" placeholder="Product" />
        </div>
        <div class="form-group">
          <label for="direction">Direction</label>
          <select #direction class="form-control" id="direction">
            <option value="0">Buy</option>
            <option value="1">Sell</option>
          </select>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input #quantity type="number" class="form-control" id="quantity" placeholder="Quantity" />
        </div>
        <div class="form-group">
          <label for="price">Price</label>
          <input #price type="number" class="form-control" id="price" placeholder="Price" />
        </div>
        <button 
          type="submit" 
          class="btn btn-default" 
          (click)="addOrder(product.value, direction.value, quantity.value, price.value)">
          Submit
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class OrderFormComponent implements OnInit {

  constructor(
    @Inject('AppStore') private store: Store<AppState>
  ) { }

  ngOnInit() {
  }

  addOrder(product: string, direction: Direction, quantity: number, price: number) {
    this.store.dispatch(addOrder("milosz", product, quantity, price, direction));
  }

}
