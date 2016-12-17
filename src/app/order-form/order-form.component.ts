import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';
import { FirebaseRef, AngularFire, FirebaseListObservable } from 'angularfire2';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AppState } from '../reducers';
import { Direction, Products } from '../../common/model';
import { Actions, AddOrderAction, addOrder } from '../actions';

@Component({
  selector: 'app-order-form',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Add order</div>
      <div class="panel-body">
        <div class="order-form">
          <form (ngSubmit)="onSubmit()" #orderForm="ngForm">
            <div class="form-group">
              <label for="product">Product</label>
              <select [(ngModel)]="model.product" class="form-control" name="product">
                <option *ngFor="let product of products" [value]="product">{{ product }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="direction">Direction</label>
              <select [(ngModel)]="model.direction" class="form-control" name="direction">
                <option value="0">Buy</option>
                <option value="1">Sell</option>
              </select>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input [(ngModel)]="model.quantity" type="number" class="form-control" name="quantity" placeholder="Quantity" [range]="[1, 999]" required />
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input [(ngModel)]="model.price" type="number" class="form-control" name="price" placeholder="Price" [range]="[1, 999]" required />
            </div>
            <span *ngIf="!canSubmit" class="text-warning">
              Please authenticate in order to add orders
            </span>
            <button 
              type="submit" 
              class="btn btn-default" 
              [disabled]="!canSubmit || !orderForm.form.valid">
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

  private username: string | null;
  private products: string[];
  private canSubmit: Boolean;
  private submitResult: string;
  private model: OrderFormModel;

  constructor(
    @Inject('AppStore') private store: Store<AppState>,
    private angularFire: AngularFire,
    private toastr: ToastsManager
  ) {
    this.products = Products;
    this.canSubmit = false;
    this.username = null;
    this.model = new OrderFormModel();
  }

  ngOnInit() {
    this.store.subscribe(() => {
      this.canSubmit = this.store.getState().control.isLogged;
      this.username = this.store.getState().control.username;
    });
  }

  onSubmit() {
    const event = {
      type: Actions.addOrder,
      user: this.username,
      product: this.model.product,
      quantity: this.model.quantity,
      price: this.model.price,
      direction: this.model.direction,
      timestamp: { '.sv': 'timestamp' }
    };
    console.log('Dispatching event to Firebase', JSON.stringify(event));
    this.angularFire.database.list('events').push(event).then(
      () => {
        setTimeout(() => this.toastr.success('Order successfully added!'), 100);
        this.model.clear();
      },
      () => {
        setTimeout(() => this.toastr.error('Could not add order. Try again later.'));
      }
    );
  }
}

class OrderFormModel {
  product: string;
  direction: Direction;
  quantity: number;
  price: number;

  constructor() {
    this.clear();
  }

  public clear() {
    this.product = Products[0];
    this.direction = Direction.Buy;
    this.quantity = undefined;
    this.price = undefined;
  }
}
