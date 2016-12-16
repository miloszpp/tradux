module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var firebase_1 = __webpack_require__(1);
	var screen_1 = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var request = __webpack_require__(5);
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
	        } else if (res.statusCode !== 200) {
	            callback(res.body.error);
	        } else {
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
	        } else if (res.statusCode !== 200) {
	            callback(res.body.error);
	        } else {
	            callback(null, "State updated");
	        }
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.firebaseConfig = {
	    apiKey: "AIzaSyAdKPKsXBOJX-Inx_NCsMYGCyGUGG7tU2E",
	    authDomain: "tradux-fa630.firebaseapp.com",
	    databaseURL: "https://tradux-fa630.firebaseio.com",
	    storageBucket: ""
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = __webpack_require__(3);
	var model_1 = __webpack_require__(4);
	function addOrder(state, action) {
	    if (action.quantity === 0) {
	        return state;
	    }
	    var matching = findMatchingOrder(state.activeOrders, action);
	    if (matching === null) {
	        var activeOrders = insertItem(state.activeOrders, orderFromAddAction(action));
	        var avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
	        return Object.assign({}, state, { activeOrders: activeOrders, avgPrices: insertItem(state.avgPrices, avgPrices) });
	    } else {
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
	        } else {
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
	    var ordersByProduct = _.groupBy(orders, function (order) {
	        return order.product;
	    });
	    var products = _.map(ordersByProduct, function (productOrders, product) {
	        return product;
	    });
	    var avgPrices = _.map(ordersByProduct, function (productOrders, product) {
	        var nom = _.sum(_.map(productOrders, function (order) {
	            return order.price * order.quantity;
	        }));
	        var denom = _.sum(_.map(productOrders, function (order) {
	            return order.quantity;
	        }));
	        return nom / denom;
	    });
	    return _.zipObject(products, avgPrices);
	}
	function findMatchingOrder(orders, action) {
	    var matchingOrders = orders.filter(function (order) {
	        return action.product === order.product && action.direction !== order.direction && (action.direction === model_1.Direction.Buy && action.price >= order.price || action.direction === model_1.Direction.Sell && action.price <= order.price);
	    });
	    if (matchingOrders.length === 0) return null;
	    return matchingOrders.sort(function (order) {
	        return order.direction === model_1.Direction.Buy ? order.price : -order.price;
	    })[0];
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
	    if (index === void 0) {
	        index = array.length;
	    }
	    return array.slice(0, index).concat([item], array.slice(index));
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	(function (Direction) {
	    Direction[Direction["Buy"] = 0] = "Buy";
	    Direction[Direction["Sell"] = 1] = "Sell";
	})(exports.Direction || (exports.Direction = {}));
	var Direction = exports.Direction;
	exports.Products = ['mithril', 'crystals', 'mercury', 'credits'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ }
/******/ ]);