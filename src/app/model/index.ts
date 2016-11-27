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

export enum Direction {
    Buy,
    Sell
}