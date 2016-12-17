import { Inject, Injectable } from '@angular/core';
import { FirebaseRef } from 'angularfire2';

import { ScreenState } from 'common/reducers/screen';

@Injectable()
export class CacheLoader {
    constructor(@Inject(FirebaseRef) private firebase: any) { }

    public preloadedState: ScreenState;

    public load() {
        return this.firebase.database().ref('state').once('value').then(snapshot => {
            this.preloadedState = snapshot.val();
            if (this.preloadedState) {
                console.log(`Received state snapshot with timestamp: ${this.preloadedState.modified}`);
            } else {
                console.log('Did not receive previous state snapshot');
            }
        });
    }

}