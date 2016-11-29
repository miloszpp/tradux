import { Component, OnInit, Inject } from '@angular/core';
import { Store } from 'redux';

import { AppState } from '../reducers';
import { Order, Direction } from '../model';

@Component({
  selector: 'app-order-screen',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Trading screen</div>
      <div class="panel-body">
        <table class="table table-bordered">
          <tr>
            <th colspan="2">Crystals</th>
            <th colspan="2">Mithril</th>
            <th colspan="2">Mercury</th>
            <th colspan="2">Credits</th>
          </tr>
          <tr>
            <td>Bid</td>
            <td>Ask</td>
            <td>Bid</td>
            <td>Ask</td>
            <td>Bid</td>
            <td>Ask</td>
            <td>Bid</td>
            <td>Ask</td>
          </tr>
          <tr>
            <td>\${{ prices['crystals'].bid }}</td>
            <td>\${{ prices['crystals'].ask }}</td>
            <td>\${{ prices['mithril'].bid }}</td>
            <td>\${{ prices['mithril'].ask }}</td>
            <td>\${{ prices['mercury'].bid }}</td>
            <td>\${{ prices['mercury'].ask }}</td>
            <td>\${{ prices['credits'].bid }}</td>
            <td>\${{ prices['credits'].ask }}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class OrderScreenComponent implements OnInit {
  private prices: { [id: string]: Prices };

  constructor(
    @Inject('AppStore') private store: Store<AppState>
  ) {
    this.prices = {
      crystals: new Prices(null, null),
      mithril: new Prices(null, null),
      mercury: new Prices(null, null),
      credits: new Prices(null, null)
    };
  }

  ngOnInit() {
    this.store.subscribe(() => {
      const prices: { [id: string]: Prices } = {
        crystals: new Prices(null, null),
        mithril: new Prices(null, null),
        mercury: new Prices(null, null),
        credits: new Prices(null, null)
      };
      const orders = this.store.getState().screen.activeOrders;
      for (var order of orders) {
        var best = prices[order.product];
        if (order.direction === Direction.Buy && (best.bid === null || order.price > best.bid)) {
          best.bid = order.price;
        }
        if (order.direction === Direction.Sell && (best.ask === null || order.price < best.ask)) {
          best.ask = order.price;
        }
      }
      console.log(prices);
      this.prices = prices;
    });
  }

}

class Prices {
  constructor(public bid: number | null, public ask: number | null) {}
}