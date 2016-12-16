"use strict";
var _ = require("lodash");
var model_1 = require('../model');
function addOrder(state, action) {
    if (action.quantity === 0) {
        return state;
    }
    var matching = findMatchingOrder(state.activeOrders, action);
    if (matching === null) {
        var activeOrders = insertItem(state.activeOrders, orderFromAddAction(action));
        var avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
        return Object.assign({}, state, { activeOrders: activeOrders, avgPrices: insertItem(state.avgPrices, avgPrices) });
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
            var activeOrders = removeItem(state.activeOrders, matchingOrderIndex);
            var avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
            return addOrder({
                transactions: updatedTransactions,
                activeOrders: activeOrders,
                avgPrices: insertItem(state.avgPrices, avgPrices),
                modified: state.modified
            }, Object.assign({}, action, { quantity: action.quantity - matching.quantity }));
        }
        else {
            var updatedOrder = Object.assign({}, matching, { quantity: matching.quantity - action.quantity });
            var activeOrders = updateItem(state.activeOrders, updatedOrder, matchingOrderIndex);
            var avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
            return {
                transactions: updatedTransactions,
                activeOrders: activeOrders,
                avgPrices: insertItem(state.avgPrices, avgPrices),
                modified: state.modified
            };
        }
    }
}
exports.addOrder = addOrder;
function calculateAveragePrices(orders) {
    var ordersByProduct = _.groupBy(orders, function (order) { return order.product; });
    var products = _.map(ordersByProduct, function (productOrders, product) { return product; });
    var avgPrices = _.map(ordersByProduct, function (productOrders, product) {
        var nom = _.sum(_.map(productOrders, function (order) { return order.price * order.quantity; }));
        var denom = _.sum(_.map(productOrders, function (order) { return order.quantity; }));
        return nom / denom;
    });
    return _.zipObject(products, avgPrices);
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
    if (index === void 0) { index = array.length; }
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
