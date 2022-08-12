export function getPercentage(a: number, b: number): number {
    return (a * b) / 100;
}

export function sumOfObjectProperties(obj: { [x: string]: any }) {
    return Object.keys(obj).reduce(
        (sum, key) => sum + parseFloat(obj[key] || 0),
        0
    );
}

export function addOrSubtractRandomPercentage(num: number) {
    const posOrNeg = Math.random() < 0.5 ? -1 : 1;

    // We're going to randomly add or subtract 20% from the number.
    let amount = (Math.floor(Math.random() * 20) + 1) / 100;

    // If negative, always make number negative.
    if (posOrNeg === -1) {
        amount = -Math.abs(amount);
    }

    // Add or subtract percentage from our given number.
    const total = num + num * amount;

    // Round to whole number and return.
    return Math.floor(total);
}

export function filterArrayByProperty(
    array: any[],
    keys: string[],
    value: any
) {
    return array.filter((o) =>
        keys.some((k) =>
            String(o[k]).toLowerCase().includes(value.toLowerCase())
        )
    );
}
