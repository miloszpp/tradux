import { AddOrderAction, addOrder } from '../actions';
import { firebaseConfig } from '../config/firebase';

var Chance = require('chance');
var firebase = require('firebase');

function getRandomAddAction(): AddOrderAction {
    var chance = new Chance();
    return addOrder(
        chance.name(),
        chance.pick(['crystals', 'credits', 'mithril', 'mercury']),
        chance.natural({ min: 1, max: 100 }),
        chance.natural({ min: 1, max: 100 }),
        chance.bool() + 0,
        Date.now()
    );
}

var app = firebase.initializeApp(firebaseConfig);
var ref = firebase.database().ref();
var storesRef = ref.child('/events');

var i = 0;
while (i++ < 100) {
    var newStoreRef = storesRef.push();
    newStoreRef.set(getRandomAddAction());
    console.log('Push ' + i + ' successful...');
}