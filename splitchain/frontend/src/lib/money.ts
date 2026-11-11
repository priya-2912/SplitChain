export function parseRupeesToPaise(value: string): bigint {
  const clean = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(clean))
    throw new Error(
      "Enter a valid INR amount with at most two decimal places.",
    );
  const [rupees, fraction = ""] = clean.split(".");
  return BigInt(rupees) * 100n + BigInt((fraction + "00").slice(0, 2));
}
export function formatPaiseToRupees(value: bigint): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  return `${negative ? "-" : ""}₹${absolute / 100n}.${(absolute % 100n).toString().padStart(2, "0")}`;
}
