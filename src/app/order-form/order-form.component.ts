import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';

import { AppState } from '../reducers';
import { Direction } from '../model';
import { AddOrderAction, addOrder } from '../actions';

@Component({
  selector: 'app-order-form',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Add order</div>
      <div class="panel-body">
        <div class="order-form">
          <form>
            <div class="form-group">
              <label for="product">Product</label>
              <select #product class="form-control" id="product">
                <option value="crystals">Crystals</option>
                <option value="mithril">Mithril</option>
                <option value="mercury">Mercury</option>
                <option value="credits">Credits</option>
              </select>
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
              <input #quantity type="number" class="form-control" id="quantity" placeholder="Quantity" min="1" />
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input #price type="number" class="form-control" id="price" placeholder="Price" min="1" />
            </div>
            <button 
              type="submit" 
              class="btn btn-default" 
              (click)="addOrder(product.value, direction.value, quantity.value, price.value)">
              Submit
            </button>
          </form>
        </div>
      </div>
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

  addOrder(product: string, direction: string, quantity: string, price: string) {
    this.store.dispatch(addOrder(
      "milosz", 
      product, 
      parseInt(quantity), 
      parseInt(price), 
      parseInt(direction),
      new Date()
    ));
  }

}
