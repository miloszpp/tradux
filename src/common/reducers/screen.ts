import * as _ from "lodash";

import { Order, Transaction, Direction, PriceDictionary, PricesEntry, ScreenState } from '../model';
import * as l from '../utils/lists';

export interface AddOrderParams {
    type: string;
    user: string;
    product: string;
    quantity: number;
    price: number;
    direction: Direction;
    timestamp: number;
}

const transactionLogLength = 10;
const pricesHistoryLength = 50;

export function addOrder(state: ScreenState, action: AddOrderParams): ScreenState {
    if (action.quantity === 0) {
        return state;
    }
    const matching = findMatchingOrder(state.activeOrders, action);
    if (matching === null) {
        const activeOrders = l.insertItem(state.activeOrders, orderFromAddAction(action));
        const newState = _.assign({}, state, { activeOrders: activeOrders });
        return newState;
    } else {
        const transaction: Transaction = {
            product: action.product,
            buyer: action.direction === Direction.Buy ? action.user : matching.user,
            seller: action.direction === Direction.Sell ? action.user : matching.user,
            quantity: Math.min(matching.quantity, action.quantity),
            price: matching.price,
            date: action.timestamp
        };
        const matchingOrderIndex = state.activeOrders.indexOf(matching);
        const updatedTransactions = state.transactions.length > transactionLogLength
            ? l.insertItem(l.removeItem(state.transactions, 0), transaction)
            : l.insertItem(state.transactions, transaction);
        const updatedPrices = calculatePrices(state, transaction, action.timestamp);

        if (action.quantity >= matching.quantity) {
            const activeOrders = l.removeItem(state.activeOrders, matchingOrderIndex);
            const newState = _.assign({}, state, {
                transactions: updatedTransactions,
                activeOrders: activeOrders,
                avgPrices: updatedPrices
            });
            const updatedAction = _.assign({}, action, { quantity: action.quantity - matching.quantity });
            return addOrder(newState, updatedAction);
        } else {
            const updatedOrder = _.assign({}, matching, { quantity: matching.quantity - action.quantity });
            const activeOrders = l.updateItem(state.activeOrders, updatedOrder, matchingOrderIndex);
            const newState = _.assign({}, state, {
                transactions: updatedTransactions,
                activeOrders: activeOrders,
                avgPrices: updatedPrices
            });
            return newState;
        }
    }
}

function calculatePrices(state: ScreenState, transaction: Transaction, timestamp: number): PricesEntry[] {
    const lastPrices = state.avgPrices.length ? _.last(state.avgPrices).prices : {};
    const newPrices = _.assign({}, lastPrices);
    newPrices[transaction.product] = transaction.price;
    const entry = { prices: newPrices, timestamp: timestamp };
    const newEntries = l.insertItem(state.avgPrices, entry);
    if (newEntries.length > pricesHistoryLength) {
        return l.removeItem(newEntries, 0);
    } else {
        return newEntries;
    }
}

function findMatchingOrder(orders: Order[], action: AddOrderParams): Order | null {
    const matchingOrders = orders.filter((order) =>
        action.product === order.product && action.direction !== order.direction &&
        ((action.direction === Direction.Buy && action.price >= order.price) ||
         (action.direction === Direction.Sell && action.price <= order.price))
    );
    if (matchingOrders.length === 0) return null;
    return matchingOrders.sort((order) => order.direction === Direction.Buy ? order.price : -order.price)[0];
}

function orderFromAddAction(action: AddOrderParams): Order {
    return {
        direction: action.direction,
        price: action.price,
        product: action.product,
        quantity: action.quantity,
        user: action.user
    };
}