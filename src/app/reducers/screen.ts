import { Action } from 'redux';

import { Actions, AddOrderAction, Direction } from '../actions';

export interface ScreenState {
    transactions: Transaction[];
    activeOrders: Order[];
}

export interface Transaction {
    product: string;
    buyer: string;
    seller: string;
    quantity: number;
    price: number;
    date: Date;
}

export interface Order {
    user: string;
    product: string;
    quantity: number;
    price: number;
    direction: Direction;
}

const initialState: ScreenState = {
    transactions: [],
    activeOrders: []
};

export function screen(state = initialState, action: Action) {
    switch (action.type) {
        case Actions.addOrder:
            const addOrderAction = <AddOrderAction>action;
            return addOrder(state, addOrderAction);
        default:
            return state;
    }
}

function addOrder(state: ScreenState, action: AddOrderAction): ScreenState {
    const matching = findMatchingOrder(state.activeOrders, action);
    if (matching === null) {
        if (action.quantity === 0) {
            return state;
        } else {
            return Object.assign({}, state, { activeOrders: [ ...state.activeOrders, orderFromAddAction(action) ] });
        }
    } else {
        const transaction: Transaction = {
            product: action.product,
            buyer: action.direction === Direction.Buy ? action.user : matching.user,
            seller: action.direction === Direction.Sell ? action.user : matching.user,
            quantity: Math.min(matching.quantity, action.quantity),
            price: matching.price,
            date: new Date(),
        };
        const matchingOrderIndex = state.activeOrders.indexOf(matching);
        const updatedTransactions = [ ...state.transactions, transaction ];
        if (action.quantity > matching.quantity) {
            return addOrder(
                {
                    transactions: updatedTransactions,
                    activeOrders: removeItem(state.activeOrders, matchingOrderIndex)
                }, 
                Object.assign({}, action, { quantity: action.quantity - matching.quantity })
            );
        } else {
            const updatedOrder = Object.assign({}, matching, { quantity: matching.quantity - action.quantity });
            return {
                transactions: updatedTransactions,
                activeOrders: updateItem(state.activeOrders, updatedOrder, matchingOrderIndex)
            };            
        }
    }
}

function findMatchingOrder(orders: Order[], action: AddOrderAction): Order | null {
    const matchingOrders = orders.filter((order) =>
        action.product === order.product && action.direction !== order.direction &&
        ((action.direction === Direction.Buy && action.price >= order.price) ||
         (action.direction === Direction.Sell && action.price <= order.price))
    );
    if (matchingOrders.length === 0) return null;
    return matchingOrders.sort((order) => order.direction === Direction.Buy ? order.price : -order.price)[0];
}

function orderFromAddAction(action: AddOrderAction): Order {
    return action;
}

function insertItem<T>(array: T[], item: T, index: number): T[] {
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