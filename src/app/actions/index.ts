import { Action } from 'redux';
import { Direction } from '../model';

export const Actions = {
    addOrder: "AddOrderAction",
    authenticate: "AuthenticateAction"
}

export interface AddOrderAction extends Action {
    type: string;
    user: string;
    product: string;
    quantity: number;
    price: number;
    direction: Direction;
    timestamp: number;
}

export interface AuthenticateAction extends Action {
    username: String;
}

export function addOrder(
    user: string,
    product: string,
    quantity: number,
    price: number,
    direction: Direction,
    timestamp: number
    ): AddOrderAction {
        return { type: Actions.addOrder, user, product, quantity, price, direction, timestamp }
    }

export function authenticate(username: String): AuthenticateAction {
    return { type: Actions.authenticate, username: username };
}