import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';
import * as _ from 'lodash';

import { AppState } from '../reducers';
import { Order, Direction, Products } from '../../common/model';

@Component({
  selector: 'app-order-screen',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Trading screen</div>
      <div class="panel-body">
        <table class="table table-bordered">
          <tr>
            <th colspan="2" *ngFor="let product of products">{{product}}</th>
          </tr>
          <tr>
            <template let-product ngFor [ngForOf]="products">
              <td>Bid</td>
              <td>Ask</td>
            </template>
          </tr>
          <tr *ngFor="let screenRow of screenRows">
            <template let-product ngFor [ngForOf]="screenRow.products">
              <td>{{ product.buy ? '$' + product.buy.price + ' (' + product.buy.quantity + ')' : '-' }}</td>
              <td>{{ product.sell ? '$' + product.sell.price + ' (' + product.sell.quantity + ')' : '-' }}</td>
            </template>
          </tr>
        </table>
        <p>Each cell represents: <i>$price (quantity)</i></p>
      </div>
    </div>
  `,
  styles: []
})
export class OrderScreenComponent implements OnInit {
  private screenRows: ScreenRow[];
  private products: string[];

  constructor(
    @Inject('AppStore') private store: Store<AppState>
  ) {
    this.products = Products;
    this.calculateScreen();
  }

  ngOnInit() {
    this.store.subscribe(this.calculateScreen);
  }

  private calculateScreen = () => {
    const orders = this.store.getState().screen.activeOrders;
    const ordersByProducts = _.groupBy(orders, 'product');
    
    const bestBuyOrders = _.map(Products, (product) => {
      const productOrders = ordersByProducts[product];
      const buyOrders = _.filter(productOrders, order => order.direction === Direction.Buy);
      return _.orderBy(buyOrders, 'price', 'desc').slice(0, 5);
    });

    const bestSellOrders = _.map(Products, (product) => {
      const productOrders = ordersByProducts[product];
      const sellOrders = _.filter(productOrders, order => order.direction === Direction.Sell);
      return _.orderBy(sellOrders, 'price', 'asc').slice(0, 5);
    });

    this.screenRows = _.map(_.range(0, 5), (idx) => {
      const products = _.zipWith<ScreenRowProduct>(Products, bestBuyOrders, bestSellOrders, (product, bestBuy, bestSell) => {
        return new ScreenRowProduct(bestBuy[idx], bestSell[idx]);
      })
      return new ScreenRow(products);
    });
  };

}

class ScreenRow {
  constructor(public products: ScreenRowProduct[]) {}
}

class ScreenRowProduct {
  constructor(public buy: Order, public sell: Order) {}
}