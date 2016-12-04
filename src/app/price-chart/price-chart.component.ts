import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from 'redux';
import * as moment from 'moment';

import { AppState } from '../reducers';
import { Order, Direction, Products } from '../model';

@Component({
  selector: 'app-price-chart',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">Price chart</div>
      <div class="panel-body">
        <div style="display: block;">
          <canvas baseChart width="400" height="400"
            [options]="chartOptions" 
            [datasets]="chartData"
            [labels]="chartLabels"
            chartType="line">
          </canvas>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PriceChartComponent implements OnInit {

  public chartData: Array<any>;
  public chartLabels: Array<any>;

  public chartOptions: any = {
    animation: false,
    responsive: true,
    scales: {
      xAxes: [{
        display: false
      }]
    },
    elements: { point: { radius: 0 } } 
  };

  constructor(
      @Inject('AppStore') private store: Store<AppState>
  ) {
    this.calculateChartData();
  }

  ngOnInit() {
    this.store.subscribe(this.calculateChartData);
  }

  private calculateChartData = () => {
    const prices = this.store.getState().screen.avgPrices;
    this.chartData = Products.map(product => {
      const data = prices.map(p => p.prices[product]);
      return { data: data, label: product };
    });
    this.chartLabels = prices.map(p => p.timestamp);
  };

}
