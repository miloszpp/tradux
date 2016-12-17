import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AngularFireModule, _getFirebase } from 'angularfire2';

import { environment } from './environments/environment';
import { firebaseConfig } from './common/config/firebase';
import { ScreenState } from './common/reducers/screen';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
