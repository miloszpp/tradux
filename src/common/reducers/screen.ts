import * as _ from "lodash";

import { Order, Transaction, Direction, PriceDictionary } from '../model';

export interface AddOrderParams {
    type: string;
    user: string;
    product: string;
    quantity: number;
    price: number;
    direction: Direction;
    timestamp: number;
}

export interface ScreenState {
    modified: number,
    transactions: Transaction[];
    activeOrders: Order[];
    avgPrices: { prices: PriceDictionary, timestamp: number }[]
}

export function addOrder(state: ScreenState, action: AddOrderParams): ScreenState {
    if (action.quantity === 0) {
        return state;
    }
    const matching = findMatchingOrder(state.activeOrders, action);
    if (matching === null) {
        const activeOrders = insertItem(state.activeOrders, orderFromAddAction(action));
        const avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
        return (<any>Object).assign({}, state, { activeOrders: activeOrders, avgPrices: insertItem(state.avgPrices, avgPrices) });
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
        const updatedTransactions = [ ...state.transactions, transaction ];
        if (action.quantity >= matching.quantity) {
            const activeOrders = removeItem(state.activeOrders, matchingOrderIndex);
            const avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
            return addOrder(
                {
                    transactions: updatedTransactions,
                    activeOrders: activeOrders,
                    avgPrices: insertItem(state.avgPrices, avgPrices),
                    modified: state.modified
                }, 
                (<any>Object).assign({}, action, { quantity: action.quantity - matching.quantity })
            );
        } else {
            const updatedOrder = (<any>Object).assign({}, matching, { quantity: matching.quantity - action.quantity });
            const activeOrders = updateItem(state.activeOrders, updatedOrder, matchingOrderIndex);
            const avgPrices = { prices: calculateAveragePrices(activeOrders), timestamp: action.timestamp };
            return {
                transactions: updatedTransactions,
                activeOrders: activeOrders,
                avgPrices: insertItem(state.avgPrices, avgPrices),
                modified: state.modified
            };
        }
    }
}

function calculateAveragePrices(orders: Order[]): PriceDictionary {
    const ordersByProduct = _.groupBy(orders, (order) => order.product);
    const products = _.map(ordersByProduct, (productOrders, product) => product);
    const avgPrices = _.map(ordersByProduct, (productOrders, product) => {
        const nom = _.sum(_.map(productOrders, (order) => order.price * order.quantity));
        const denom = _.sum(_.map(productOrders, (order) => order.quantity));
        return nom / denom;
    });
    return _.zipObject<PriceDictionary>(products, avgPrices);
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

function insertItem<T>(array: T[], item: T, index: number = array.length): T[] {
    return [
        ...array.slice(0, index),
        item,
        ...array.slice(index)
    ];
}

function removeItem<T>(array: T[], index: number) {
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1)
    ];
}

function updateItem<T>(array: T[], newItem: T, itemIndex: number): T[] {
    return array.map((item, index) => {
        if (index !== itemIndex) {
            return item;
        }
        return newItem;    
    });
}