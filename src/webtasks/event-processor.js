"use strict";
var firebase_1 = require('../common/config/firebase');
var screen_1 = require('../common/reducers/screen');
var _ = require('lodash');
var request = require('request');
module.exports = function (callback) {
    var eventsUrl = firebase_1.firebaseConfig.databaseURL + "/events.json";
    var stateUrl = firebase_1.firebaseConfig.databaseURL + "/state.json";
    var initialState = {
        activeOrders: [],
        avgPrices: [],
        transactions: [],
        modified: 0
    };
    request.get(eventsUrl, getEventsCallback);
    function getEventsCallback(error, res, eventsBody) {
        if (error) {
            callback(error);
        }
        else if (res.statusCode !== 200) {
            callback(res.body.error);
        }
        else {
            var eventsDict = JSON.parse(eventsBody);
            var events = _.values(eventsDict);
            var state = _.reduce(events, screen_1.addOrder, initialState);
            var stateObj = _.assign({}, state, { modified: { '.sv': 'timestamp' } });
            var requestOptions = {
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
        }
        else if (res.statusCode !== 200) {
            callback(res.body.error);
        }
        else {
            callback(null, "State updated");
        }
    }
};
