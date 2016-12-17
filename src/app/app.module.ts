import { BrowserModule } from '@angular/platform-browser';
import { NgModule, FactoryProvider, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Store, createStore } from 'redux';
import { AngularFireModule } from 'angularfire2';
import { ModalModule } from 'ng2-modal';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { CustomFormsModule } from 'ng2-validation'

import { OrderFormComponent } from './order-form/order-form.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { TransactionLogComponent } from './transaction-log/transaction-log.component';
import { OrderScreenComponent } from './order-screen/order-screen.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PriceChartComponent } from './price-chart/price-chart.component';

import { firebaseConfig } from '../common/config/firebase';
import { AppComponent } from './app.component';
import { rootReducer, AppState } from './reducers';
import { CacheLoader } from './app.cache-loader';

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
    CustomFormsModule,
    HttpModule,
    ChartsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ModalModule,
    ToastModule
  ],
  providers: [
    CacheLoader,
    { 
      provide: APP_INITIALIZER, 
      useFactory: (loader: CacheLoader) => () => loader.load(), 
      deps: [ CacheLoader ],
      multi: true 
    },
    { 
      provide: 'AppStore', 
      useFactory: provideAppStore,
      deps: [ CacheLoader ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

function provideAppStore(loader: CacheLoader) {
  // return () => {
    const state: AppState = {
      screen: loader.preloadedState,
      control: {
        username: null,
        isLogged: false
      }
    }
    return createStore<AppState>(rootReducer, state);
  // };
}