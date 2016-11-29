export interface Transaction {
    product: string;
    buyer: string;
    seller: string;
    quantity: number;
    price: number;
    date: number;
}

export interface Order {
    user: string;
    product: string;
    quantity: number;
    price: number;
    direction: Direction;
}

export interface ProductPrice {
    product: string;
    ask: number;
    bid: number;
}

export enum Direction {
    Buy,
    Sell
}