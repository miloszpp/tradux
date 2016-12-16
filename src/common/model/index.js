"use strict";
(function (Direction) {
    Direction[Direction["Buy"] = 0] = "Buy";
    Direction[Direction["Sell"] = 1] = "Sell";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
exports.Products = ['mithril', 'crystals', 'mercury', 'credits'];
