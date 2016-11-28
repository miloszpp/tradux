/* tslint:disable:no-unused-variable */
import { screen } from './screen';
import { addOrder } from '../actions';
import { Order, Direction } from '../model';

describe('OrderFormComponent', () => {

    const sampleOrder: Order = {
        direction: Direction.Buy,
        price: 100,
        quantity: 100,
        product: "gold",
        user: "user"
    };

    it('should return the initial state', () => {
        expect(screen(undefined, { type: '' })).toEqual({
            transactions: [],
            activeOrders: []
        });
    });

    it('should match and close order', () => {
        const action = addOrder(
            "user",
            "gold",
            100,
            100,
            Direction.Sell
        );
        const initial = {
            transactions: [],
            activeOrders: [ sampleOrder ]
        }
        const newState = screen(initial, action);
        expect(newState.transactions.length).toBe(1);
        expect(newState.activeOrders).toEqual([]);
    });

    it('should match order but not close it ', () => {
        const action = addOrder(
            "user",
            "gold",
            80,
            100,
            Direction.Sell
        );
        const initial = {
            transactions: [],
            activeOrders: [ sampleOrder ]
        }
        const newState = screen(initial, action);
        expect(newState.transactions.length).toBe(1);
        expect(newState.activeOrders).toEqual([{
            direction: Direction.Buy,
            price: 100,
            quantity: 20,
            product: "gold",
            user: "user"
        }]);
    });

    it('should match order, close it and create new order', () => {
        const action = addOrder(
            "user",
            "gold",
            120,
            100,
            Direction.Sell
        );
        const initial = {
            transactions: [],
            activeOrders: [ sampleOrder ]
        }
        const newState = screen(initial, action);
        expect(newState.transactions.length).toBe(1);
        expect(newState.activeOrders).toEqual([{
            direction: Direction.Sell,
            price: 100,
            quantity: 20,
            product: "gold",
            user: "user"
        }]);
    });

    it('should match two orders', () => {
        const action = addOrder(
            "user",
            "gold",
            200,
            100,
            Direction.Sell
        );
        const initial = {
            transactions: [],
            activeOrders: [ sampleOrder, Object.assign({}, sampleOrder) ]
        }
        const newState = screen(initial, action);
        expect(newState.transactions.length).toBe(2);
        expect(newState.activeOrders).toEqual([]);
    });

    it('not match order with worse price', () => {
        const action = addOrder(
            "user",
            "gold",
            100,
            110,
            Direction.Sell
        );
        const initial = {
            transactions: [],
            activeOrders: [ sampleOrder ]
        }
        const newState = screen(initial, action);
        expect(newState.transactions.length).toBe(0);
        expect(newState.activeOrders.length).toBe(2);
    });

    it('should match only one order', () => {
        const action = addOrder(
            "user",
            "gold",
            100,
            100,
            Direction.Sell
        );
        const initial = {
            transactions: [],
            activeOrders: [ sampleOrder, Object.assign({}, sampleOrder) ]
        }
        const newState = screen(initial, action);
        expect(newState.transactions.length).toBe(1);
    });

});
