import { Action } from 'redux';
import * as _ from "lodash";

import { Order, Transaction, Direction, PriceDictionary, ScreenState } from '../../common/model';
import { addOrder, AddOrderParams } from '../../common/reducers/screen';

import { Actions } from '../actions';

const initialState: ScreenState = {
    transactions: [],
    activeOrders: [],
    avgPrices: [],
    modified: 0
};

export function screen(state = initialState, action: Action) {
    switch (action.type) {
        case Actions.addOrder:
            const addOrderAction = <AddOrderParams>action;
            return addOrder(state, addOrderAction);
        default:
            return state;
    }
}