export function checkItemIsDigit(item: string, fallback: number): number {
    const convertedItem = parseInt(item);
    return isNaN(convertedItem)? fallback: convertedItem;
}
