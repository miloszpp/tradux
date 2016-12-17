import { AddOrderAction, addOrder } from '../actions';
import { firebaseConfig } from '../../common/config/firebase';

var Chance = require('chance');
var firebase = require('firebase');

function getRandomAddAction(): AddOrderAction {
    var chance = new Chance();
    return addOrder(
        chance.name(),
        chance.pick(['crystals', 'credits', 'mithril', 'mercury']),
        chance.natural({ min: 1, max: 999 }),
        chance.natural({ min: 1, max: 999 }),
        chance.bool() + 0,
        Date.now()
    );
}

var app = firebase.initializeApp(firebaseConfig);
var ref = firebase.database().ref();
var storesRef = ref.child('/events');

var i = 0;
while (i++ < 1000) {
    var newStoreRef = storesRef.push();
    var action = getRandomAddAction();    
    var actualAction = (<any>Object).assign({}, action, { timestamp: { '.sv': 'timestamp' } });
    newStoreRef.set(actualAction);
    console.log('Push ' + i + ' successful...', JSON.stringify(actualAction));
}