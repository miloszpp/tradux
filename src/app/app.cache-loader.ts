import { Inject, Injectable } from '@angular/core';
import { FirebaseRef } from 'angularfire2';

import { ScreenState } from 'common/model';

@Injectable()
export class CacheLoader {
    constructor(@Inject(FirebaseRef) private firebase: any) { }

    public preloadedState: ScreenState;

    public load() {
        return this.firebase.database().ref('state').once('value').then(snapshot => {
            this.preloadedState = snapshot.val();
            if (this.preloadedState) {
                // Firebase doesn't like empty arrays :(
                if (this.preloadedState.activeOrders === undefined) {
                    this.preloadedState.activeOrders = [];
                }
                if (this.preloadedState.avgPrices === undefined) {
                    this.preloadedState.avgPrices = [];
                }
                if (this.preloadedState.transactions === undefined) {
                    this.preloadedState.transactions = [];
                }
                console.log(`Received state snapshot with timestamp: ${this.preloadedState.modified}`);
            } else {
                console.log('Did not receive previous state snapshot');
            }
        });
    }

}