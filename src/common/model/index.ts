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

export interface ProductQuantity {
    product: string;
    quantity: number;
}

export type PriceDictionary = { [id: string]: number };

export type PricesEntry = { prices: PriceDictionary, timestamp: number };

export type QuantityDictionary = { [id: string]: number };

export enum Direction {
    Buy,
    Sell
}

export const Products = [ 'mithril', 'crystals', 'mercury', 'credits' ];

export interface ScreenState {
    modified: number,
    transactions: Transaction[];
    activeOrders: Order[];
    avgPrices: PricesEntry[]
}