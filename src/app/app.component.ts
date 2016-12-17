import { Component, Inject, OnInit, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from 'redux';
import { FirebaseRef, AngularFire } from 'angularfire2';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AppState } from './reducers';
import { AddOrderAction, authenticate } from './actions';
import { CacheLoader } from './app.cache-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private listsRef: any;
  @ViewChild('authModal') authModal: any;

  constructor(
    @Inject('AppStore') private store: Store<AppState>,
    @Inject(FirebaseRef) private firebase: any,
    private cacheLoader: CacheLoader,
    private zone: NgZone,
    public toastr: ToastsManager, 
    vRef: ViewContainerRef
  ) {
    const stateTimestamp = cacheLoader.preloadedState.modified;
    this.listsRef = firebase.database()
      .ref('events')
      .orderByChild('timestamp')
      .startAt(stateTimestamp);
    // toastr workaround https://github.com/PointInside/ng2-toastr/issues/80
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.listsRef.on('child_added', listSnap => {
      this.zone.run(() => {
        const action = <AddOrderAction>listSnap.val();
        console.log('Received event: ', action);
        this.store.dispatch(action);
      });
    });
    this.authModal.open();
  }

  public usernameEntered(username: string) {
    if (username === null || username === undefined || username.length === 0) {
      return;
    }
    this.store.dispatch(authenticate(username));
    this.authModal.close();
  }

}
