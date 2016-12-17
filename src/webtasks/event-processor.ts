import { firebaseConfig } from '../common/config/firebase';
import { FirebaseAppSecret } from '../common/config/firebase-secret';
import { ScreenState } from '../common/model';
import { addOrder, AddOrderParams } from '../common/reducers/screen';

import * as _ from 'lodash';

var request = require('request');

module.exports = function (callback) {
    const eventsUrl = `${firebaseConfig.databaseURL}/events.json?auth=${FirebaseAppSecret}`;
    const stateUrl = `${firebaseConfig.databaseURL}/state.json?auth=${FirebaseAppSecret}`;

    const initialState: ScreenState = {
        activeOrders: [],
        avgPrices: [],
        transactions: [],
        modified: 0
    };

    request.get(eventsUrl, getEventsCallback);

    function getEventsCallback(error, res, eventsBody) {
        if (error) {
            callback(error);
        } else if (res.statusCode !== 200) {
            callback(res.body.error); 
        } else {
            const eventsDict: _.Dictionary<AddOrderParams> = JSON.parse(eventsBody);
            const events = _.values(eventsDict);
            const state = _.reduce(events, addOrder, initialState);
            const stateObj = _.assign({}, state, { modified: { '.sv': 'timestamp' } });
            
            const requestOptions = {
                method: 'PUT',
                url: stateUrl,
                json: stateObj
            };
            request(requestOptions, putStateCallback);
        }
    }

    function putStateCallback(error, res, body) {
        if (error) {
            callback(error);
        } else if (res.statusCode !== 200) {
            callback(res.body.error);
        } else {
            callback(null, "State updated");
        }
    }
}