import { firebaseConfig } from '../common/config/firebase';
import { FirebaseAppSecret } from '../common/config/firebase-secret';
import { ScreenState } from '../common/model';
import { addOrder, AddOrderParams } from '../common/reducers/screen';

import * as _ from 'lodash';

var request = require('request');

module.exports = function (callback) {
    const cutoff = Date.now();
    console.log(`Starting with cutoff ${new Date(cutoff)}`);

    const eventsUrl = `${firebaseConfig.databaseURL}/events.json?auth=${FirebaseAppSecret}`;
    const stateUrl = `${firebaseConfig.databaseURL}/state.json?auth=${FirebaseAppSecret}`;

    const initialState: ScreenState = {
        activeOrders: [],
        avgPrices: [],
        transactions: [],
        modified: 0
    };

    request.get(stateUrl, withErrorHandling(getStateCallback));

    function getStateCallback(stateBody) {
        var previousCutoff = 0;
        const state: ScreenState = JSON.parse(stateBody);
        if (state !== null) {
            previousCutoff = state.modified;
            _.assign(initialState, state);
            console.log(`Received state with timestamp: ${new Date(previousCutoff)}`);
            console.log(`Querying for events between ${new Date(previousCutoff)} and ${new Date(cutoff)}`);
        } else {
            console.log('Did not receive previous state');
        }

        const eventsQueryUrl = `${eventsUrl}&orderBy="timestamp"&startAt=${previousCutoff}&endAt=${cutoff}`;
        request.get(eventsQueryUrl, withErrorHandling(getEventsCallback));
    }

    function getEventsCallback(eventsBody) {
        const eventsDict: _.Dictionary<AddOrderParams> = JSON.parse(eventsBody);
        const events = _.values(eventsDict);
        if (events.length == 0) {
            console.log('Processing finished - state not modified');
            callback(null, 'State not modified');
            return;
        }
        
        const state = _.reduce(events, addOrder, initialState);
        const stateObj = _.assign({}, state, { modified: cutoff });
        console.log(`Received ${events.length} events`);
        
        const requestOptions = {
            method: 'PUT',
            url: stateUrl,
            json: stateObj
        };
        request(requestOptions, withErrorHandling(() => {
            console.log('Processing finished - state updated');
            callback(null, "State updated");
            return;
        }));
    }

    function withErrorHandling(continuation) {
        return function(error, res, body) {
            if (error) {
                callback(error);
            } else if (res.statusCode !== 200) {
                callback(res.body.error);
            } else {
                continuation(body);
            }
        }
    }
}