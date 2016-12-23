import { firebaseConfig } from '../common/config/firebase';
import { FirebaseAppSecret } from '../common/config/firebase-secret';
import { ScreenState, Order, Products, Direction } from '../common/model';
import { addOrder, AddOrderParams } from '../common/reducers/screen';

import * as _ from 'lodash';

var request = require('request');

module.exports = function (callback) {
    const eventsUrl = `${firebaseConfig.databaseURL}/events.json?auth=${FirebaseAppSecret}`;
    const stateUrl = `${firebaseConfig.databaseURL}/state.json?auth=${FirebaseAppSecret}`;
    const maxWebtaskDuration = 25000;
    const interval = 1000;
    const newOrderChance = 0.3;

    var executionCount = maxWebtaskDuration / interval;

    request.get(stateUrl, getStateCallback);

    function getStateCallback(error, res, stateBody) {
        if (error) {
            callback(error);
        } else if (res.statusCode !== 200) {
            callback(res.body.error); 
        } else {
            const state: ScreenState = JSON.parse(stateBody);
            generateOrders(state);
        }
    }

    function generateOrders(state: ScreenState) {
        scheduleGenerateOrder();
        
        function generateOrder() {
            const event = Math.random() > newOrderChance
                ? randomCounteroffer()
                : randomOrder();
            const requestOptions = {
                method: 'POST',
                url: eventsUrl,
                json: event
            };
            request(requestOptions, scheduleGenerateOrder);
        }

        function randomCounteroffer() {
            console.log('Will add counteroffer');
            const index = randomInt(0, state.activeOrders.length - 1);
            const order = state.activeOrders[index];            
            return {
                    type: "AddOrderAction",
                    user: "Market Maker",
                    product: order.product,
                    quantity: 1,
                    price: order.price,
                    direction: 1 - order.direction,
                    timestamp: { '.sv': 'timestamp' }
            };
        }

        function randomOrder() {
            console.log('Will add new order');
            return {
                type: "AddOrderAction",
                user: "Market Maker",
                product: ['crystals', 'credits', 'mithril', 'mercury'][randomInt(0, 5)],
                quantity: randomInt(1, 1000),
                price: randomInt(1, 1000),
                direction: randomInt(0, 2) + 0,
                timestamp: { '.sv': 'timestamp' }
            };
        }

        function scheduleGenerateOrder() {
            if (executionCount-- > 0) {
                console.log(`Scheduling new order. ${executionCount} remaining.`);
            setTimeout(generateOrder, interval);
            } else {
                console.log('Sequence finished');
                callback(null, 'Finished');
            }
        }
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

}