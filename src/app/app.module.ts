import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Store, createStore } from 'redux';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { rootReducer, AppState } from './reducers';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { TransactionLogComponent } from './transaction-log/transaction-log.component';
import { OrderScreenComponent } from './order-screen/order-screen.component';
import { firebaseConfig } from './config/firebase';
import { InventoryComponent } from './inventory/inventory.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { ModalModule } from "ng2-modal";

const appStore: Store<AppState> = createStore(rootReducer);

@NgModule({
  declarations: [
    AppComponent,
    OrderFormComponent,
    OrderBookComponent,
    TransactionLogComponent,
    OrderScreenComponent,
    InventoryComponent,
    PriceChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ModalModule
  ],
  providers: [
    { provide: 'AppStore', useValue: appStore }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
