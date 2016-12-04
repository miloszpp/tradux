System.register("screen", ['../model', '../actions'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var model_1, actions_1;
    var initialState;
    function screen(state, action) {
        if (state === void 0) { state = initialState; }
        switch (action.type) {
            case actions_1.Actions.addOrder:
                var addOrderAction = action;
                return addOrder(state, addOrderAction);
            default:
                return state;
        }
    }
    exports_1("screen", screen);
    function addOrder(state, action) {
        if (action.quantity === 0) {
            return state;
        }
        var matching = findMatchingOrder(state.activeOrders, action);
        if (matching === null) {
            return Object.assign({}, state, { activeOrders: state.activeOrders.concat([orderFromAddAction(action)]) });
        }
        else {
            var transaction = {
                product: action.product,
                buyer: action.direction === model_1.Direction.Buy ? action.user : matching.user,
                seller: action.direction === model_1.Direction.Sell ? action.user : matching.user,
                quantity: Math.min(matching.quantity, action.quantity),
                price: matching.price,
                date: action.timestamp
            };
            var matchingOrderIndex = state.activeOrders.indexOf(matching);
            var updatedTransactions = state.transactions.concat([transaction]);
            if (action.quantity >= matching.quantity) {
                return addOrder({
                    transactions: updatedTransactions,
                    activeOrders: removeItem(state.activeOrders, matchingOrderIndex)
                }, Object.assign({}, action, { quantity: action.quantity - matching.quantity }));
            }
            else {
                var updatedOrder = Object.assign({}, matching, { quantity: matching.quantity - action.quantity });
                return {
                    transactions: updatedTransactions,
                    activeOrders: updateItem(state.activeOrders, updatedOrder, matchingOrderIndex)
                };
            }
        }
    }
    function findMatchingOrder(orders, action) {
        var matchingOrders = orders.filter(function (order) {
            return action.product === order.product && action.direction !== order.direction &&
                ((action.direction === model_1.Direction.Buy && action.price >= order.price) ||
                    (action.direction === model_1.Direction.Sell && action.price <= order.price));
        });
        if (matchingOrders.length === 0)
            return null;
        return matchingOrders.sort(function (order) { return order.direction === model_1.Direction.Buy ? order.price : -order.price; })[0];
    }
    function orderFromAddAction(action) {
        return {
            direction: action.direction,
            price: action.price,
            product: action.product,
            quantity: action.quantity,
            user: action.user
        };
    }
    function insertItem(array, item, index) {
        return array.slice(0, index).concat([
            item
        ], array.slice(index));
    }
    function removeItem(array, index) {
        return array.slice(0, index).concat(array.slice(index + 1));
    }
    function updateItem(array, newItem, itemIndex) {
        return array.map(function (item, index) {
            if (index !== itemIndex) {
                return item;
            }
            return newItem;
        });
    }
    return {
        setters:[
            function (model_1_1) {
                model_1 = model_1_1;
            },
            function (actions_1_1) {
                actions_1 = actions_1_1;
            }],
        execute: function() {
            initialState = {
                transactions: [],
                activeOrders: []
            };
        }
    }
});
System.register("index", ['redux', "screen"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var redux_1, screen_1;
    var rootReducer;
    return {
        setters:[
            function (redux_1_1) {
                redux_1 = redux_1_1;
            },
            function (screen_1_1) {
                screen_1 = screen_1_1;
            }],
        execute: function() {
            exports_2("rootReducer", rootReducer = redux_1.combineReducers({ screen: screen_1.screen }));
        }
    }
});
