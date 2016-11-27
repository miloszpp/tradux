import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Store, createStore } from 'redux';

import { AppComponent } from './app.component';
import { rootReducer, AppState } from './reducers';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderBookComponent } from './order-book/order-book.component';

const appStore: Store<AppState> = createStore(rootReducer);

@NgModule({
  declarations: [
    AppComponent,
    OrderFormComponent,
    OrderBookComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    { provide: 'AppStore', useValue: appStore }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
