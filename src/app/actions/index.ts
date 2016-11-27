import { Action } from 'redux';

export const Actions = {
    addOrder: "AddOrderAction"
}

export enum Direction {
    Buy,
    Sell
}

export class AddOrderAction implements Action {
    type: string = Actions.addOrder;

    constructor(
        public user: string,
        public product: string,
        public quantity: number,
        public price: number,
        public direction: Direction
    ) {}
}