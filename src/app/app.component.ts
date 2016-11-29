import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { Store } from 'redux';
import { FirebaseRef, AngularFire } from 'angularfire2';

import { AppState } from './reducers';
import { AddOrderAction } from './actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private listsRef: any;

  constructor(
    @Inject('AppStore') private store: Store<AppState>,
    @Inject(FirebaseRef) private firebase: any,
    private zone: NgZone
  ) {
    this.listsRef = firebase.database().ref('/events');
  }

  ngOnInit() {
    this.listsRef.on('child_added', listSnap => {
      this.zone.run(() => {
        this.store.dispatch(<AddOrderAction>listSnap.val());
      });
    });
  }

}
