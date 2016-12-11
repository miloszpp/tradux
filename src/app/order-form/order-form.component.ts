import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';
import { FirebaseRef, AngularFire, FirebaseListObservable } from 'angularfire2';

import { AppState } from '../reducers';
import { Direction, Products } from '../model';
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
                <option *ngFor="let product of products" [value]="product">{{ product }}</option>
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
              <input #quantity type="number" class="form-control" id="quantity" placeholder="Quantity" min="1" required />
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input #price type="number" class="form-control" id="price" placeholder="Price" min="1" required />
            </div>
            <button 
              type="submit" 
              class="btn btn-default" 
              [disabled]="!canSubmit"
              (click)="addOrder(product.value, direction.value, quantity.value, price.value)">
              Submit
            </button>
            <span>{{ submitResult }}</span>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrderFormComponent implements OnInit {

  private username: string | null;
  private products: string[];
  private canSubmit: Boolean;
  private submitResult: string;

  constructor(
    @Inject('AppStore') private store: Store<AppState>,
    private af: AngularFire
  ) {
    this.products = Products;
    this.canSubmit = false;
    this.username = null;
    this.submitResult = "";
  }

  ngOnInit() {
    this.store.subscribe(() => {
      this.canSubmit = this.store.getState().control.isLogged;
      this.username = this.store.getState().control.username;
    });
  }

  addOrder(product: string, direction: string, quantity: string, price: string) {
    const event = addOrder(
      this.username, 
      product, 
      parseInt(quantity), 
      parseInt(price), 
      parseInt(direction),
      Date.now()
    );
    this.af.database.list('/events').push(event).then(
      () => {
        this.submitResult = "Order added";
      },
      () => {
        this.submitResult = "Validation failed";
      });
  }

}
