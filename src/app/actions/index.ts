import { Action } from 'redux';
import { Direction } from '../model';

export const Actions = {
    addOrder: "AddOrderAction"
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

export function addOrder(
    user: string,
    product: string,
    quantity: number,
    price: number,
    direction: Direction,
    timestamp: number
    ): AddOrderAction {
        return { user, product, quantity, price, direction, type: Actions.addOrder, timestamp }
    }