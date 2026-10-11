export const money = (n, digits = 2) => `₹${Number(n).toFixed(digits)}`;
