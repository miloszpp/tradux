export function insertItem<T>(array: T[], item: T, index: number = array.length): T[] {
    return [
        ...array.slice(0, index),
        item,
        ...array.slice(index)
    ];
}

export function removeItem<T>(array: T[], index: number): T[] {
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1)
    ];
}

export function updateItem<T>(array: T[], newItem: T, itemIndex: number): T[] {
    return array.map((item, index) => {
        if (index !== itemIndex) {
            return item;
        }
        return newItem;    
    });
}