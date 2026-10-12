// Joins class names, skipping falsy values.
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default cn;
